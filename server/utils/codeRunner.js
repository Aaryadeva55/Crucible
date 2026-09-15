const fs = require('fs')
const os = require('os')
const path = require('path')
const { exec } = require('child_process')

const runSubmission = (code) => {
    return new Promise((resolve) => {
        const tempDir = fs.mkdtempSync(
            path.join(os.tmpdir(), 'crucible-')
        )

        const sourceFile = path.join(tempDir, 'submission.cpp')

        fs.writeFileSync(sourceFile, code)

        const command = `docker run --rm -v "${tempDir}:/app" gcc:latest sh -c "cd /app && g++ submission.cpp -o submission && ./submission"`

        exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
            try {
                if (error) {
                    resolve({
                        success: false,
                        stdout,
                        stderr,
                        timedOut: error.killed
                    })

                    return
                }

                resolve({
                    success: true,
                    stdout,
                    stderr,
                    timedOut: false
                })

            } finally {
                fs.rmSync(tempDir, { recursive: true, force: true })
            }
        })
    })
}

module.exports = runSubmission
