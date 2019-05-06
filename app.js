var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var MongoClient = require('mongodb').MongoClient;

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, function(err, db) {
    if (err) {
        throw err;
    }
    app.locals.collection = db.db().collection("documents");
});

module.exports = app;
