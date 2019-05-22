const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Tag = require('./tag');

const Settings_Schema = new Schema({
    roles: [String],
    genders: [String],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'tag'
    }]
});

const Settings = module.exports = mongoose.model('setting', Settings_Schema);

async function GetSettings() {
    return Settings.findOne({})
        .populate('tags')
        .exec();
}

function CheckIndex(index) {
    if (isNaN(index)) {
        console.log('not a number');
        return false;
    };
    if (index < 0) {
        console.log('negative number');
        return false
    };
    if (!Number.isInteger(parseFloat(index))) {
        console.log('not an integer');
        return false
    };
    return true;
}

module.exports.getAllSettings = function () {
    return GetSettings()
        .then(settings => {
            return {
                roles: settings.roles || [],
                tags: settings.tags || [],
                genders: settings.genders || []
            }
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

module.exports.getRoles = function () {
    return GetSettings()
        .then(setting => {
            return setting.roles;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

module.exports.getRoleByIndex = function (index) {
    return GetSettings()
        .then(setting => {
            let indexCheck = CheckIndex(index);
            if (indexCheck == false) return null;
            if (index < setting.roles.length) {
                return setting.roles[index];
            } else {
                console.log('the provided index is incorrect');
                return null;
            }
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

module.exports.getGenders = function () {
    return GetSettings()
        .then(setting => {
            return setting.genders;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

module.exports.getGenderByIndex = function (index) {
    return GetSettings()
        .then(setting => {
            let indexCheck = CheckIndex(index);
            if (indexCheck == false) return null;
            if (index < setting.genders.length) {
                return setting.genders[index];
            } else {
                console.log('the provided index is incorrect');
                return null;
            }
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

module.exports.getTags = function () {
    return GetSettings()
        .then(setting => {
            return setting.tags;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

module.exports.getTagByIndex = function (index) {
    return GetSettings()
        .then(setting => {
            let indexCheck = CheckIndex(index);
            if (indexCheck == false) return null;
            if (index < setting.tags.length) {
                return setting.tags[index];
            } else {
                console.log('the provided index is incorrect');
                return null;
            }
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}