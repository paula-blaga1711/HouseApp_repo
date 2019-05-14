const express = require('express');
const router = express.Router();
const Settings = require('../models/setting');

global.roleByIndex = async function (index) {
    let role = await Settings.getRoleByIndex(index);
    if (role && role != null) {
        return role;
    } else return null;
};

global.genderByIndex = async function (index) {
    let gender = await Settings.getGenderByIndex(index);
    if (gender && gender != null) {
        return gender;
    } else return null;
};

global.tagByIndex = async function (index) {
    let tag = await Settings.getTagByIndex(index);
    if (tag && tag != null) {
        return tag;
    } else return null;
}

router.get('/', async function (req, res) {
    let settings = await Settings.getAllSettings();

    if (settings && settings != null) {
        return res.json({
            status: "success",
            ...settings
        });
    } else
        return res.json({
            status: 'error',
            message: responseMessages['generalError']
        });

});

router.get('/roles', async function (req, res) {
    let roles = await Settings.getRoles();
    if (roles && roles != null) {
        return res.json({
            status: 'success',
            roles: roles
        })
    } else
        return res.json({
            status: 'error',
            message: responseMessages['generalError']
        });
});

router.get('/roles/:index', async function (req, res) {
    let role = await roleByIndex(req.params.index);
    if (role && role != null) {
        return res.json({
            status: 'success',
            role: role
        })
    } else
        return res.json({
            status: 'error',
            message: responseMessages['generalError']
        });
});

router.get('/genders', async function (req, res) {
    let genders = await Settings.getGenders();
    if (genders && genders != null) {
        return res.json({
            status: 'success',
            genders: genders
        })
    } else
        return res.json({
            status: 'error',
            message: responseMessages['generalError']
        });
});

router.get('/genders/:index', async function (req, res) {
    let gender = await genderByIndex(req.params.index);
    if (gender && gender != null) {
        return res.json({
            status: 'success',
            gender: gender
        })
    } else
        return res.json({
            status: 'error',
            message: responseMessages['generalError']
        });
});

router.get('/tags', async function (req, res) {
    let tags = await Settings.getTags();
    if (tags && tags != null) {
        return res.json({
            status: 'success',
            tags: tags
        })
    } else
        return res.json({
            status: 'error',
            message: responseMessages['generalError']
        });
});

router.get('/tags/:index', async function (req, res) {
    let tag = await tagByIndex(req.params.index);
    if (tag && tag != null) {
        return res.json({
            status: 'success',
            tag: tag
        })
    } else
        return res.json({
            status: 'error',
            message: responseMessages['generalError']
        });
});

module.exports = router;