var express = require('express');
var router = express.Router();

// Mongoose import
var mongoose = require('mongoose');

var uristring = 
    process.env.MONGODB_URI || 
    'mongodb://localhost/geospat';
 
// Mongoose connection to MongoDB
mongoose.connect(uristring, function (error) {
    if (error) {
        console.log(error);
    }
});

// Mongoose Schema definition
var Schema = mongoose.Schema;
var JsonSchema = new Schema({
    name: String,
    type: Schema.Types.Mixed
});
 
// Mongoose Model definition
var Json = mongoose.model('JString', JsonSchema, 'googlePoints');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET json data. */
//-118.3543, 34.1649
//closest to center of circle having max radius
router.get('/pointjson/:lat/:lon', function (req, res) {
    Json.find({"geometry": {$nearSphere: {$geometry: {type: "Point", coordinates: [req.params.lon, req.params.lat]},
 $maxDistance: 2011.75}}},{_id: 0}, function (err, docs) {
        res.json(docs);
    }).limit(1000);
});

//geoWithin a rectangular area
router.get('/pointjsonbox/:n/:s/:e/:w', function (req, res) {
    var shpPolygon = [[req.params.w,req.params.s],[req.params.e,req.params.s],[req.params.e,req.params.n], [req.params.w,req.params.n],[req.params.w,req.params.s]];

    Json.find({"geometry": {$geoWithin: {$geometry: {type: "Polygon", coordinates: [shpPolygon]}}}},{_id: 0}, function (err, docs) {
        res.json(docs);
    }).limit(5000);
});

//find by date
router.get('/pointjsondate/:begin/:end', function (req, res) {
    var startDate = new Date(req.params.begin);
    var endDate = new Date(req.params.end);
    Json.find({"properties.timestamp": {$gte: startDate, $lt: endDate}},{_id: 0}, function (err, docs) {
        res.json(docs);
    }).sort({"properties.timestamp": 1}).limit(1000);
});

//get points by bounding box and date range
router.get('/pointgetjson/:n/:s/:e/:w/:begin/:end', function (req, res) {
    var startDate = new Date(req.params.begin);
    var endDate = new Date(req.params.end);
    var shpPolygon = [[req.params.w,req.params.s],[req.params.e,req.params.s],[req.params.e,req.params.n], [req.params.w,req.params.n],[req.params.w,req.params.s]];

    Json.find({"geometry": {$geoWithin: {$geometry: {type: "Polygon", coordinates: [shpPolygon]}}}, "properties.timestamp": {$gte: startDate, $lt: endDate}},{_id: 0}, function (err, docs) {
        res.json(docs);
    }).sort({"properties.timestamp": 1}).limit(1000);
});

/* GET Map page. */
router.get('/points/:lat/:lon', function(req,res) {
    res.render('points', {lat : req.params.lat, lng : req.params.lon});
});

router.get('/pointbox/:lat/:lon', function(req,res) {
    res.render('pointbox', {lat : req.params.lat, lng : req.params.lon});
});

router.get('/pointdate/:beginDate/:endDate', function(req,res) {
    res.render('pointdate', {beginDate : req.params.beginDate, endDate : req.params.endDate}); 
});

//router.get('/gpoints/:lat/:lon/:beginDate/:endDate', function(req,res) {
//    res.render('gpoints', {lat: req.params.lat, lng: req.params.lon, beginDate: req.params.beginDate, endDate: req.params.endDate});
//});

router.get('/gpoints/:lat/:lon', function(req,res) {
    res.render('gpoints', {lat: req.params.lat, lng: req.params.lon});
});

module.exports = router;
