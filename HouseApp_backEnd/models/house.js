const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Tag = require('./tag');

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

module.exports.getAllHousesByTags = function (tags) {
    let housesByTags = [];

    return new Promise(resolve => {
        async function processTags() {
            for (const tag of tags) {
                let housesByTag = await House.find({ tags: tag })
                    .sort({ date: 'desc' })
                    .exec()
                    .catch(err => {
                        console.log("There's been an error: ", err);
                        resolve(null);
                        return null;
                    });

                if (housesByTag && !_.isEmpty(housesByTag)) {
                    _.forIn(housesByTag, function (value, key) {
                        housesByTags.push(value);
                    });
                }
            }
            let noDuplicates = _.uniqBy(housesByTags, 'id');
            resolve(noDuplicates);
            return noDuplicates;
        }
        processTags();
    });
};

module.exports.getHousesByPriceRange = function (prices) {
    let low = Math.min(...prices);
    let high = Math.max(...prices);

    return House.find({
        price: {
            $gte: low,
            $lte: high
        }
    })
        .populate('tags')
        .exec()
        .catch(err => {
            console.log(err);
            return null;
        });
};

module.exports.getHousesByCounty = function (county) {
    return House.find({
        county: county
    })
        .populate('tags')
        .exec()
        .catch(err => {
            console.log(err);
            return null;
        });
};

module.exports.getHousesByText = function (text) {
    var findText = new RegExp(text, 'i');
    return House.find({
        $or: [
            { title: { $regex: findText } },
            { content: { $regex: findText } }
        ]
    })
        .exec()
        .catch(err => {
            console.log("There's been an error: ", err);
            return null;
        });
}