require('dotenv').config()

const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  storageBucket: 'gs://dori-3ec27.appspot.com'
})

const adminUids = process.env.ADMIN_ACCOUNT_GOOGLE_UID

/* admin.auth()
  .createCustomToken('lJ7ium4VVuRazuMRdb6PDaLSj6c2')
  .then(token => console.log('tok:',token))
  .catch(err => console.log(err)) */

const db = admin.firestore()
const bucket = admin.storage().bucket()

module.exports = { db, bucket, admin, adminUids }