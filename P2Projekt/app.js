var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fetch = require('node-fetch');
const { stringify } = require('querystring')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/FAQ');
var captchaRouter = require('./routes/captcha');

var app = express();

app.use(express.json());

app.post('/gethomepage', async (req, res) => {
  if (!req.body.captcha)
    return res.json({ success: false, msg: 'Please select captcha' });

  // Secret key
  const secretKey = '6LdpvDEUAAAAAHszsgB_nnal29BIKDsxwAqEbZzU';

  // Verify URL
  const query = stringify({
    secret: secretKey,
    response: req.body.captcha,
    remoteip: req.connection.remoteAddress
  });
  const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

  // Make a request to verifyURL
  const body = await fetch(verifyURL).then(res => res.json());

  // If not successful
  if (body.success !== undefined && !body.success)
    return res.json({ success: false, msg: 'Failed captcha verification' });

  // If successful
  return res.json({ success: true, msg: '' });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', captchaRouter);
app.use('/Home', indexRouter);
app.use('/FAQ', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Set up mongoose connection
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb+srv://thomaslunoe:Nuggi2001@cluster0.xsccqqr.mongodb.net/?retryWrites=true", { useNewUrlParser: true }, { useUnifiedTopology: true })

//schema
var reviewSchema = new mongoose.Schema({
  title: String,
  content: String
});

var review = mongoose.model("review", reviewSchema);

app.post("", function (req, res) {
  let newReview = new review({
    title: req.body.title,
    content: req.body.content
  })
  newReview.save();
});


module.exports = app;
