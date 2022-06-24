import jwt from 'jsonwebtoken'
import { ValidationError } from '#error'

export default {
    sign: payload => jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '1h'}),
    verify: token => {
        try {
            return jwt.verify(token, process.env.SECRET_KEY)
        } catch (er) {
            throw new ValidationError(400, er.message)
        }
    }
}