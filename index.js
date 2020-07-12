// INITIALIZING NPM MODULES
const [express, path] = [require('express'), require('path')]
require('dotenv').config({path : './config/config.env'})
const errorHandler = require(path.join(__dirname, 'middlewares', 'errorHandler'))

// INITIALIZING mongoose db connection
const connectDB = require(path.join(__dirname, 'config', 'db'))
connectDB()


// initializing app module
const app = express()

// Middlewares
app.use(express.urlencoded({extended : true}))
app.use(express.json())

app.use('/api/v1/bootcamps/', require(path.join(__dirname, 'routes', 'bootcamps')))

// Error Hanlder
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {console.log(`server listening on port ${PORT}`)})

process.on('unhandledRejection', (err) => {
    console.log(`unhandledRejection Error : ${err}`)
    server.close(() => process.exit(1))
})