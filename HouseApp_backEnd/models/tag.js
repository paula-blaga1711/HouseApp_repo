const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tag_Schema = new Schema({
    text: String
}, {
        versionKey: false
    });

const Tag = module.exports.Tags = mongoose.model('tag', Tag_Schema, 'tags');

module.exports.getAllTags = function () {
    return Tag.find({})
        .sort({ text: 1 })
        .exec()
        .catch(err => {
            console.log("There has been an error: ", err);
            return null;
        });
};

module.exports.getTagByID = function (tagID) {
    if (!mongoose.Types.ObjectId.isValid(tagID))
        return null;

    return Tag.findById(tagID)
        .exec()
        .catch(err => {
            console.log(err);
            return null;
        });
};

module.exports.createTag = function (fields) {

    const newTag = new Tag({
        text: fields.text
    });

    return newTag.save()
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