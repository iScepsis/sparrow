var createError = require('http-errors');
var express = require('express');
var path = require('path');
var config = require('./config');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
var mongoose = require('./libs/mongoose');
var passport = require('./libs/passport');
var flash = require('connect-flash');
var appMiddleware = require('./libs/appMiddleware');

/** Сессии */
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose_store = new MongoStore({mongooseConnection: mongoose.connection});

var app = express();


// create application/x-www-form-urlencoded parser
//var urlencodedParser = bodyParser.urlencoded({ extended: false });

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1); // trust first proxy

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: config.get('sessions:secret'),
    key: config.get('sessions:key'),
    cookie: config.get('sessions:cookie'),
    saveUninitialized: false,
    resave: false,
    store: mongoose_store
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(appMiddleware);

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var registryRouter = require('./routes/registry');
var usersListRouter = require('./routes/users-list');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/registry', registryRouter);
app.use('/users-list', usersListRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('I here!');
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
