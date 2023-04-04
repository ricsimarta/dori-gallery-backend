const express = require('express')
const router = express.Router()
const imageController = require('./../controllers/imageController')

router.get('/', imageController.getAllImages)
router.get('/id/:id', imageController.getImageById)
router.get('/ids', imageController.getAllImageIds)

router.post('/new-image', imageController.addNewImage)

router.delete('/id/:id', imageController.deleteImageById)

module.exports = router