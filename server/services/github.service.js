import { Octokit } from '@octokit/rest'
import dotenv from 'dotenv'
dotenv.config()

const ALLOWED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.json', '.md']
const SKIP_DIRS = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.cache']
const MAX_FILES = 50
const MAX_TOTAL_SIZE = 500 * 1024 // 500KB

function parseGitHubUrl(url) {
  // Handle: https://github.com/owner/repo, https://github.com/owner/repo.git, github.com/owner/repo
  const cleaned = url.replace(/\.git$/, '').replace(/\/$/, '')
  const match = cleaned.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) throw new Error(`Invalid GitHub URL: ${url}`)
  return { owner: match[1], repo: match[2] }
}

function shouldIncludeFile(path) {
  // Skip files in excluded directories
  if (SKIP_DIRS.some(dir => path.includes(`${dir}/`) || path.startsWith(`${dir}/`))) {
    return false
  }
  // Only include allowed extensions or specific root files
  const ext = '.' + path.split('.').pop()
  const filename = path.split('/').pop()
  if (filename === 'package.json' || filename === 'README.md') return true
  return ALLOWED_EXTENSIONS.includes(ext)
}

export const fetchRepoCode = async (repoUrl) => {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN not configured')

  const octokit = new Octokit({ auth: token })
  const { owner, repo } = parseGitHubUrl(repoUrl)

  // Get default branch
  const { data: repoData } = await octokit.repos.get({ owner, repo })
  const defaultBranch = repoData.default_branch

  // Get recursive file tree
  const { data: treeData } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: defaultBranch,
    recursive: 'true',
  })

  // Filter to relevant source files
  const files = treeData.tree
    .filter(item => item.type === 'blob' && shouldIncludeFile(item.path))
    .slice(0, MAX_FILES)

  let combinedCode = ''
  let totalSize = 0

  for (const file of files) {
    if (totalSize >= MAX_TOTAL_SIZE) {
      combinedCode += `\n// === TRUNCATED: Size limit reached (${MAX_TOTAL_SIZE / 1024}KB) ===\n`
      break
    }

    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner,
        repo,
        path: file.path,
        ref: defaultBranch,
      })

      const content = Buffer.from(fileData.content, 'base64').toString('utf-8')
      const fileHeader = `// === FILE: ${file.path} ===\n`
      combinedCode += fileHeader + content + '\n\n'
      totalSize += content.length
    } catch (err) {
      combinedCode += `// === FILE: ${file.path} === (failed to fetch: ${err.message})\n\n`
    }
  }

  if (!combinedCode.trim()) {
    throw new Error('No source code files found in repository')
  }

  return combinedCode
}
