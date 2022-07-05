import { NotFoundError, InternalServerError } from '#error'
const GET = async (req, res, next) => {
    try {
        const user = await req.models.User.findOne({ where: { user_id: req.query.user_id } })

        if(!user) {
            next(new NotFoundError(404, "The user is not fount"))
            return
        }

        res.status(200).json({ status: 200, message: 'The user is fount', data: user })
    } catch (error) {
        next(new InternalServerError(500, error.message))
    }
}

export default {
    GET
}