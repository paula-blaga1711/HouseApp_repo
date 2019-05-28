const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Tag = require('./tag');

const House_Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image:{
        type: String,
        default: null
    },
    surface: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    county: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
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

module.exports.createHouse = function (fields) {

    const newHouse = new House({
        title: fields.title,
        content: fields.content,
        image: fields.image,
        surface: fields.surface,
        price: fields.price,
        date: Date.now(),
        county: fields.county,
        city: fields.city,
        owner: fields.owner,
        tags: fields.tags
    });

    return newHouse.save()
        .then(result => {
            return {
                result: result
            }
        })
        .catch(err => {
            console.log("There's been an error: ", err);
            return null;
        });
};

module.exports.deleteHouse = function (houseID) {
    return House.deleteOne({ _id: houseID })
        .then(result => {
            return true;
        })
        .catch(err => {
            console.log(err);
            return false;
        })
}