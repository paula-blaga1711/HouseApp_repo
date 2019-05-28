const express = require('express');
const router = express.Router();
const House = require('../models/house');
const config = require('../config/config');
const Settings = require('../models/setting');
const Tag = require('../models/tag');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './resources/house_img/');
    },
    filename: function (req, file, callback) {
        let type = file.mimetype.split('/')[1];
        callback(null, Date.now() + '.' + type);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype == 'image/png') {
        callback(null, true); // accepts and stores the file
    } else {
        callback(new Error('formatul fisierului nu este acceptabil'), false); //rejecting the file !! the user is still created, just the img is not stored!!
        console.log('unacceptable file type: ', file.mimetype);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 //only accepting images up to 5MB
    },
    fileFilter: fileFilter
});

function checkNumber(number) {
    if (isNaN(number)) return false;
    if (!Number.isInteger(parseFloat(number))) return false;
    if (number < 0) return false;
    return true;
}

function checkHouseFields(fields) {
    if (_.isEmpty(fields)) return false;
    if (!(_.has(fields, 'title'))) return false;
    if (!(_.has(fields, 'content'))) return false;
    if (!(_.has(fields, 'surface'))) return false;
    if (!(_.has(fields, 'price'))) return false;
    if (!(_.has(fields, 'county'))) return false;
    if (!(_.has(fields, 'city'))) return false;
    return true
}

async function checkTags(tags) {
    if (!_.isArray(tags)) return false;
    let DBtags = await Settings.getTags();
    if (_.isEmpty(_.intersectionWith(DBtags, tags, function (arrVal, othVal) {
        return arrVal._id.equals(othVal)
    }))) return false;

    return true;
}

async function checkHouseFieldsContent(fields) {
    let flagAllOK = true;
    _.forIn(fields, function (field, key) {
        if (_.isEmpty(field)) flagAllOK = false;
    });
    if (flagAllOK === false) return false;
    if (fields.title.length < 4) return false;
    if (fields.content.length < 4) return false;
    if (checkNumber(fields.surface) === false) return false;
    if (checkNumber(fields.price) === false) return false;
    if (config.checkCounty(fields.county) === false) return false;
    if (config.checkCity(fields.county, fields.city) === false) return false;
    if (_.has(fields, 'oldTags') && await checkTags(fields.oldTags) == false) return false;
    if (_.has(fields, 'newTags') && !_.isArray(fields.newTags)) return false;
    return true
}

router.get('/', async (req, res) => {
    let pippedHouses = [];
    let pipeToApply = ["_id", "title", "content", "date", "tags"];
    let filteredHousesByCounty = [];
    let filteredHousesByTags = [];
    let filteredHousesByPrice = [];
    let filteredHousesByText = [];
    let resultHouses = [];

    if (_.size(req.query) == 0) {
        resultHouses = await House.getAllHouses();
    }

    if (req.query.tagIDs) {
        if (!_.isArray(req.query.tagIDs))
            return res.json({
                status: 'error',
                message: responseMessages['wrongData']
            });

        let flagAllIDsOK = true;
        _.forEach(req.query.tagIDs, function (tagID) {
            if (!config.checkMongooseID(tagID)) {
                flagAllIDsOK = false;
                return false;
            }
        })

        if (flagAllIDsOK === false)
            return res.json({
                status: 'error',
                message: responseMessages['wrongData']
            });

        filteredHousesByTags = await House.getAllHousesByTags(req.query.tagIDs);
    }

    if (req.query.prices) {
        if (!_.isArray(req.query.prices))
            return res.json({
                status: 'error',
                message: responseMessages['wrongData']
            });

        if (req.query.prices.length < 2)
            return res.json({
                status: 'error',
                message: responseMessages['notEnoughData']
            });

        let flagAllPricesOK = true;
        _.forEach(req.query.prices, function (price) {
            if (checkNumber(price) === false) {
                flagAllPricesOK = false;
                return false;
            }
        })

        if (flagAllPricesOK === false)
            return res.json({
                status: 'error',
                message: responseMessages['wrongData']
            });

        filteredHousesByPrice = await House.getHousesByPriceRange(req.query.prices);
    }

    if (req.query.county) {
        if (config.checkCounty(req.query.county) === true) {
            filteredHousesByCounty = await House.getHousesByCounty(req.query.county);
        } else
            return res.json({
                status: 'error',
                message: responseMessages['wrongData']
            });
    }

    if (req.query.text) {
        filteredHousesByText = await House.getHousesByText(req.query.text);
    }

    if (_.size(req.query) == 1) {
        if (req.query.tagIDs) resultHouses = filteredHousesByTags;
        if (req.query.prices) resultHouses = filteredHousesByPrice;
        if (req.query.county) resultHouses = filteredHousesByCounty;
        if (req.query.text) resultHouses = filteredHousesByText;
    }

    if (_.size(req.query) > 1) {
        resultsToIntersect = [];
        if (req.query.tagIDs) resultsToIntersect.push(filteredHousesByTags);
        if (req.query.prices) resultsToIntersect.push(filteredHousesByPrice);
        if (req.query.county) resultsToIntersect.push(filteredHousesByCounty);
        if (req.query.text) resultsToIntersect.push(filteredHousesByText);

        resultHouses = resultsToIntersect[0];
        _.forEach(resultsToIntersect, function (filteredHouseList) {
            resultHouses = _.intersectionWith(resultHouses, filteredHouseList, function (arrVal, othVal) {
                return arrVal._id.equals(othVal._id)
            })
        });
    }

    if (!_.isEmpty(resultHouses)) {
        _.forEach(resultHouses, function (house) {
            if (!_.isEmpty(house.image)) {
                house['image'] = houseImgUrl + house['image'];
                pipeToApply.push('image');
            }
            let pippedHouse = pipe(house, pipeToApply);
            pippedHouses.push(pippedHouse);
        })

        return res.json({
            status: 'success',
            houses: pippedHouses
        });
    }
    else
        return res.json({
            status: 'error',
            message: responseMessages['noSuchHouse']
        });
});

