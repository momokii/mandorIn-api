// * --------------------- --------------------- MODULE DEPENDENCIES
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const swaggerUI = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
//const sequelize = require('./utils/db')
const mongoose = require('mongoose') // * gunakan mmongoose

// * CONST
const PORT = process.env.PORT

// * IMPORT DB SCHEMA
//require('./utils/db-schema')


// * ROUTES
const authRoutes = require('./routes/auths')
const dayRoutes = require('./routes/days')
// const dailynotesRoutes = require('./routes/daily-notes')
const userRoutes = require('./routes/users')
const roleRoutes = require('./routes/roles')
const projectRoutes = require('./routes/projects')
const projectDailyNotesRoutes = require('./routes/project-dailynotes')
const workhourRoutes = require('./routes/workhours')


// * --------------------- --------------------- APP

// * --------------- SWAGGER CONFIG
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'mandorIn API',
            version: '1.0.0',
            description: 'lorem ipsum',
            contact: {
                name: 'Kelana Chandra Helyandika',
                url: 'https://kelanach.cyclic.app/',
                email: 'kelanachandra7@gmail.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:' + PORT,
                description: 'Local Dev Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type:'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./swagger-doc/*.js']
}
const swaggerSpecs = swaggerJSDoc(swaggerOptions)


// * --------------- APP CONFIG
const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(helmet({
    contentSecurityPolicy: false, // disable content security policy
    hidePoweredBy: true, // hide X-Powered-By header
    hsts: false, // { maxAge: 31536000, includeSubDomains: true }, // enable HSTS with maxAge 1 year and includeSubDomains
    noCache: true, // enable noCache header
    referrerPolicy: { policy: 'no-referrer' } // set referrer policy to no-referrer
}))


// * ------ ROUTES SET
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs))

app.use(authRoutes)
app.use('/users', userRoutes)
app.use('/roles', roleRoutes)
app.use('/workhours', workhourRoutes)
app.use('/days', dayRoutes)
app.use('/projects/daily-notes', projectDailyNotesRoutes)
app.use('/projects', projectRoutes)
// app.use('/daily-notes', dailynotesRoutes)


// * ------ ERROR HANDLING
app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data
    res.status(status).json({
        errors: true,
        message: message,
        data: data
    })
})




// * ------ APP CONNECTIONS
async function startServer(){
    try{

        // * using sql sequelize
        // //* ----------------- ----------------- DEV ENV ----------------- -----------------
        // if(process.env.FORCE_TABLE === 'true1'){
        //     await sequelize.sync({ force: true }) // * force drop and create again table if table exist
        //     const Role = require('./models/roles')
        //     const Day = require('./models/days')
        //     const User = require('./models/users')
        //     const bcrypt = require('bcrypt')
        //
        //     await Role.bulkCreate([
        //         {nama: 'superadmin'},
        //         {nama: 'admin'},
        //         {nama: 'user'}
        //     ])
        //
        //     await Day.bulkCreate([
        //         {nama: 'Sunday'},
        //         {nama: 'Monday'},
        //         {nama: 'Tuesday'},
        //         {nama: 'Wednesday'},
        //         {nama: 'Thursday'},
        //         {nama: 'Friday'},
        //         {nama: 'Saturday'},
        //     ])
        //
        //     const pass = await bcrypt.hash('superadmin1', 12)
        //     await User.create({
        //         username: 'superadmin1',
        //         password: pass,
        //         nama: 'superadmin',
        //         id_role: 1
        //     })
        //
        //     console.log('Drop and Create All Table Again - Dev Environment')
        // }
        // // * ----------------- ----------------- ----------------- -----------------
        //
        //
        // await sequelize.authenticate()
        await mongoose.connect(process.env.MONGODB_URI)
        app.listen(PORT)
        console.log('Connected to PORT ' + process.env.PORT)
    } catch (e){
        console.log(e)
    }
}
startServer()