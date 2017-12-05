const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

const port = process.env.PORT || 3000
const db_link = process.env.DBLINK || 'mongodb://sntmigrationpreuser:sntMigrationPrePwd@aeslmnomona01:27017,aeslmnomona02:27017,aeslmnomona03:27017/sntmigration?replicaSet=aeslmnomon'

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

var db

MongoClient.connect(db_link, (err, database) => {
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
