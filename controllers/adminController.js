const { admin, adminUids, db } = require('./../db')

const users = db.collection('users')

module.exports.getAllUsers = async (req, res) => {
  try {
    const uid = req.headers?.authorization

    !adminUids.includes(uid) ? res.json('unauthorized') :

      admin.auth().listUsers()
        .then(listUsersRes => {
          let userRecords = []
          let usersData = []

          listUsersRes.users.forEach(userRecord => userRecords.push(userRecord.toJSON()))

          const prom = new Promise((resolve, reject) => {
            let done = 0;

            userRecords.forEach((user, index, array) => {
              users.where('uid', '==', user.uid).get()
                .then(docs => {
                  const docsData = []
                  docs.forEach(doc => docsData.push(doc.data()))
                  return docsData[0].role
                })
                .then(userRole => {
                  usersData.push({
                    email: user.email,
                    emailVerified: user.emailVerified,
                    displayName: user.displayName,
                    uid: user.uid,
                    role: userRole,
                    creationTime: user.metadata.creationTime,
                    lastSignInTime: user.metadata.lastSignInTime
                  })
                  done++;
                  if (done === array.length) resolve()
                })
                .catch(err => {
                  console.log(err)
                  res.status(500).json(err)
                })
            })
          })

          prom.then(() => {
            if (usersData.length) res.json(usersData)
            else res.json('no users')
          })
        })
  } catch (err) {
    res.send(err)
  }
}