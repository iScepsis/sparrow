var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.render('chat/index', {
            title: 'Чат',
        });
    } else {
        res.status(403).render();
    }
});

module.exports = router;
