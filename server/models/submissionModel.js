const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },

    language: {
        type: String,
        enum: [
            'cpp',
            'java',
            'python',
            'javascript'
        ],
        required: true
    },

    code: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: [
            'Pending',
            'Running',
            'Accepted',
            'Wrong Answer',
            'Runtime Error',
            'Compilation Error',
            'Time Limit Exceeded',
            'Memory Limit Exceeded',
            'Internal Error'
        ],
        default: 'Pending'
    },

    runtime: {
        type: Number,
        default: null
    },

    memory: {
        type: Number,
        default: null
    }
}, { timestamps: true })

submissionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})