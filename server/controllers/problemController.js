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

exports.problemPatch = async (req, res) => {
    let problem = await Problem.findOne({ slug: req.params.slug })

    if (!problem) {
        return res.status(404).json({
            error: 'Problem not found'
        })
    }

    if (problem.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ 
            error: 'Forbidden'
        })
    }

    if (problem.isPublished) {
        return res.status(403).json({
            error: 'Published problems cannot be modified'
        })
    }

    const {
        title,
        difficulty,
        statement,
        constraints,
        examples,
        tags
    } = req.body

    const updates = {
        title,
        difficulty,
        statement,
        constraints,
        examples,
        tags
    }

    for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
            problem[key] = value
        }
    }

    const updatedProblem = await problem.save()
    res.status(200).json(updatedProblem)
    
}

exports.problemDelete = async (req, res) => {
    const problem = await Problem.findOne({ slug: req.params.slug })

    if (!problem) {
        return res.status(404).json({
            error: 'Problem not found'
        })
    }

    if (problem.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ 
            error: 'Forbidden'
        })
    }

    if (problem.isPublished) {
        return res.status(403).json({
            error: 'Published problems cannot be modified'
        })
    }

    await problem.deleteOne()
    res.status(204).end()
}

exports.problemPublish = async (req, res) => {
    const problem = await Problem.findOne({ slug: req.params.slug })

    if (!problem) {
        return res.status(404).json({
            error: 'Problem not found'
        })
    }

    problem.isPublished = true

    const updatedProblem = await problem.save()

    res.status(200).json(updatedProblem)
}

exports.problemUnpublish = async (req, res) => {
    const problem = await Problem.findOne({ slug: req.params.slug })

    if (!problem) {
        return res.status(404).json({
            error: 'Problem not found'
        })
    }

    problem.isPublished = false

    const updatedProblem = await problem.save()
    
    res.status(200).json(updatedProblem)
}