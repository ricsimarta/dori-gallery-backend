const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const imageRoutes = require('./routes/imageRoutes')

app.use(express.json())
app.use(fileUpload())

app.use('/images', imageRoutes)

/* const db = admin.firestore()
const gallery = db.collection('dori-gallery')

const bucket = admin.storage().bucket() */

/* app.get('/images', async (req, res) => {
  try {
    const docs = await gallery.get()
    const imagesData = []
    docs.forEach(doc => imagesData.push(doc.data()))

    res.json(imagesData)
  } catch (error) {
    res.send(error)
  }
})

app.get('/images/:id', async (req, res) => {
  const imageId = parseInt(req.params.id);
  if (isNaN(imageId)) return res.send('try to send a number dumbass')

  const docs = await gallery.where('id', '==', imageId).get()
  const imagesData = []
  docs.forEach(doc => imagesData.push(doc.data()))

  res.json(imagesData)
})

app.post('/images/new-image', async (req, res) => {
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
              date: `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`
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
})
 */
app.listen(process.env.PORT, () => console.log('http://127.0.0.1:9000'))

/* const { initializeApp } = require('firebase/app')
const { getFirestore, collection, query, getDocs } = require('firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyA7azj21eumHpX4iSby0dEuU2BAY0ijnpk",
  authDomain: "dori-3ec27.firebaseapp.com",
  projectId: "dori-3ec27",
  storageBucket: "dori-3ec27.appspot.com",
  messagingSenderId: "1039470066966",
  appId: "1:1039470066966:web:aa96a7923934e0d2bbe437",
  measurementId: "G-QR237YLT5L"
}

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

app.get('/images', async (req, res) => {
  const gallery = collection(db, 'dori-gallery')
  const docs = await getDocs(query(gallery))

  const imagesData = []

  docs.forEach(doc => imagesData.push(doc.data()))

  res.json(imagesData)
}) */

/* 

const credentials = require('./dori-3ec27-firebase-adminsdk-2rmka-13a5a0944c.json')
const firebaseConfig = {
  apiKey: "AIzaSyA7azj21eumHpX4iSby0dEuU2BAY0ijnpk",
  authDomain: "dori-3ec27.firebaseapp.com",
  projectId: "dori-3ec27",
  storageBucket: "dori-3ec27.appspot.com",
  messagingSenderId: "1039470066966",
  appId: "1:1039470066966:web:aa96a7923934e0d2bbe437",
  measurementId: "G-QR237YLT5L"
}

const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { getStorage } = require('firebase-admin/storage')

initializeApp({
  credential: cert(credentials),
  storageBucket: 'gs://dori-3ec27.appspot.com'
})

const db = getFirestore()
const gallery = db.collection('dori-gallery')

const storage = getStorage()
const bucket = storage.bucket()

const { initializeApp } = require('firebase/app')
const { getFirestore, collection, getDocs } = require('firebase/firestore')

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

const gallery = collection(db, 'dori-gallery') 

app.get('/images', async (req, res) => {
  const docs = await gallery.get()
  const imagesData = []

  console.log(storage)

  docs.forEach(doc => imagesData.push(doc.data()))

  res.json(imagesData)
})

app.post('/images/new-image', async (req, res) => {
  const file = new Blob(req.files.image.data)
  
  bucket.upload()

  res.send('ok')
})

*/

/* 

const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()

app.use(express.json())
app.use(fileUpload())

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage')
const { ref, uploadBytes } = require('firebase/storage')
const serviceAccount = require('./dori-3ec27-firebase-adminsdk-2rmka-13a5a0944c.json')

initializeApp({
  credential: cert(serviceAccount),
})

const db = getFirestore()
const storage = getStorage()
const storageRef = ref(storage, 'some-child')
const gallery = db.collection('dori-gallery')

app.get('/', async (req, res) => {
  const docs = await gallery.get()
  docs.forEach(doc => console.log(doc.id, '->', doc.data()))
  
  res.send('hello')
})

app.get('/images', async (req, res) => {
  const docs = await gallery.get()
  const imagesData = []
  docs.forEach(doc => imagesData.push(doc.data()))

  res.json(imagesData)
})

app.get('/images/:name', async (req, res) => {
  const docs = await gallery.where('name', '==', 'valami').get()

  if (docs.empty) res.send('none')
  else {
    if (docs.length === 1) docs.forEach(doc => res.json(doc.data()))
    else {
      imagesData = []
      docs.forEach(doc => imagesData.push(doc.data()))
      res.json(imagesData)
    }
  }
})

app.post('/images/new', async (req, res) => {
  console.log(req.body)

  const imageRef = ref(storage, req.body.name)

  res.send('ok')
})

app.post('/images/new-image', async (req, res) => {
  const file = new Blob(req.files.image.data)
  
  uploadBytes(storageRef, file).then((snapshot) => {
    console.log('uploaded')
  })

  res.send('ok')
})

app.listen(9000, () => console.log('http://127.0.0.1:9000'))

*/