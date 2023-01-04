const { application } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
////////////////////////////////////////////////////////////////////
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

////////////////////////////////////////////////////////////////////////////
const Campground = require('../models/campground.js');
const catchAsync = require('../utils/catchAsync.js');
const campgrounds = require('../controllers/campground.js')

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');
const multer = require('multer')
const { storage } = require('../cloudinary/index.js');
const upload = multer({ storage });

/////////////////////////////////////////////////////////////////
router.get('/campground', async function(req, res, next) {
    const campgrounds = await Campground.find({});
    res.render('index', { campgrounds });
})

////////////////////////////////////////////////////////////////////

router.route('/campground')
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.creat))



//////////////////////////////////////////////////////////////////////

router.get('/campground/new', isLoggedIn, (req, res) => {
    res.render('new');
})

//////////////////////////////////////////////////////////////////////
router.route('/campground/:id')
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, campgrounds.a3)
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.del))
    .get(catchAsync(campgrounds.a4))

//////////////////////////////////////////////////////////////////////

router.get('/campground/:id/edit', isLoggedIn, isAuthor, campgrounds.edits)

module.exports = router;
