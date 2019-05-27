const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const House_Schema = new Schema({
    title: String,
    content: String,
    image: String,
    surface: Number,
    price: Number,
    date: Date,
    county: String,
    city: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'regular'
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'tag'
    }]
}, {
        versionKey: false
    });

const House = module.exports.Houses = mongoose.model('house', House_Schema, 'houses');

module.exports.getAllHouses = function () {
    return House.find({})
        .sort({ date: 'desc' })
        .populate('tags')
        .exec()
        .catch(err => {
            console.log("There has been an error: ", err);
            return null;
        });
};

module.exports.getHouseByID = function (houseID) {
    if (!mongoose.Types.ObjectId.isValid(houseID))
        return null;

    return House.findById(houseID)
        .populate('tags')
        .exec()
        .catch(err => {
            console.log(err);
            return null;
        });
};