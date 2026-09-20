const mongoose = require('mongoose')

const testCaseSchema = new mongoose.Schema({
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },

    input: {
        type: String,
        required: true
    },

    expectedOutput: {
        type: String,
        required: true
    }
}, { timestamps: true })

testCaseSchema.index({ problem: 1 })

testCaseSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('TestCase', testCaseSchema)