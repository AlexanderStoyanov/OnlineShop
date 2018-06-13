const mongoose = require('mongoose')

const Schema = mongoose.Schema
const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  isAdmin: Boolean,

  cardNum: String,
  expDate: String,
  cvv: String,
  balance: Number
})

module.exports = mongoose.model('user', userSchema, 'users')
