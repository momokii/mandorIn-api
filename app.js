// * --------------------- --------------------- MODULE DEPENDENCIES
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const swaggerUI = require('swagger-ui-express')
const mongoose = require('mongoose') // * gunakan mmongoose
const morgan = require('morgan')
const yamljs = require('yamljs')

// * yaml file oas 2.0 spec doc
const opeanapispec = yamljs.load('./swagger-doc/mandorin-oas-3-0.yaml')

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
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(opeanapispec))

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