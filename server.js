const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

const db_link =  'mongodb://sntmigrationpreuser:sntMigrationPrePwd@aeslmnomona01:27017,aeslmnomona02:27017,aeslmnomona03:27017/sntmigration?replicaSet=aeslmnomon'

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
      mongoUser = process.env[mongoServiceName + '_USER']

  console.log('mongoServiceName : ' + mongoServiceName)
  console.log('mongoHost :        ' + mongoHost)
  console.log('mongoPort :        ' + mongoPort)
  console.log('mongoDatabase :    ' + mongoDatabase)
  console.log('mongoUser :        ' + mongoUser)
  console.log('mongoPassword :    ' + mongoPassword)

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://'
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@'
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase

    console.log('Pasa por aqui, mongoURL : ' + mongoURL)
  }
}
if (mongoURL == null) {
  console.log('Pasa por aqui y no deberia 1, mongoURL : ' + mongoURL)
  mongoURL = db_link
  console.log('Pasa por aqui y no deberia 2, mongoURL : ' + mongoURL)
}

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

var db

MongoClient.connect(mongoURL, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(port, () => {
    console.log('listening on ' + port)
  })
})

app.get('/', (req, res) => {
  db.collection('tienda').find().toArray((err, result) => {
    if (err) console.log(err)
    res.render('index.ejs', {tiendas: result})
  })
})

app.post('/tienda', (req, res) => {
  db.collection('tienda').save(req.body, (err, result) => {
    if (err) return cnsole.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})
