const fs = require('fs')
const os = require('os')
const path = require('path')
const { startContainer, execInContainer, stopContainer } = require('./dockerHelper')
const normalizeOutput = require('../utils/normalizeOutput')

const runSubmission = async (code, testCases) => {
    const tempDir = fs.mkdtempSync(
        path.join(os.tmpdir(), 'crucible-')
    )

    const sourceFile = path.join(tempDir, 'submission.cpp')

    fs.writeFileSync(sourceFile, code)

    let containerId

    try {
        containerId = await startContainer(tempDir)

        console.log('Container started:', containerId)

        let result = await execInContainer(
            containerId,
            'cd /app && g++ submission.cpp -o submission'
        )

        if (!result.success) {
            console.log('Compilation failed:')
            console.log(result.stderr)
            return {
                status: 'Compilation Error'
            }
        }

        let status = 'Accepted'

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i]
            const inputFile = path.join(tempDir, 'input.txt')

            fs.writeFileSync(inputFile, testCase.input)

            const result = await execInContainer(
                containerId,
                'cd /app && ./submission < input.txt'
            )

            if (result.timedOut) {
                console.log('Time Limit Exceeded')

                return {
                    status: 'Time Limit Exceeded',
                    failedTestCase: i + 1
                }
            }

            if (!result.success) {
                console.log('Runtime Error')
                console.log(result.stderr)

                return {
                    status: 'Runtime Error',
                    failedTestCase: i + 1
                }
            }

            const actualOutput = normalizeOutput(result.stdout)
            const expectedOutput = normalizeOutput(testCase.expectedOutput)

            if (actualOutput !== expectedOutput) {
                console.log('Wrong Answer')
                return {
                    status: 'Wrong Answer',
                    failedTestCase: i + 1,
                    actualOutput,
                    expectedOutput
                }
            }

            console.log('Input:', testCase.input)
            console.log('Output:', result.stdout)
            console.log('Test case passed')
        }
        
        console.log('Compilation successful!')
        return { status }
        
    } finally {
        if (containerId) {
            await stopContainer(containerId)
        }

        fs.rmSync(tempDir, {
            recursive: true,
            force: true
        })

        console.log('Cleaned up.')
    }
}

module.exports = runSubmission