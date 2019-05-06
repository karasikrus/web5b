var express = require('express');
const ObjectID = require("mongodb").ObjectID;
var router = express.Router();

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/', function (req, res) {
    req.app.locals.collection.find({}, {projection: {_id: 1, title: 1}}).toArray((mongoError, objects) => {
        if (mongoError)
            throw mongoError;
        res.send(objects);
    });
});

router.post('/', function (req, res) {
    if (!req.body.title) {
        res.status(400).send('empty title');
    } else {
        req.app.locals.collection.insertOne(
            {
                title: req.body.title,
                content: req.body.content
            }, function (error, result) {
                if (error)
                    throw error;
                else
                    res.send(result.insertedId.toString());
            }
        );
    }
});

router.put('/:id', function (req, res) {
    let id = req.params.id;
    if (!req.body.content) {
        res.status(400).send('no content');
    } else {
        req.app.locals.collection.findOneAndUpdate(
            {_id: new ObjectID(id)},
            {
                $set: {
                    content: req.body.content
                }
            }, function (error, result) {
                if (error)
                    throw error;
                else if (!result)
                    res.status(404).send('not found');
                else
                    res.send('OK');
            }
        );
    }
});

router.get('/:id', function (req, res) {
    let id = req.params.id;
    req.app.locals.collection.findOne({_id: new ObjectID(id)}, (mongoError, object) => {
        if (mongoError)
            throw mongoError;
        else if (!object)
            res.status(404).send('not found');
        else
            res.send(object);
    });
});

router.delete('/:id', function (req, res) {
    let id = req.params.id;
    req.app.locals.collection.findOneAndDelete({_id: new ObjectID(id)}, (mongoError, object) => {
        if (mongoError)
            throw mongoError;
        else if (!object)
            res.status(404).send('not found');
        else
            res.send('OK');
    });
});


module.exports = router;
