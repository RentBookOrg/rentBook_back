import { NotFoundError, InternalServerError, ValidationError } from '#error'
import bcrypt from 'bcrypt'

const LOGIN = async (req, res, next) => {
    try {
        let user = undefined
        try {
            user = await req.models.User.findOne({ where: { user_email: req.body.email, username: req.body.username } })
        } catch(error) {
            next(new ValidationError(400, error.message))
            return
        }
        
        if(!user) {
            next(new NotFoundError(404, 'such user does not exist!'))
            return
        }

        // salt to hash
        const salt = await bcrypt.genSaltSync(11, 'a')
        req.body.password = bcrypt.hashSync(req.body.password, user.password)

        if(req.body.password != user.password) {
            next(new ValidationError(400, 'Wrong password'))
            return
        }
        
        res.status(200)
            .json({ status: 200, message: 'successfully logged in', user_id: user.user_id })
    } catch (er) {
        next(new InternalServerError(500, er.message))
    }
}


export default {
    LOGIN
}