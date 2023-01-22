const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ApproveSchema = new Schema({
  email: {
    type: String,
  },
})
module.exports = mongoose.model('Approve', ApproveSchema)