router.get('/:id', async (req, res) => {

    if (!config.checkMongooseID(req.params.id))
        return res.json({
            status: 'error',
            message: responseMessages['wrongData']
        });

    let house = await House.getHouseByID(req.params.id);
    if (!_.isEmpty(house))
        return res.json({
            status: 'success',
            house: house
        });
    else
        return res.json({
            status: 'error',
            message: responseMessages['generalError']
        });
});

router.post('/', jwtCheck, async (req, res) => {
    upload.single('houseimg')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log('multer error', err.message);
            return res.json({
                status: "error",
                message: responseMessages['wrongFile']
            });

        } else if (err) {
            return res.json({
                status: "error",
                message: err.message
            });
        }

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

        let fields = req.body;
        if (req.file) {
            fields = Object.assign(fields, {
                image: req.file.filename
            });
        }

        let houseFieldsCheck = await checkHouseFields(fields);
        let houseFieldContentCheck = await checkHouseFieldsContent(fields);

        if (houseFieldsCheck === false)
            return res.json({
                status: 'error',
                message: responseMessages['notEnoughData']
            });

        if (houseFieldContentCheck === false)
            return res.json({
                status: 'error',
                message: responseMessages['wrongData']
            });

        let tags = [];
        if (_.has(fields, 'oldTags')) tags = fields.oldTags;

        counter = 0;
        if (_.has(fields, 'newTags')) {
            _.forEach(fields.newTags, async function (newTagText) {
                let newTag = await Tag.createTag({ text: newTagText });
                if (newTag && newTag != null) {
                    let newTagDocument = await Tag.getTagByText(newTagText);
                    if (newTagDocument && newTagDocument != null) {
                        let insertToSetting = await Settings.insertSettingTag(newTagDocument._id);
                        if (insertToSetting && insertToSetting != null) {
                            tags.push(newTagDocument._id);
                            counter++;
                            if (counter == fields.newTags.length) {
                                fields = Object.assign(fields, { tags: tags });

                                let newHouse = await House.createHouse(fields);
                                if (!_.isEmpty(newHouse))
                                    return res.json({
                                        status: "success",
                                        message: responseMessages['success']
                                    });
                                else
                                    return res.json({
                                        status: "error",
                                        message: responseMessages['generalError']
                                    });
                            }
                        }
                    }
                }
            })
        }
       
        if (!_.has(fields, 'newTags')) {

            fields = Object.assign(fields, { tags: tags });

            let newHouse = await House.createHouse(fields);
            if (!_.isEmpty(newHouse))
                return res.json({
                    status: "success",
                    message: responseMessages['success']
                });
            else
                return res.json({
                    status: "error",
                    message: responseMessages['generalError']
                });
        }
    })
});

router.delete('/:id', jwtCheck, async (req, res) => {
    let loggedInUser = await getUserByAuth(req.user);
    let roles = await Settings.getRoles();

    if (!config.checkMongooseID(req.params.id))
        return res.json({
            status: 'error',
            message: responseMessages['wrongData']
        });

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

    if (roles && loggedInUser && loggedInUser.role !== roles[0] && !_.includes(loggedInUser.houses, req.params.id))
        return res.json({
            status: 'error',
            message: responseMessages['unauthorizedAccess']
        });

    let responseDelete = await House.deleteHouse(req.params.id);
    if (responseDelete === true)
        return res.json({
            status: "success",
            message: responseMessages['success']
        });
    else
        return res.json({
            status: "error",
            message: responseMessages['generalError']
        });

})

module.exports = router;