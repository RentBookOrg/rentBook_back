import { NotFoundError, ValidationError, InternalServerError } from '#error'
import Joi from "#joi"
import { join } from 'path'

const POST = async (req, res, next) => {
    try {
        //get user from db
        const user = await req.models.User.findOne({ where: { user_id: req.params.user_id } })
        // does user exist
        if(!user) {
            next(new NotFoundError(404, "The user is not found"))
            return
        }
        // is user verified
        if(!user.user_verified) {
            next(new ValidationError(400, "Please, verify your email first!"))
            return
        }
        console.log(req.body)
        
        const { error, value } = Joi.bookPost(req.body)

        // validation
        if(error) {
            next(new ValidationError(error.message))
            return
        }

        if( !(req.files.file.mimetype.includes('image/')) ) {
            next(new ValidationError(400, 'Only image type is accepted'))
            return
        }

        if(req.files.file.size > 5 * 1024 * 1024) {
            next(new ValidationError(400, 'file size should be less than 5MB'))
            return
        }
        // change the name of book
        req.files.file.name = `${Date.now()}${req.files.file.name}`
        console.log(req.body)
        const book = await req.models.Book.create({
            book_name: req.body.book_name,
            book_author: req.body.book_author,
            category_id: req.body.category_id,
            book_mode: req.body.book_mode,
            book_page: req.body.book_page,
            book_description: req.body.book_description,
            book_prize: req.body.book_prize,  
            book_rent_prize: req.body.book_rent_prize,
            book_language: req.body.book_language,
            book_count: req.body.book_count,
            book_status: req.body.book_status,
            book_picture: req.files.file.name,
            user_id: req.params.user_id
        })

        req.files.file.mv(join(process.cwd(), 'src', 'images', req.files.file.name))

        res.status(200).json({ status: 200, message: 'book successfully added', book_id: book.book_id })

    } catch (error) {
        next(new InternalServerError(500, error.message))
    }
}

const DELETE = async (req, res, next) => {
    try {
        // get book from db
        const book = await req.models.Book.findOne({ where: { book_id: req.params.book_id, user_id: req.params.user_id } })
        //validation
        if(!book) {
            next(new NotFoundError(404, "The book is not fount"))
            return
        }
        // make boob's availability false to make it blur in frontend
        book.book_available = false
        await book.save()
        // delete book
        await book.destroy()

        res.status(200)
            .json({ status: 200, message: 'Book is deleted successfully', book_id: book.book_id })
    } catch (error) {
        next(new InternalServerError(500, error.message))
    }
}

const GET_BY_LOCATION = async (req, res, next) => {
    try {
        // get book from location id
        const bookByLocation = await req.sequelize.query(`SELECT b.* FROM books AS b INNER JOIN users AS u ON u.user_id = b.user_id INNER JOIN locations AS l ON l.location_id = '${req.query.location_id}'`)
        // check whether books are available
        if(!bookByLocation) {
            // if not available get all books from all locations
            const books = JSON.parse(JSON.stringify(await req.models.Book.findAll()))
            // if books are available
            if(!books) {
                res.status(400).json({ status: 400, message: "Currently none of books are available" })
                return
            }
            // output books from all locations
            res.status(200).json({ status: 200, message: "Currently books are not available in your area. Please, check other areas books" })
            return
        }
        // books from specific location
        bookByLocation = JSON.parse(JSON.stringify(bookByLocation, null, 4))
        // response
        res.status(200)
            .json({ status: 200, message: 'Books from your location', data: bookByLocation })
    } catch (error) {
        next(new InternalServerError(500, error.message))
    }
}

const GET_BY_USER_ID = async (req, res, next) => {
    try {
        // get book from location id
        const bookByUserId = JSON.parse(JSON.stringify(await req.models.Book.findAll({ where: { user_id: req.query.userId } })))
        
        if(!bookByUserId) {
            next(new NotFoundError(404, "You have not got any books yet"))
            return
        }

        res.status(200).json({ status: 200, message: "Your all books", data: bookByUserId })
        
    } catch (error) {
        next(new InternalServerError(500, error.message))
    }
}
export default {
    POST,
    DELETE,
    GET_BY_LOCATION,
    GET_BY_USER_ID
}