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

const BookSchema = Joi.object({
    user_id: Joi.string().guid({
        version: [
            'uuidv4',
            'uuidv5'
        ]
    }).required(),
    book_name: Joi.string()
            .min(2)
            .max(256)
            .required(),
    book_author: Joi.string()
                    .min(2)
                    .max(256)
                    .required(),
    book_category: Joi.string()
                    .valid(Joi.in(["Fiction", "Non-Fiction", "Novel", "Romance", "Self-Help Books", "Children’s Books", 
                    "Biography", "Autobiography", "Text-books", "Political Books", "Academic Books", "Mystery",
                    "Thrillers", "Poetry Books", "Spiritual Books", "Cook Books", "Art Books", "Young Adult Books",
                    "Board Books", "History Books"]))
                    .required(),
    book_mode: Joi.string()
                    .valid(Joi.in(['rent', 'sell']))
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
                    .required()

})

export default {
    register: data => {
        return RegSchema.validate(data)
    },
    bookPost: data => {
        return BookSchema.validate(data)
    }
}