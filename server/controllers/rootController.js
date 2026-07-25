exports.root = async (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Crucible API is running"
    })
}
