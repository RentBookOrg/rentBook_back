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
        location_id: Joi.string()
            .required(),
        password: Joi.string()
                .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/))
})

const BookSchema = Joi.object({
    book_name: Joi.string()
            .min(2)
            .max(256)
            .required(),
    book_author: Joi.string()
                    .min(2)
                    .max(256)
                    .required(),
    book_mode: Joi.string()
                .required(),
    book_page: Joi.number()
                    .min(6)
                    .max(1000)
                    .required(),
    book_description: Joi.string()
                        .min(100)
                        .max(1000)
                        .required(),
    book_prize: Joi.number()
                    .min(1000)
                    .max(1000000)
                    .required(),
    book_rent_prize: Joi.number()
                    .min(1000)
                    .max(1000000)
                    .required(),
    book_language: Joi.string()
                    .required(),
    book_count: Joi.number()
                    .min(1)
                    .max(50)
                    .required(),
    book_status: Joi.string()
                    .required(),
    category_id: Joi.string()
                    .required()
})

const OrderSchema = Joi.object({
    name: Joi.string()
            .pattern(new RegExp('^[a-zA-Z]*$'))
            .min(2)
            .max(256)
            .required(),
    surname: Joi.string()
                .pattern(new RegExp('^[a-zA-Z]*$'))
                .min(3)
                .max(256)
                .required(),
    phone: Joi.string()
                .pattern(new RegExp('^998[389][012345789][0-9]{7}$'))
                .required(),
    email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .required(),
    order_mode: Joi.string()
                    .max(4)
                    .required(),
    address: Joi.string()
                .max(256)
                .required(),
    order_returning_date: Joi.string()
                            .date(),
})


export default {
    register: data => {
        return RegSchema.validate(data)
    },
    bookPost: data => {
        try {
            return BookSchema.validate(data)
        } catch (error) {
            return error
        }
    },
    order: data => OrderSchema.validate(data)
}