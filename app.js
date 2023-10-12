// * --------------------- --------------------- MODULE DEPENDENCIES
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const swaggerUI = require('swagger-ui-express') 
const swaggerJSDoc = require('swagger-jsdoc')  
const mongoose = require('mongoose') // * gunakan mmongoose
const morgan = require('morgan')

// * CONST
const PORT = process.env.PORT


// * ROUTES
const authRoutes = require('./routes/auths')
const cronRoutes = require('./routes/cron-func')
const dayRoutes = require('./routes/days')
const dahsboardRoutes = require('./routes/dashboard')
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
            version: '1.0',
            description: 'Welcome to the API mandorIn documentation! API mandorIn is a powerful and versatile API built with Node.js and Express, seamlessly integrated with MongoDB as its robust database. This API serves as the backbone of Application mandorIn, catering to the diverse needs of both web and mobile platforms. <br>If you encounter any issues or have questions about the API, our dedicated support team is here to assist you.',
            contact: {
                name: 'Kelana Chandra Helyandika',
                url: 'https://kelanach.cyclic.app/',
                email: 'kelanachandra7@gmail.com'
            }
        },
        servers: [
            {
                url: 'https://mandorin-be-mdmlfcl63q-et.a.run.app',
                description: 'Production Server (Cloud Run)'
            },
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
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(helmet({
    contentSecurityPolicy: false, // disable content security policy
    hidePoweredBy: true, // hide X-Powered-By header
    hsts: false, // { maxAge: 31536000, includeSubDomains: true }, // enable HSTS with maxAge 1 year and includeSubDomains
    noCache: true, // enable noCache header
    referrerPolicy: { policy: 'no-referrer' } // set referrer policy to no-referrer
}))

const customFormat = ':date[iso] | :status | :response-time ms | :remote-addr | :method :url';
app.use(morgan(customFormat)); // ? set morgan console logging


// * ------ ROUTES SET
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs))

app.use(authRoutes)
app.use('/cron-funcs', cronRoutes)
app.use('/dashboard', dahsboardRoutes)
app.use('/users', userRoutes)
app.use('/roles', roleRoutes)
app.use('/workhours', workhourRoutes)
app.use('/days', dayRoutes)
app.use('/projects/daily-notes', projectDailyNotesRoutes)
app.use('/projects', projectRoutes)


// * ------ GLOBAL ERROR HANDLING
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
        await mongoose.connect(process.env.MONGODB_URI)
        app.listen(PORT)
        console.log('Connected, see swagger documentation on http://localhost:' + process.env.PORT + '/api-docs')
    } catch (e){
        console.log(e)
    }
}
startServer()