const languageRunners = {
    cpp: {
        image: 'gcc:latest',
        sourceFile: 'submission.cpp',
        compileCommand: 'cd /app && g++ submission.cpp -o submission',
        runCommand: 'cd /app && ./submission'
    },

    python: {
        image: 'python:3.13',
        sourceFile: 'submission.py',
        compileCommand: null,
        runCommand: 'cd /app && python submission.py'
    },

    java: {
        image: 'eclipse-temurin:21',
        sourceFile: 'Main.java',
        compileCommand: 'cd /app && javac Main.java',
        runCommand: 'cd /app && java Main'
    },

    javascript: {
        image: 'node:24',
        sourceFile: 'submission.js',
        compileCommand: null,
        runCommand: 'cd /app && node submission.js'
    }
}

module.exports = languageRunners