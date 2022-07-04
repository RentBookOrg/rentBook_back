import { Sequelize } from "sequelize"
import models from "../models/index.js"

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.HOST,
    username: process.env.USERNAME,
    database: process.env.DATABASE,
    password: process.env.DB_PASS,
    logging: false
})

export default async function () {
    try {
        // connect
        await sequelize.authenticate()
        console.log('Db Connection has been established successfully.')

        // load models
        await models({ sequelize })
        console.log('models are loaded!')

        // sync
        await sequelize.sync({ alter: true })
        console.log('models are syncronized!')

        return sequelize
    } catch(e) {
        console.log('db connection error')
        console.log(e.message)
    }
}