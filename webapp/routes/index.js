var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/who', function(req, res) {
    var db = req.db;
    var collection = db.get('who');
    collection.find({},{},function(e,docs){
      res.json(docs);
    });
});

module.exports = router;
