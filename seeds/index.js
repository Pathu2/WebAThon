const mongoose = require('mongoose');
const Campground = require('../models/campground.js');
const cities = require('./cities.js');
const { descriptors, places } = require('./seedHelpers.js');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("ha ha ha worki9ng ");
    })
    .catch((err) => {
        console.log("not working yahhha");
        console.log(err);
    });

function sample(array) {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async function () {
    const c = new Campground({ title: 'purple field' });
    for (let i = 0; i < 50; ++i) {
        const random1000 = Math.floor(Math.random() * 1000);
        const prices = Math.floor(Math.random() * 2000);
        const camp = new Campground(
            {
                author: '63add8532c6bcc5060e0dfce',
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                image: "https://source.unsplash.com/collection/483251",
                description: "yaha yahhah yahahhaha",
                price: `${prices}`
            }
        )
        await camp.save()
    }

}
seedDB()
