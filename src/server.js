import express from "express"
import './conf.js'
import dbConnection from './utils/db.js'
import { RegisterRouter, LoginRouter } from "./modules/index.js"
import errorHandler from "#errorHandler"
import Category from './data/category.js'
import Location from './data/location.js'

!async function() {
    const app = express()
    const sequelize = await dbConnection()
    await Category({ sequelize })
    await Location({ sequelize })

    app.use(express.json())
    app.use((req, res, next) => {
        req.models = sequelize.models
        next()
    })

    // routers
    app.use(RegisterRouter)
    app.use(LoginRouter)


    //error handler
    app.use(errorHandler)
   

    app.listen(5000, () => console.log('=> 5000'))
}()