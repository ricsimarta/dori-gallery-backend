require('dotenv').config()

const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')

const app = express()

const imageRoutes = require('./routes/imageRoutes')
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')

app.use(cors())
app.use(express.json())
app.use(fileUpload())

app.use('/images', imageRoutes)
app.use('/users', userRoutes)
app.use('/admin', adminRoutes)

app.listen(process.env.PORT, () => console.log('http://127.0.0.1:9000'))
