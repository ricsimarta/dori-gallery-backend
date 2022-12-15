const { v4: uuidv4 } = require('uuid')
const { db, bucket } = require('./../db')

const gallery = db.collection('dori-gallery')

module.exports.getAllImages = async (req, res) => {
  try {
    const docs = await gallery.get()
    const imagesData = []
    docs.forEach(doc => imagesData.push(doc.data()))

    res.json(imagesData)
  } catch (err) {
    res.send(err)
  }
}

module.exports.getAllImageIds = async (req, res) => {
  try {
    const docs = await gallery.get()
    const imagesIds = []
    docs.forEach(doc => imagesIds.push(doc.data().id))

    res.json(imagesIds)
  } catch (err) {
    res.send(err)
  }
}

module.exports.getImageById = async (req, res) => {
  try {
    const imageId = parseInt(req.params.id)
    if (isNaN(imageId)) return res.send('not a number')

    const docs = await gallery.where('id', '==', imageId).get()
    const imagesData = []
    docs.forEach(doc => imagesData.push(doc.data()))

    res.json(imagesData)
  } catch (err) {
    res.send(err)
  }
}

module.exports.addNewImage = async (req, res) => {
  try {
    const uploadedImageName = req.files.image.name
    const extension = uploadedImageName.substring(uploadedImageName.indexOf('.'))
    const imageName = uuidv4() + extension

    bucket.file(`images/${imageName}`).save(req.files.image.data)
      .then(() => {
        console.log('uploaded: ', imageName)

        bucket.file(`images/${imageName}`).getMetadata()
          .then(async resp => {
            const imageLink = 'https://firebasestorage.googleapis.com/v0' + resp[0].mediaLink.substring(50)

            try {
              const docs = await gallery.get()

              const imagesData = []
              docs.forEach(doc => imagesData.push(doc.data()))

              const sortedImages = imagesData.sort((a, b) => a.id - b.id)

              const now = new Date()
              const newDoc = {
                id: sortedImages.length > 0 ? sortedImages[sortedImages.length - 1].id + 1 : 1,
                url: imageLink,
                date: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`
              }

              const response = await gallery.doc().set(newDoc)

              res.send(response)
            } catch (err) {
              console.log(err)
              res.send(err)
            }
          })
          .catch(err => res.send(err))
      })
      .catch((err) => {
        console.log('err: ', err)
        res.send(err)
      })

  } catch (err) {
    res.send(err)
  }
}