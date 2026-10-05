const fs = require('fs')
const os = require('os')
const path = require('path')
const { performance } = require('perf_hooks')
const { startContainer, execInContainer, checkOOMKilled, stopContainer } = require('./dockerHelper')
const languageRunners = require('./languageRunners')
const normalizeOutput = require('./normalizeOutput')

const runSubmission = async (code, testCases, language) => {
    const runner = languageRunners[language]

    if (!runner) {
        return {
            status: 'Internal Error'
        }
    }

    const tempDir = fs.mkdtempSync(
        path.join(os.tmpdir(), 'crucible-')
    )

    const sourceFile = path.join(tempDir, runner.sourceFile)

    fs.writeFileSync(sourceFile, code)

    let containerId

    try {
        containerId = await startContainer(tempDir, runner.image)

        console.log('Container started:', containerId)

        const result = runner.compileCommand 
            ? await execInContainer(
                containerId,
                runner.compileCommand,
                10000
            )
            : { success: true }

        if (!result.success) {
            console.log('Compilation failed:')
            console.log(result.stderr)
            return {
                status: 'Compilation Error',
                runtime: null
            }
        }

        if (runner.compileCommand) {
            console.log('Compilation successful!')
        }

        let totalRuntime = 0

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i]
            const inputFile = path.join(tempDir, 'input.txt')

            fs.writeFileSync(inputFile, testCase.input)

            const startTime = performance.now()

            const result = await execInContainer(
                containerId,
                `${runner.runCommand} < input.txt`
            )

            const endTime = performance.now()

            const runtime = endTime - startTime

            totalRuntime += runtime

            if (result.timedOut) {
                console.log('Time Limit Exceeded')

                return {
                    status: 'Time Limit Exceeded',
                    failedTestCase: i + 1,
                    runtime: totalRuntime
                }
            }

            if (!result.success) {
                const oomKilled = await checkOOMKilled(containerId)

                if (oomKilled) {
                    console.log('Memory Limit Exceeded')

                    return {
                        status: 'Memory Limit Exceeded',
                        failedTestCase: i + 1,
                        runtime: totalRuntime
                    }
                }
                
                console.log('Runtime Error')
                console.log(result.stderr)

                return {
                    status: 'Runtime Error',
                    failedTestCase: i + 1,
                    runtime: totalRuntime
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
                    expectedOutput,
                    runtime: totalRuntime
                }
            }

            console.log('Input:', testCase.input)
            console.log('Output:', result.stdout)
            console.log('Test case passed')
        }
        
        return { 
            status: 'Accepted',
            runtime: totalRuntime
        }
        
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