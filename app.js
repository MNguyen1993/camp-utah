const passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	seedDB = require('./seeds'),
	User = require('./models/user'),
	flash = require('connect-flash'),
	app = express(),
	port = process.env.PORT;

// Requiring Routes
const commentRoutes = require('./routes/comments'),
	campgroundRoutes = require('./routes/campgrounds'),
	userRoutes = require('./routes/users'),
	indexRoutes = require('./routes/index');

mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true,
	useFindAndModify: false
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());

app.set('view engine', 'ejs');

// PASSPORT CONFIGURATION
app.use(
	require('express-session')({
		secret: process.env.PASSPORT_SECRET,
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Provides currentUser to all templates
// Needed to be declared under passport Config
// since that is where req.user is created
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

// ROUTES CONFIGURATION
app.use(indexRoutes);
app.use(userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(port, () => {
	console.log(`CampUtah server is online on ${port}!`);
});
