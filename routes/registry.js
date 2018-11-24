var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('registry/index', {
        title: 'Registration',
    });
});

router.post('/', function (req, res) {
    res.send('welcome, ' + req.body.username);
    console.log(req.body.username);
});

module.exports = router;