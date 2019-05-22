const express = require('express');
const router = express.Router();
const Setting = require('../models/setting');
const Tag = require('../models/tag');
const config = require('../config/config');

async function checkTagFields(fields) {
    if (_.isEmpty(fields)) return false;
    if (!(_.has(fields, 'text'))) return false;
    if (fields.text.length < 3) return false;
    return true
}

async function checkTagFieldsContent(fields) {
    if (fields.text.length < 3) return false;
    return true
}

router.get('/', async (req, res) => {

    let tags = await Tag.getAllTags();
    if (!_.isEmpty(tags))
        return res.json({
            status: 'success',
            tags: tags
        });
    else
        return res.json({
            status: 'error',
            message: responseMessages['generalError']
        });
});

router.get('/:id', async (req, res) => {

    if (!config.checkMongooseID(req.params.id))
        return res.json({
            status: 'error',
            message: responseMessages['wrongData']
        });

    let tag = await Tag.getTagByID(req.params.id);
    if (!_.isEmpty(tag))
        return res.json({
            status: 'success',
            tag: tag
        });
    else
        return res.json({
            status: 'error',
            message: responseMessages['generalError']
        });
});

router.post('/', jwtCheck, async (req, res) => {
    let loggedInUser = await getUserByAuth(req.user);

    if (loggedInUser && loggedInUser === null) {
        return res.json({
            status: 'error',
            message: responseMessages['notLoggedIn']
        });
    }

    if (loggedInUser && loggedInUser == 'notConfirmed') {
        return res.json({
            status: 'error',
            message: responseMessages['notConfirmed']
        });
    }

    if (!req.body)
        return res.json({
            status: 'error',
            message: responseMessages['notEnoughData']
        });

    let fields = req.body
    if (await checkTagFields(fields) === false)
        return res.json({
            status: 'error',
            message: responseMessages['notEnoughData']
        });

    if (await checkTagFieldsContent(fields) === false)
        return res.json({
            status: 'error',
            message: responseMessages['wrongData']
        });

    let newTag = await Tag.createTag({ text: req.body.text });

    if (newTag && newTag != null) {

        let insertToSetting = null;
        setTimeout(async function () {
            let latestTag = await Tag.Tags.findOne().sort({ _id: -1 });
            insertToSetting = await Setting.insertSettingTag(latestTag._id);
            if (!_.isEmpty(insertToSetting))
                return res.json({
                    status: "success",
                    message: responseMessages['success']
                });
        }, 500);

    } else {
        return res.json({
            status: "error",
            message: responseMessages['generalError']
        });
    }
});

module.exports = router;