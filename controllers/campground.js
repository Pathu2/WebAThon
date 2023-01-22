const Campground = require('../models/campground.js')
const Request = require('../models/request.js')

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const dbUrl = process.env.DB_URL

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})
///////////////////////////////////////////////////////////////////////////////////////

module.exports.index = async function (req, res, next) {
  const campgrounds = await Campground.find({})
  res.render('../views/index', { campgrounds })
}

module.exports.creat = async function (req, res) {
  const campground = new Campground(req.body)
  campground.image = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }))
  campground.author = req.user._id
  await campground.save()
  console.log(campground.image.url)
  req.flash('success', 'Sucecessfully made a new campground')
  res.redirect(`campground/${campground._id}`)
}

module.exports.del = async function (req, res) {
  const { id } = req.params
  const deletedProduct = await Campground.findByIdAndDelete(id)
  res.redirect('/campground')
}

module.exports.edits = async function (req, res) {
  const { id } = req.params
  const campground = await Campground.findById(id)
  res.render('edit', { campground })
}

module.exports.a3 = async function (req, res) {
  const { id } = req.params
  const camp = await Campground.findByIdAndUpdate(id, { ...req.body })
  camp.image = req.files.map((f) => ({ url: f.path, filename: f.filename }))
  await camp.save()
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename)
    }
    await camp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    })
  }
  req.flash('success', 'yeh updated')
  return res.redirect(`/campground/${id}`)
}

module.exports.a4 = async function (req, res) {
  const { id } = req.params
  const campgrounds = await Campground.findById(id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('author')
    .populate('requests')
  if (!campgrounds) {
    req.flash('error', 'cannot find that campground')
    return res.redirect('/campground')
  }

  console.log(campgrounds.requests[0].email)
  res.render('show', { campgrounds })
}

module.exports.a5 = async function (req, res) {
  const { id } = req.params
  const campground = await Campground.findById(id)
  const request = new Request(req.body.request)
  await request.save()
  campground.requests.push(request)
  await campground.save()
  ///////////////////////////////////////////////////////////////
}
