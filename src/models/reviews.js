const mongoose = require('mongoose');


const reviewsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true},
    message: { type: String, required: true },
    imageUrl: { type: String }, // Field to store the image URL

});



const Reviews = mongoose.model('Reviews', reviewsSchema);

module.exports = Reviews;
