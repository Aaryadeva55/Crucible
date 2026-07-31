const Problem = require('../models/problemModel')

exports.problemPost = async (req, res) => {
    const body = req.body
    const user = req.user

    const problem = new Problem({
        title: body.title,
        difficulty: body.difficulty,
        statement: body.statement,
        constraints: body.constraints,
        examples: body.examples,
        tags: body.tags,
        createdBy: user.id
    })

    const savedProblem = await problem.save()

    res.status(201).json(savedProblem)
}

exports.problemGetAll = async (req, res) => {
    const problems = await Problem.find({ isPublished: true }).populate('createdBy', { username: 1 })

    res.json(problems)
}

exports.problemGetOne = async (req, res) => {
    const problem = await Problem.findOne({ slug: req.params.slug }).populate('createdBy', { username: 1 })

    if (problem) {
        res.json(problem)
    } else {
        return res.status(404).json({
            error: 'Problem not found'
        })
    }
}