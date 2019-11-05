const express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('../models/user'),
	middleware = require('../middleware'),
	{ sendWelcomeEmail, sendGoodbyeEmail } = require('../utils/account');

// USERS NEW FORM ROUTE
router.get('/users/signup', (req, res) => {
	res.render('signup');
});

// USERS CREATE ROUTE
router.post('/users/signup', (req, res) => {
	const newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username
	});
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			req.flash('error', err.message);
			return res.redirect('/users/signup');
		}
		passport.authenticate('local')(req, res, () => {
			sendWelcomeEmail(newUser.email, newUser.name);
			req.flash('success', `Welcome to YelpCamp ${req.user.username}!`);
			res.redirect('/campgrounds');
		});
	});
});

// USERS LOGIN FORM ROUTE
router.get('/users/login', (req, res) => {
	res.render('login');
});

// USERS LOGIN ROUTE
router.post(
	'/users/login',
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		failureRedirect: '/users/login',
		failureFlash: true
	})
);

// USERS LOGOUT ROUTE
router.get('/users/logout', (req, res) => {
	req.logout();
	req.flash('success', 'You were logged out');
	res.redirect('/campgrounds');
});

// USERS PROFILE ROUTE
router.get('/users/me', middleware.isAuthorizedUser, (req, res) => {
	res.render('users/profile', { user: req.user });
});

// USERS UPDATE ROUTE
router.patch('/users/me', middleware.isAuthorizedUser, async (req, res) => {
	console.log(req.body.user);
	const user = await User.findByIdAndUpdate(req.user._id, req.body.user)
	if (!user) {
		req.flash('error', 'Cannot update user profile')
		return res.redirect('back')
	}

	req.flash('success', 'User profile was updated')
	res.redirect('/campgrounds')
});

// USERS DESTROY ROUTE
router.delete('/users/me', middleware.isAuthorizedUser, async (req, res) => {
	try {
		await req.user.deleteOne();
		sendGoodbyeEmail(req.user.email, req.user.name);
		req.flash('success', "You're account has been deleted");
		res.redirect('/campgrounds');
	} catch (err) {
		req.flash('error', 'Unable to delete account, please try again');
		res.redirect('back');
	}
});

module.exports = router;
