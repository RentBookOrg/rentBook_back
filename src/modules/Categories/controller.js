const GET = async (req, res, next) => {
    const categories = await req.models.Category.findAll({  })

    res.status(200).json({ status: 200, message: "All available categories", data: categories })
}

export default {
    GET
}