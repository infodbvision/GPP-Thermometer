var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var create = require('./routes/create');
var executed = require('./routes/executed');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use( require('request-param')() )
app.use(express.static('public'))
app.use(express.static('public/javascripts'))
app.use(express.static('public/stylesheets'))
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({secret: 'super secret',saveUninitialized: false, resave: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/create', create);
app.use('/execute', executed);
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/indexopenlayers.html')))

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.listen(3000, () => console.log('App listening on port 3000!'))

module.exports = app;
