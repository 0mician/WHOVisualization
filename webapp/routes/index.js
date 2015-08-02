var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/who3d', function(req, res, next) {
    res.render('who3d', {});
});

router.get('/who', function(req, res) {
    var db = req.db;
    db.who.find({}, {}, function(e, docs){
        res.json(docs);
    });
});

router.get('/whoviz', function(req, res, next) {
    res.render('whoviz', {});
});

router.get('/who/columns', function(req, res) {
    var db = req.db;
    db.names.find({}, {}, function(e, docs){
        res.json(docs);
    });
});


// not working yet
router.get('/who/:vars', function(req, res) {
    var db = req.db;
    var param = req.params.vars;
    db.who.group(
        {key: {Continent : 1}, 
         reduce: function(curr, result) { 
             result.countries.push( 
                 {"name" : curr['Country'], 
                  "value" : curr['CountryID'] });}, 
         initial: { countries : [] }
        }, function(e, docs){
            res.json(docs);
        }
    );
});

module.exports = router;

//     var mapper = function() {
//         for (var key in this) { 
//             emit(key, null);
//         }
//     };
//     var reducer = function(key, stuff) {
//         return null;
//     };
//     db.who.mapReduce(mapper, reducer, {out : "names"});
