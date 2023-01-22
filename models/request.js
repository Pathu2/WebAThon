const mongoose = require('mongoose')
const Schema = mongoose.Schema
const reviewSchema = new Schema({
  email: {
    type: String,
  },
})
module.exports = mongoose.model('Request', reviewSchema)
