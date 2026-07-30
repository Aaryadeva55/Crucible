const mongoose = require('mongoose')

const exampleSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true
    },

    output: {
        type : String,
        required: true
    },

    explanation: {
        type: String,
        required: true
    }
}, { _id: false })

const problemSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard']
    },

    statement: {
        type: String,
        required: true,
        trim: true
    },

    constraints: {
        type: [String],
        validate: {
            validator: (constraints) => {
                return constraints.length > 0
            },
            message: 'At least one constraint is required'
        }
    },

    examples: {
        type: [exampleSchema],
        validate: {
            validator: (examples) => {
                return examples.length > 0
            },
            message: 'At least one example is required'
        }
    },

    tags: [
        {
            type: String,
            trim: true
        }
    ],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    isPublished: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

problemSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})