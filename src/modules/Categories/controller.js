import { InternalServerError } from '#error'
const GET = async (req, res, next) => {
    try {
        const categories = await req.models.Category.findAll({  })

        res.status(200).json({ status: 200, message: "All available categories", data: categories })
    } catch (error) {
        next(new InternalServerError(500, error.message))
    }
}

export default {
    GET
}