const express = require('express');
const router = express.Router();
const House = require('../models/house');
const config = require('../config/config');

router.get('/', async (req, res) => {
    let pippedHouses = [];
    let pipeToApply = ["_id", "title", "content", "date", "tags"];

    let houses = await House.getAllHouses();
    if (!_.isEmpty(houses)) {
        _.forEach(houses, function (house) {
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
            message: responseMessages['generalError']
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