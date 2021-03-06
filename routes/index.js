var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
   // res.send("Visits: " + );
  res.render('index', {
    title: 'Express',
    visits: req.session.numberOfVisits
  });
});

router.get('/403', function(req, res, next) {
    res.render('403');
});

module.exports = router;
