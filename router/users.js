const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
/////////////////////////////////////////////////////////////////////////////

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


/////////////////////////////////////////////////////////////////////////////

const catchAsync = require('../utils/catchAsync.js');
const User = require('../models/user');
const user = require('../models/user');


router.get('/user/register', (req, res) => {
    res.render('register');
})

router.get('/user/login', (req, res) => {
    res.render('login');

})


router.post('/user/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back');
    const redirectUrl = req.session.returnTo;
    res.redirect('/campground')
})

router.post('/user/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success', 'welcome to CompFinder');
            res.redirect('/campground');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/user/register');
    }
}));




module.exports = router;
