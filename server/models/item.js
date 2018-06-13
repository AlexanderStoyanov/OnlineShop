const mongoose = require('mongoose')

const Schema = mongoose.Schema
const itemSchema = new Schema({
  itemName: String,
  itemDescription: String,
  itemPrice: Number
})

module.exports = mongoose.model('item', itemSchema, 'items')
