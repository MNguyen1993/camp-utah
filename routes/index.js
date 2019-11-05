const express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('../models/user');

router.get('/', (req, res) => {
	res.render('landing');
});

// // AUTHORIZATION ROUTES
// router.get('/signup', (req, res) => {
// 	res.render('signup');
// });

// router.post('/signup', (req, res) => {
// 	const newUser = new User({ username: req.body.username });
// 	User.register(newUser, req.body.password, (err, user) => {
// 		if (err) {
// 			req.flash('error', err.message);
// 			return res.render('signup');
// 		}
// 		passport.authenticate('local')(req, res, () => {
// 			req.flash('success', `Welcome to YelpCamp ${req.user.username}!`);
// 			res.redirect('/campgrounds');
// 		});
// 	});
// });

// router.get('/login', (req, res) => {
// 	res.render('login');
// });

// router.post(
// 	'/login',
// 	passport.authenticate('local', {
// 		successRedirect: '/campgrounds',
// 		failureRedirect: '/login',
// 		failureFlash: true
// 	})
// );

// router.get('/logout', (req, res) => {
// 	req.logout();
// 	req.flash('success', 'You were logged out');
// 	res.redirect('/campgrounds');
// });

module.exports = router;
