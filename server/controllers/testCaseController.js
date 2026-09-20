const TestCase = require('../models/testCaseModel')
const Problem = require('../models/problemModel')

exports.createTestCase = async (req, res) => {
    const problem = await Problem.findById(req.body.problem)

    if (!problem) {
        return res.status(404).json({
            error: 'Problem not found'
        })
    }

    if (problem.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
            error: 'Only the problem creator can manage test cases'
        })
    }

    const testCase = new TestCase({
        problem: problem.id,
        input: req.body.input,
        expectedOutput: req.body.expectedOutput
    })

    const savedTestCase = await testCase.save()

    res.status(201).json(savedTestCase)
}

exports.getProblemTestCases = async (req, res) => {
    const problem = await Problem.findById(req.params.problemId)

    if (!problem) {
        return res.status(404).json({
            error: 'Problem not found'
        })
    }

    const testCases = await TestCase.find({
        problem: problem.id
    })

    res.json(testCases)
}

exports.updateTestCase = async (req, res) => {
    const testCase = await TestCase.findById(req.params.id)

    if (!testCase) {
        return res.status(404).json({
            error: 'Test case not found'
        })
    }

    const problem = await Problem.findById(testCase.problem)

    if (!problem) {
        return res.status(404).json({
            error: 'Problem not found'
        })
    }

    if (problem.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
            error: 'Only the problem creator can manage test cases'
        })
    }

    if (problem.isPublished) {
        return res.status(403).json({
            error: 'Published problems cannot be modified'
        })
    }

    const { input, expectedOutput } = req.body

    if (input !== undefined) {
        testCase.input = input
    }

    if (expectedOutput !== undefined) {
        testCase.expectedOutput = expectedOutput
    }

    const updatedTestCase = await testCase.save()

    res.json(updatedTestCase)
}

exports.deleteTestCase = async (req, res) => {
    const testCase = await TestCase.findById(req.params.id)

    if (!testCase) {
        return res.status(404).json({
            error: 'Test case not found'
        })
    }

    const problem = await Problem.findById(testCase.problem)

    if (!problem) {
        return res.status(404).json({
            error: 'Problem not found'
        })
    }

    if (problem.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
            error: 'Only the problem creator can manage test cases'
        })
    }

    if (problem.isPublished) {
        return res.status(403).json({
            error: 'Published problems cannot be modified'
        })
    }

    await TestCase.findByIdAndDelete(req.params.id)

    res.status(204).end()
}