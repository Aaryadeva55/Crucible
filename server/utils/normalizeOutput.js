const normalizeOutput = (output) => {
    return output
        .trim()
        .split(/\s+/)
        .join(' ')
}

module.exports = normalizeOutput