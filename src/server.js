import express from "express"
import { join } from 'path'
import './conf.js'
import dbConnection from './utils/db.js'
import { RegisterRouter, LoginRouter, BookRouter, OrderRouter, LocationRouter } from "./modules/index.js"
import errorHandler from "#errorHandler"
import Category from './data/category.js'
import Location from './data/location.js'
import fileUpload from 'express-fileupload'

!async function() {
    const app = express()
    const sequelize = await dbConnection()
    await Category({ sequelize })
    await Location({ sequelize })

    // middleware
    app.use(express.json())
    app.use(fileUpload())
    app.use(express.static(join(process.cwd(), 'src', 'images')))
    app.use((req, res, next) => {
        req.models = sequelize.models
        req.sequelize = sequelize
        next()
    })
    // routers
    app.use(LocationRouter)
    app.use(RegisterRouter)
    app.use(LoginRouter)
    app.use(BookRouter)
    app.use(OrderRouter)

    //error handler
    app.use(errorHandler)
   

    app.listen(5000, () => console.log('=> 5000'))
}()