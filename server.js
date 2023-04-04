require('dotenv').config()

const express = require('express')
const fileUpload = require('express-fileupload')

const app = express()

const imageRoutes = require('./routes/imageRoutes')

app.use(express.json())
app.use(fileUpload())

app.use('/images', imageRoutes)

app.listen(process.env.PORT, () => console.log('http://127.0.0.1:9000'))