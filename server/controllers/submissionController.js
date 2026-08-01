const Submission = require('../models/submissionModel')

exports.getSubmission = async (req, res) => {
    const submission = await Submission.findById(req.params.id)

    if (!submission) {
        res.status(404).end()
    }

    if (submission.user.toString() !== req.user.id) {
        return res.status(403).json({
            error: 'Forbidden'
        })
    }

    res.json(submission)
}