if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const mongoSanitize = require('express-mongo-sanitize')
///////////////////////
const userRoutes = require('./router/users.js');
const campgroundRoutes = require('./router/campgrounds.js');
const reviewRoutes = require('./router/reviews.js');
const mongoose = require('mongoose');
//mongodb://127.0.0.1:27017/yelp-camp
const dbUrl = process.env.DB_URL;

const PORT = process.env.PORT || 3000

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
const Joi = require('joi');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize())
///////////////////////////////////////////////////////////////////////////////////

const MongoDBStore = require("connect-mongo");


const sessionConfig = {
    name: 'cook',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

/////////////////////////////////////////////////////////////////////////

app.get('/campground', (req, res) => {
    res.send("hello")
})

///////////////////////////////////////////////////////////////////////////////////


app.use(userRoutes);
app.use(campgroundRoutes);
app.use(reviewRoutes);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/user/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err);
        req.flash('success', 'successfully logged out');
        res.redirect("/campground");
    });
});


app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'colt@gmail.com', username: 'Colt' });
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);

})


app.all('*', (req, res, next) => {
    next(new Error("Page not found", 404));
})


app.use((err, req, res, next) => {
    const { statusCode = 500, message = "something went xrong" } = err;
    res.status(statusCode).render('error', { err });
})


app.listen(PORT, function (req, res) {
    console.log("server is running on your HP PAB");
})
