const { admin, adminUids, db } = require('./../db')

const users = db.collection('users')

module.exports.getUserRole = async (req, res) => {
  try {
    const uid = req.headers.authorization

    users.where('uid', '==', uid).get()
      .then(docs => {
        const docsData = []
        docs.forEach(doc => docsData.push(doc.data()))

        if (docsData.length === 0) return res.status(401).json('unauthorized')

        res.json(docsData[0].role)
      })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

module.exports.getUserData = async (req, res) => {
  try {
    const uid = req.headers.authorization

    admin.auth().getUser(uid)
      .then(async userRecord => {
        users.where('uid', '==', uid).get()
          .then(docs => {
            const docsData = []
            docs.forEach(doc => docsData.push(doc.data()))
            return docsData[0].role
          })
          .then(userRole => {
            const userData = {
              email: userRecord.email,
              emailVerified: userRecord.emailVerified,
              displayName: userRecord.displayName,
              uid: userRecord.uid,
              role: userRole
            }

            res.json(userData)
          })
          .catch(err => {
            console.log(err)
            res.status(500).json(err)
          })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json(err)
      })
  } catch (err) {
    res.status(500).json(err)
  }
}

module.exports.createUser = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password

    admin.auth().createUser({
      email: email,
      password: password
    })
      .then(userRecord => {
        const uid = userRecord.uid

        const newUser = {
          uid: uid,
          role: 'member'
        }

        users.doc().set(newUser)
          .then(response => {
            console.log(response)
            res.json('user created')
          })
          .catch(err => {
            console.log(err)
            res.status(500).json(err)
          })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json(err)
      })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

module.exports.updateUser = async (req, res) => {
  try {
    const uid = req.headers.authorization

    admin.auth().updateUser(uid, { displayName: req.body.displayName })
      .then(userRecord => {
        res.json(userRecord)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json(err)
      })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

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
              console.log(user)
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