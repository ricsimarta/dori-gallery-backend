const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  storageBucket: 'gs://dori-3ec27.appspot.com'
})

const db = admin.firestore()
const bucket = admin.storage().bucket()

module.exports = { db, bucket }