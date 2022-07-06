import joi from '#joi'
import jwt from '#token'
import sendMail from './sendMail.js'
import { NotFoundError, ValidationError, InternalServerError } from '#error'

const POST = async (req, res, next) => {
    try {
        // validation
        const {error, value} = joi.register(req.body)
        
        if(error) {
            next(new ValidationError(400, error.message))
            return
        }

        let user = undefined
        // catch error if user_email is invalid
        try {
            user = await req.models.User.findOne({ where: { user_email: value.user_email } })
        } catch (error) {
            next(new ValidationError(400, error.message))
            return            
        }
        if(user) {
            next(new ValidationError(400, "This user is already registered, please log in"))
            return
        }
        // insert data to database
        let newUser = undefined
        try {
            newUser = await req.models.User.create( {
                name: value.name,
                surname: value.surname,
                username: value.username,
                password: value.password,
                user_contact: value.user_contact,
                user_email: value.user_email,
                location_id: value.location_id
            } )
        } catch (error) {
            next(new ValidationError(400, error.message))
            return
        }

        // create token
        const token = jwt.sign({user_id: newUser.user_id})
        
        // send verification email to the user
        await sendMail(newUser.user_id, token, newUser.user_email)

        res.status(200)
            .json({ message: 'please verify your email', token, status: 200, user_id: newUser.user_id })
  
    } catch (error) {
        next(new InternalServerError(500, error.message) )
    } 
} 

const VERIFY = async (req, res, next) => {
    try {
        // get user from db and checking to catch error if params invalid
        let user = undefined
        try {
            user = await req.models.User.findOne({ where: { user_id: req.params.id } }) 
        } catch (error) {
            next(new ValidationError(400, error.message))
            return            
        }

        if(!user) {
            next(new NotFoundError(404, "such user is not fount!"))
            return
        }

        // token parse
        const user_data = jwt.verify(req.params.token)

        if(user_data.user_id != user.user_id) {
            next(new ValidationError(400, 'token is not matched with original one'))
            return
        }

        // update the user status
        user.user_verified = true
        await user.save()

        res.status(200)
            .json({ message: 'Email verified successfully', status: 200 })
    } catch (e) {
        if(e.message == 'invalid token') {
            next(new ValidationError(400, "invalid token, please request resend email verification"))
            return
        }
        next(new InternalServerError(500, e.message))
    }
}

const RESEND_EMAIL = async (req, res, next) => {
   try {
        // get user from db and checking to catch error if params invalid
        let user = undefined
        try {
            user = await req.models.User.findOne({ where: { user_id: req.params.user_id } })
        } catch (error) {
            next(new ValidationError(400, error.message))
            return            
        }

        // check the user
        if(!user) {
            next(new NotFoundError(404, "The user is not fount"))
            return
        }

        // is user verified
        if(user.user_verified) {
            next(new ValidationError(400, "The user is already verified"))
            return
        }

        // create token
        const token = jwt.sign({user_id: user.user_id})
            
        // send verification email to the user
        await sendMail(user.user_id, token, user.user_email)

        res.status(200)
            .json({ status: 200, message: 'Verification email is sent', token, user_id: user.user_id })
   } catch (error) {
       next(new InternalServerError(500, error.message))
   }

}

export default {
    POST,
    VERIFY,
    RESEND_EMAIL
}