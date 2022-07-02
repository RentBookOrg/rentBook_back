import { InternalServerError } from '#error'

const GET = async (req, res, next) => {
    try {
        const locations = await req.models.Location.findAll({  })
        
        res.status(200).json({ status: 200, message: 'All available locations', data: locations })
    } catch (error) {
        next(new InternalServerError(500, error.message))
    }
}

export default {
    GET
}