var express = require('express');
var app = express();
var path = require('path');
//var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// Required for Brandon to work on windows
if (process.platform == "win32") {
	var dotenv = require('dotenv').config({path: path.join(__dirname, '.env')});
}

// Mongo Setup

var mongoDB = process.env.MONGODB;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(__dirname + '/writable'));
app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// var upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'artifactarmory',
//         key: function (req, file, cb) {
//             console.log(file);
//             cb(null, file.Date.now()); //use Date.now() for unique file keys
//         }
//     })
// });

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes/routes')(app, passport);

var articles = require('./routes/articles');
app.use('/articles', articles);

//routes

require('./models/user');
require('./models/profile');
require('./models/article');


// views is directory for all template files

//error handler

app.use(function(err, req, res, next) {
	// set locals on for error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the status page
	res.status(err.status || 500);
	res.render(err.message);
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;


// fs.readdirSync('./controllers').forEach(function (file) {
// 	if(file.substr(-3) == '.js') {
// 		route = require('./controllers/' + file);
// 		route.controller(app);
// 	}
// })
// app.post('/sign-up', (req, res) => {
// 	db.collection('users').save(req.body, (err, result) => {
// 		if (err) return console.log(err)

// 		console.log(req.body.username + ' was added as a user')
// 		res.redirect('/')
// 	})
// });

