const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Settings = require('./setting');

const Admin_Schema = new Schema({
    name: String,
    auth0_id: String,
    role: String,
    email: String
}, {
        versionKey: false
    });

const admin = module.exports.Admin = mongoose.model('admin', Admin_Schema, 'users')

const Regular_Schema = new Schema({
    name: String,
    auth0_id: String,
    role: String,
    email: String,
    gender: String,
    houses: [{
        type: Schema.Types.ObjectId,
        ref: 'house'
    }]
}, {
        versionKey: false
    });

const regular = module.exports.Regular = mongoose.model('regular', Regular_Schema, 'users')

async function selectModel(role) {
    let roles = await Settings.getRoles();
    let model = null;
    if (roles != null) {
        if (role === roles[0]) model = admin
        else model = regular
    }
    return model;
}

module.exports.getAllUsers = function () {
    return admin.find({}).exec()
        .catch(err => {
            console.log("There has been an error: ", err);
            return null;
        });
};

module.exports.getUserByAut0ID = function (auth0_ID) {
    return admin.find({
        auth0_id: auth0_ID
    })
        .exec()
        .then(user => {
            return user[0];
        })
        .catch(err => {
            console.log(err);
            return null;
        })
}

module.exports.getUsersByRole = async function (role) {
    let model = await selectModel(role);
    return model.find({
        role: role
    })
        .exec()
        .catch(err => {
            console.log(err);
            return null;
        });
}

module.exports.getUserByRoleAndID = async function (role, userID) {
    let model = await selectModel(role);
    return model.findById(userID)
        .exec()
        .catch(err => {
            console.log(err);
            return null;
        });
}

module.exports.getUserByEmail = function (email) {
    return admin.find({ email: email })
        .exec()
        .then(users => { return users[0] || [] })
        .catch(err => {
            console.log(err);
            return null;
        });
}

module.exports.updateUserById = async function (userID, role, fields) {
    let model = await selectModel(role);
    return model.findOneAndUpdate({ _id: userID }, { $set: fields })
        .catch(err => {
            console.log("There's been an error: ", err);
            return null;
        });
}

module.exports.createRegular = function (fields) {
    const newUser = new regular({
        name: fields.name,
        auth0_id: fields.auth0_id,
        role: 'regular',
        email: fields.email,
        gender: fields.gender
    });
    return newUser.save()
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