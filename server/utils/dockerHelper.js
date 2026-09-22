const { exec } = require('child_process')

const startContainer = (tempDir) => {
    return new Promise((resolve, reject) => {
        const command = `docker run -d --rm -v "${tempDir}:/app" gcc:latest sleep 300`

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(stderr))
                return
            }

            resolve(stdout.trim())
        })
    })
}

const execInContainer = (containerId, command, timeout = 2000) => {
    return new Promise((resolve) => {
        exec(
            `docker exec ${containerId} sh -c "${command}"`,
            { timeout },
            (error, stdout, stderr) => {
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
            }
        )
    })
}

const stopContainer = (containerId) => {
    return new Promise((resolve) => {
        exec(
            `docker rm -f ${containerId}`,
            (error) => {
                resolve()
            }
        )
    })
}

module.exports = { startContainer, execInContainer, stopContainer }