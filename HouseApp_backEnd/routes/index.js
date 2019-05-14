var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res)=> {
  res.status(200).json({
    message: 'Express running - HouseApp was installed'
  });
});

module.exports = router;
