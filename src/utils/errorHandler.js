import { writeFileSync } from 'fs'
import { join } from 'path'

export default async function (error, req, res, next) {
    if(error.status != 500) {
        res.status(error.status).json({ status: error.status, message: error.message, error: error.name, data: null })
        return
    }

    const data = `${Date.now()}__${req.url}__${req.method}__${error.name}__${error.message}`
    console.log(data)
    writeFileSync(join(process.cwd(), 'logger.txt'), data)

    res.status(500).json({ status: 500, name: 'InternalServerError', message: 'Internal Server Error', data: null })
}