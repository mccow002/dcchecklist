var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Comic = require('../models/comic');

var url = 'mongodb://localhost:27017/comics';
mongoose.connect(url);

router.get('/getall/:index', function(req, res, next){
    Comic.find({FirstChar: req.params.index}, function(err, comics){
        if(err){
            throw err;
        }

        res.json({comics: comics});
    });
});

router.get('/search/:search', function(req, res){
    Comic.find({$text: {$search: req.params.search}})
        .exec(function(err, results){
            res.json({comics: results}); 
        })
});

router.put('/', function(req, res){
    console.log(req.body);

    var comic = req.body;
    Comic.findByIdAndUpdate(comic._id, comic, function(err, update){
        if(err) throw err;

        res.json(update);
    });
});

router.delete('/:id', function(req, res){
    console.log(req.params.id);

    Comic.findByIdAndRemove(req.params.id, function(err){
        if(err) throw err;
        res.json(200);
    })
})

module.exports = router;