import express from "express"
import './conf.js'
import dbConnection from './utils/db.js'
import RegisterRouter from "./modules/index.js"
import errorHandler from "#errorHandler"

!async function() {
    const app = express()
    const sequelize = await dbConnection()

    app.use(express.json())
    app.use((req, res, next) => {
        req.models = sequelize.models
        next()
    })

    // routers
    app.use(RegisterRouter)


    //error handler
    app.use(errorHandler)
   

    app.listen(5000, () => console.log('=> 5000'))
}()