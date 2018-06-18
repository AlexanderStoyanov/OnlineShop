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
      }
    })
  } else {
    res.status(401).send('Unauthorized request')
  }
})

router.post('/buyItem', verifyToken, (req, res) => {
  let itemData = req.body
  let id = req.userId
  User.findOne({ _id: id }, (error, user) => {
    if (error) {
      console.log(error)
    } else {
      if ((+user.balance - +itemData.itemPrice) >= 0) {
        var newBalance = +user.balance - +itemData.itemPrice
        User.update({ _id: id }, { $push: { boughtItems: itemData }, $set: { balance: newBalance } }, function (error, item) {
          if (error) { throw error; }
          else { res.status(200).send('Item successfully bought'); };
        })
      } else {
        res.status(406).send('Not enough money');
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
            else { res.status(200).send('Payment information updated'); }
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
        if (user.cardNum == 0 || user.expDate == 0 || user.cvv == 0) {
          res.status(406).send('Invalid payment info');
        } else {
          if (+userData.balance <= 0) {
            res.status(406).send('Invalid amount');
          } else {
            let newBalance = (+user.balance + +userData.balance)
            User.update({ _id: id }, { $set: { balance: newBalance } }, { upsert: true }, function (err, doc) {
              if (err) { throw err; }
              else { res.status(200).send('Balance updated'); }
            });
          }
        }
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
  User.findById({ _id: id }, function (err, user) {
    if (err) { console.log(err) };
    res.json(user.isAdmin);
  });
})

router.get('/getName', verifyToken, (req, res) => {
  let id = req.userId
  User.findById({ _id: id }, function (err, user) {
    if (err) { console.log(err) };
    res.json(user.firstName);
  });
})

router.get('/getBalance', verifyToken, (req, res) => {
  let id = req.userId
  User.findById({ _id: id }, function (err, user) {
    if (err) { console.log(err) };
    user.balance = Math.trunc(user.balance * 100) / 100
    res.json(user.balance);
  });
})

router.get('/getBoughtItems', verifyToken, (req, res) => {
  let id = req.userId
  User.findById({ _id: id }, function (err, user) {
    if (err) { console.log(err) };
    res.json(user.boughtItems);
  });
})


module.exports = router
