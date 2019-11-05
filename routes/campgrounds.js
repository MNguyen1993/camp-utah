const express = require('express'),
	router = express.Router(),
	Campground = require('../models/campground'),
	middleWare = require('../middleware'); //naming file index.js will require that file automatically

// INDEX ROUTE - show all campgrounds
router.get('/', (req, res) => {
	Campground.find({}, (err, campgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', { campgrounds: campgrounds });
		}
	});
});

// CREATE ROUTE - add new campgrounds to db
router.post('/', middleWare.isLoggedIn, (req, res) => {
	const name = req.body.name;
	const image = req.body.image;
	const price = req.body.price;
	const description = req.body.description;
	const author = {
		id: req.user._id,
		username: req.user.username
	};
	const newCampground = {
		name,
		image,
		price,
		description,
		author
	};
	Campground.create(newCampground, (err, createdCampground) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
	});
});

// NEW ROUTE - shows form to create new campground
router.get('/new', middleWare.isLoggedIn, (req, res) => {
	res.render('campgrounds/new', { currentUser: req.user });
});

// SHOW ROUTE - shows more info for one campground
router.get('/:id', (req, res) => {
	Campground.findById(req.params.id)
		.populate('comments')
		.exec((err, foundCampground) => {
			if (err) {
				console.log(err);
			} else {
				res.render('campgrounds/show', { campground: foundCampground });
			}
		});
});

// EDIT ROUTE
router.get('/:id/edit', middleWare.isAuthorizedCampground, (req, res) => {
	res.render('campgrounds/edit', { campground: req.campground });
});

// UPDATE ROUTE
router.put('/:id', middleWare.isAuthorizedCampground, (req, res) => {
	Campground.findByIdAndUpdate(
		req.params.id,
		req.body.campground,
		(err, updatedCampground) => {
			if (err) {
				res.redirect('/campgrounds');
			} else {
				res.redirect('/campgrounds/' + req.params.id);
			}
		}
	);
});

// DESTROY ROUTE
router.delete('/:id', middleWare.isAuthorizedCampground, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			foundCampground.remove(err => {
				if (err) {
					req.flash('error', 'Campground could not be deleted');
					res.redirect('/campgrounds');
				} else {
					req.flash('success', foundCampground.name + ' has been deleted');
					res.redirect('/campgrounds');
				}
			});
		}
	});
});

module.exports = router;
