var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var commentList = require('./public/commentList');
app.use('/', routes);
app.use('/users', users);



// connect mongodb and name the db
var mongojs = require('mongojs');
var db = mongojs('contactList', ['contactList']);

/**
 * Read everything from db
 */
app.get('/contactList', function (req, res) {
    console.log("ContactList received");
    db.contactList.find(function (err, docs) {
        //console.log(docs);
        res.json(docs);
    });
});


/**
 * Add contact into db
 */
app.post('/contactList', function (req, res) {
    console.log(req.body);
    db.contactList.insert(req.body, function (err, doc) {
        res.json(doc);
    });
});

/**
 * Delete contact in db
 */
app.delete('/contactList/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);

    db.contactList.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
        res.json(doc);
    });
});

/**
 * Edit contact
 */
app.get('/contactList/:id', function (req, res) {
    var id = req.params.id;
    console.log("contact id in router is " + id);

    db.contactList.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
        //console.log("FIND ONE: " + res.json.doc);
        res.json(doc);
    });
});

/**
 * Update contact
 */
app.put('/contactlist/:id', function (req, res) {
    var id = req.params.id;
    console.log(req.body.name);

    db.contactList.findAndModify({
            query: {_id: mongojs.ObjectId(id)},
            update: {$set: {_id: mongojs.ObjectId(id), name: req.body.name, email: req.body.email, number: req.body.number}},
            new: true}, function (err, doc) {
            res.json(doc);
        }
    );
});




// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
