require('dotenv').config()
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

app.get('/api_key', (req, res) => {
  const API_KEY = process.env.OPENAI_API_KEY;
  res.send(API_KEY);
})


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
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGOOSE_KEY;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}


module.exports = app;
