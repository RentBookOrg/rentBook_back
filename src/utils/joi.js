import Joi from "joi"

const RegSchema = Joi.object({
        name: Joi.string()
            .pattern(new RegExp('^[a-zA-Z]*$'))
            .min(2)
            .max(30)
            .required(),
        surname: Joi.string()
            .pattern(new RegExp('^[a-zA-Z]*$'))
            .min(3)
            .max(40)
            .required(),
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(40)
            .required(),
         user_contact: Joi.string()
            .pattern(new RegExp('^998[389][012345789][0-9]{7}$'))
            .required(),
        user_email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        user_location: Joi.string()
            .required(),
        password: Joi.string()
                .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/))
})

export default {
    register: (data) => {
        return RegSchema.validate(data)
    }
}