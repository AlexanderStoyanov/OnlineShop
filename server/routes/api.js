const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Item = require('../models/item')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
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
  let payload = jwt.verify(token, 'raccoon')
  if (!payload) {
    return res.status(401).send('Unauthorized request')
  }
  req.userId = payload.subject
  req.isAdmin = payload.isAdmin
  next()
}

router.get('/', (req, res) => {
    res.send('From API route')
})

router.post('/register', (req, res) => {
  let userData = req.body
  console.log(req.body)
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  let user = new User(
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      isAdmin: req.body.isAdmin,
      balance: 0,
      cardNum: 0,
      expDate: 0,
      cvv: 0
    }
  )
  user.save((error, registredUser) => {
    if (error) {
      console.log(error)
    } else {
      let payload = { subject: registredUser._id, isAdmin: registredUser.isAdmin }
      let token = jwt.sign(payload, 'raccoon', { expiresIn: 86400 })
      res.status(200).send({ token })
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
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
          return res.status(401).send({ auth: false, token: null });
        } else {
          let payload = { subject: user._id, isAdmin: user.isAdmin }
          let token = jwt.sign(payload, 'raccoon', { expiresIn: 86400 })
          res.status(200).send({ auth: true, token: token })
        }
      }
    }
  })
})

router.post('/add', verifyToken, (req, res) => {
  if (req.isAdmin) {
    let newItemData = req.body
    let item = new Item(newItemData)
    item.save((error, addedItem) => {
      if (error) {
        console.log(error)
      } else {
        res.status(200).send('Item was successfully added')
        console.log('New item added')
      }
    })
  } else {
    res.status(401).send('You are not admin')
    console.log('You are not admin to do that!')
  }
})

router.post('/buyItem', verifyToken, (req, res) => {
  let itemData = req.body
  let id = req.userId
  console.log(req)
  User.findOne({ _id: id }, (error, user) => {
    if (error) {
      console.log(error)
    } else {
      if ((+user.balance - +itemData.itemPrice) >= 0) {
        var newBalance = +user.balance - +itemData.itemPrice
        User.update({ _id: id }, { $push: { boughtItems: itemData }, $set: { balance: newBalance } }, function (error, item) {
          if (error) { throw error; }
          else { console.log('Item bought') };
        })
      } else {
        console.log('Not enough money!')
      }
    }
  })
})

router.post('/update', verifyToken, (req, res) => {
  let userData = req.body
  let id = req.userId
  User.findOne({ _id: id }, (error, user) => {
    if (error) {
      console.log(error)
    } else {
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({ auth: false, token: null });
      } else {
        delete req.body.password
          User.update({ _id: id }, { $set: userData }, { upsert: true }, function (err, doc) {
            if (err) { throw err; }
            else { console.log("Personal info updated"); }
          });
        }
    }
  })
})

router.post('/addMoney', verifyToken, (req, res) => {
  let userData = req.body
  let id = req.userId
  User.findOne({ _id: id }, (error, user) => {
    if (error) {
      console.log(error)
    } else {
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({ auth: false, token: null });
      } else {
        let newBalance = (+user.balance + +userData.balance)
        User.update({ _id: id }, { $set: { balance: newBalance } }, { upsert: true }, function (err, doc) {
          if (err) { throw err; }
          else { console.log("Balance updated"); }
        });
      }
    }
  })
})

router.get('/shop', (req, res) => {
  const query = Item.find();
  query.collection(Item.collection);
  query.exec(
    function (err, item) {
      if (err) return handleError(err);
      res.json(item);
    });
})

router.get('/getAdmin', verifyToken, (req, res) => {
  let id = req.userId
  User.findById({ _id: id }, { password: 0, firstName: 0 }, function (err, user) {
    if (err) return handleError(err);
    res.json(user.isAdmin);
  });
})

router.get('/history', verifyToken, (req, res) => {
  let id = req.userId
  const query = User.find({ _id: id });
  query.exec(
    function (err, item) {
      if (err) return handleError(err);
      (item[0].balance) = (Math.trunc(item[0].balance * 100) / 100)
      //delete item[0].password
      res.json(item);
    });
})


module.exports = router
