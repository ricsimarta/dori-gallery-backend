const express = require('express')
const router = express.Router()
const userController = require('./../controllers/userController')

router.get('/user-role', userController.getUserRole)
router.get('/user-data', userController.getUserData)

router.post('/create-user', userController.createUser)
router.post('/update-user', userController.updateUser)

router.get('/admin', userController.getAllUsers)

module.exports = router