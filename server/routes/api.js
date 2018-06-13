const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Item = require('../models/item')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const db = "mongodb://vgcode:pfqxbirf@ds135540.mlab.com:35540/vgcode"

mongoose.connect(db, err => {
  if (err) {
    console.error('Error!' + err)
  } else
  {
    console.log('Connected to mongodb')
  }
})

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if (token === 'null') {
    return res.status(401).send('Unauthorized request')
  }
  let payload = jwt.verify(token, 'secretKey')
  if (!payload) {
    return res.status(401).send('Unauthorized request')
  }
  req.userId = payload.subject
  next()
}

router.get('/', (req, res) => {
    res.send('From API route')
})

router.post('/register', (req, res) => {
  let userData = req.body
  let user = new User(userData)
  user.save((error, registredUser) => {
    if (error) {
      console.log(error)
    } else {
      let payload = { subject: registredUser._id }
      let token = jwt.sign(payload, 'secretKey')
      let name = user.firstName
      let balance = user.balance
      res.status(200).send({ token, name, balance })
    }
  })
})

router.post('/login', (req, res) => {
  let userData = req.body

  User.findOne({ email: userData.email }, (error, user) => {
    if (error) {
      console.log(error)
    } else
    {
      if (!user) {
        res.status(401).send('Invalid email')
      } else {
        if (user.password !== userData.password) {
          res.status(401).send('Invalid password')
        } else {
          let payload = { subject: user._id }
          let token = jwt.sign(payload, 'secretKey')
          let name = user.firstName
          let balance = user.balance
          res.status(200).send({ token, name, balance })
        }
      }
    }
  })
})

router.post('/addMoney', (req, res) => {
  let userData = req.body
  User.findOne({ password: userData.password }, (error, user) => {
    if (error) {
      console.log(error)
    } else {
      if (user.password !== userData.password) {
        res.status(401).send('Invalid password')
      } else {
        var id = user._id
        var newBalance = +user.balance + +userData.balance
        User.updateMany({ _id: id }, { $set: { balance: newBalance } }, { upsert: true }, function (err, doc) {
          if (err) { throw err; }
          else { console.log("Updated"); }
        });
      }
    }
  })
})

router.post('/add', (req, res) => {
  let newItemData = req.body
  let item = new Item(newItemData)
  item.save((error, addedItem) => {
    if (error) {
      console.log(error)
    } else {
      res.status(200).send('Item was successfully added')
      console.log('Item added')
    }
  })
})

//router.post('/buyItem', (req, res) => {
//  let itemData = req.body
//  let itemName = itemData.name
//  let itemPrice = itemData.price


//})

router.post('/update', (req, res) => {
          //var temp = JSON.parse(JSON.stringify(user))
          //var obj = Object.assign({}, temp, userData)
          //delete obj._id
          //user = new User(obj)
  let userData = req.body
  User.findOne({ password: userData.password }, (error, user) => {
    if (error) {
      console.log(error)
    } else {
        if (user.password !== userData.password) {
          res.status(401).send('Invalid password')
        } else {
          var id = user._id
          User.updateMany({ _id: id }, { $set: userData }, { upsert: true }, function (err, doc) {
            if (err) { throw err; }
            else { console.log("Updated"); }
          });
        }
    }
  })
})

router.get('/events', (req, res) => {
  let events = [
    {
      "_id": "2",
      "name": "Auto Expo",
      "description": "Lorem",
      "date": "2012-04-23"
    },
    {
      "_id": "2",
      "name": "Auto Expo",
      "description": "Lorem",
      "date": "2012-04-23"
    },
    {
      "_id": "2",
      "name": "Auto Expo",
      "description": "Lorem",
      "date": "2012-04-23"
    }
  ]
  res.json(events)
})

router.get('/special', verifyToken, (req, res) => {
  //for (i = 0; i < Item.length; i++) {
  Item.find({}).toArray(function (err, result) {
    if (err) throw err;
    console.log(result);
  });
  //res.json(items)
  //let events = [
  //  {
  //    "_id": "11",
  //    "name": "Shovel",
  //    "description": "Digs anything you want!",
  //    "price": "29.99"
  //  },
  //  {
  //    "_id": "12",
  //    "name": "Crowbar",
  //    "description": "Universal instrument",
  //    "price": "49.99"
  //  }
  //]
  //res.json(events)
})

module.exports = router