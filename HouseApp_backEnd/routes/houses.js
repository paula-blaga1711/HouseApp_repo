const express = require('express');
const router = express.Router();
const House = require('../models/house');
const config = require('../config/config');

function checkNumber(number) {
    if (isNaN(number)) return false;
    if (!Number.isInteger(parseFloat(number))) return false;
    if (number < 0) return false;
    return true;
}

router.get('/', async (req, res) => {
    let pippedHouses = [];
    let pipeToApply = ["_id", "title", "content", "date", "tags"];
    let filteredHousesByCounty = [];
    let filteredHousesByTags = [];
    let filteredHousesByPrice = [];
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

    if (_.size(req.query) == 1) {
        if (req.query.tagIDs) resultHouses = filteredHousesByTags;
        if (req.query.prices) resultHouses = filteredHousesByPrice;
        if (req.query.county) resultHouses = filteredHousesByCounty;
    }

    if (_.size(req.query) > 1) {
        resultsToIntersect = [];
        if (req.query.tagIDs) resultsToIntersect.push(filteredHousesByTags);
        if (req.query.prices) resultsToIntersect.push(filteredHousesByPrice);
        if (req.query.county) resultsToIntersect.push(filteredHousesByCounty);

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

module.exports = router;