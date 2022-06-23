import joi from '#joi'
import jwt from '#token'
import sendMail from './sendMail.js'
import { NotFoundError, ValidationError, InternalServerError } from '#error'

const POST = async (req, res, next) => {
    try {
        const {error, value} = joi.register(req.body)
    
        if(error) {
            next(new ValidationError(400, error.message))
            return
        }
        // insert data to database
        const newUser = await req.models.User.create( value )

        // create token
        const token = jwt.sign({user_id: newUser.user_id})
        
        // send verification email to the user
        await sendMail(newUser.user_id, token, newUser.user_email)

        res.status(200).json({ message: 'please verify your email', token, status: 200 })
  
    } catch (error) {
        next(new InternalServerError(500, error.message) )
    } 
} 

const VERIFY = async (req, res, next) => {
    try {
        // get user from db
        const user = await req.models.User.findOne({ where: { user_id: req.params.id } }) 
        if(!user) {
            next(new NotFoundError(404, "such user is not fount!"))
        }

        // token parse
        const { user_id } = jwt.verify(req.params.token)

        if(user_id != user.user_id) {
            next(new ValidationError(400, 'token is not matched with original one'))
        }

        // update the user status
        user.user_verified = true
        await user.save()

        res.status(200)
            .json({ message: 'Email verified successfully', status: 200 })
    } catch (e) {
        next(new InternalServerError(500, e.message))
    }
}


export default {
    POST,
    VERIFY
}