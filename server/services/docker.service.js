import Docker from 'dockerode'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
dotenv.config()

const docker = new Docker()
const TIMEOUT = parseInt(process.env.DOCKER_TIMEOUT) || 60000

export const runInDocker = async (codeFiles, testCommand = 'npm test') => {
  // Skip if Docker is disabled
  if (process.env.DOCKER_ENABLED !== 'true') {
    console.log('[Docker] Disabled — skipping container execution')
    return null
  }

  const containerId = `devlearn-eval-${uuidv4().slice(0, 8)}`
  const tempDir = path.join(os.tmpdir(), containerId)
  let container = null

  try {
    // Write code files to temp directory
    fs.mkdirSync(tempDir, { recursive: true })

    if (typeof codeFiles === 'string') {
      // Single combined code string — write as index.js
      fs.writeFileSync(path.join(tempDir, 'index.js'), codeFiles)
      // Create minimal package.json if not present in code
      if (!codeFiles.includes('"name"')) {
        fs.writeFileSync(
          path.join(tempDir, 'package.json'),
          JSON.stringify({ name: 'student-submission', version: '1.0.0', scripts: { test: 'echo "No tests configured"' } })
        )
      }
    }

    // Create container
    container = await docker.createContainer({
      Image: 'node:18-alpine',
      name: containerId,
      Cmd: ['sh', '-c', `cd /app && npm install --production 2>&1 && ${testCommand} 2>&1`],
      WorkingDir: '/app',
      HostConfig: {
        Binds: [`${tempDir}:/app`],
        Memory: 256 * 1024 * 1024,       // 256MB memory limit
        MemorySwap: 256 * 1024 * 1024,   // No swap
        CpuPeriod: 100000,
        CpuQuota: 50000,                  // 50% CPU
        NetworkMode: 'none',              // No network access
      },
    })

    await container.start()

    // Wait for container with timeout
    const result = await Promise.race([
      container.wait(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Container timed out')), TIMEOUT)
      ),
    ])

    const timedOut = false
    const exitCode = result.StatusCode

    // Get logs
    const logs = await container.logs({ stdout: true, stderr: true, follow: false })
    const output = logs.toString('utf-8')

    return {
      stdout: output,
      stderr: '',
      exitCode,
      timedOut,
    }
  } catch (err) {
    if (err.message === 'Container timed out') {
      // Kill the container on timeout
      try {
        if (container) await container.kill()
      } catch (_) { /* container may already be stopped */ }

      return {
        stdout: '',
        stderr: 'Execution timed out after ' + (TIMEOUT / 1000) + ' seconds',
        exitCode: 124,
        timedOut: true,
      }
    }

    console.error('[Docker] Error:', err.message)
    return {
      stdout: '',
      stderr: err.message,
      exitCode: 1,
      timedOut: false,
    }
  } finally {
    // Cleanup: remove container and temp directory
    try {
      if (container) {
        await container.remove({ force: true })
      }
    } catch (_) { /* ignore cleanup errors */ }

    try {
      fs.rmSync(tempDir, { recursive: true, force: true })
    } catch (_) { /* ignore cleanup errors */ }
  }
}
