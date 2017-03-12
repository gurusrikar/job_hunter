var express = require('express');
var router = express.Router();
var www = require('../bin/www');
// var cd = require('../bin/www').clientDevices;

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log("emitting Google message");

    var newUrl = req.query.newUrl;
    var device = req.query.device;

    if (device) {
        // Msg to specific device
        console.log(www.clientDevices[device]);
        www.io.to(www.clientDevices[device]).emit('redirect', newUrl);
        res.send('respond with a resource');
    } else {
        // Msg to all devices
        www.io.emit('redirect', newUrl);
        res.send('respond with a resource');
    }
});

router.get('/live', function (req, res, next) {
    res.sendFile('live.html');
});

module.exports = router;