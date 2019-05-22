const express = require('express');
const router = express.Router();
const Tag = require('../models/tag');
const config = require('../config/config');

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



module.exports = router;