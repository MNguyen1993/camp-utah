const express = require('express'),
	router = express.Router({ mergeParams: true }),
	Campground = require('../models/campground'),
	Comment = require('../models/comment'),
	middleWare = require('../middleware');

// Comments New
// megerParams is needed in order to find the campground id
// req.params.id needed from campground params
router.get('/new', middleWare.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
});

// Comments Create
router.post('/', middleWare.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					req.flash('error', 'Something went wrong');
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash('success', 'Comment added');
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

// Comments EDIT ROUTE
router.get('/:comment_id/edit', middleWare.isAuthorizedComment, (req, res) => {
	res.render('comments/edit', {
		campground_id: req.params.id,
		comment: req.comment
	});
});

// Comments UPDATE ROUTE
router.put('/:comment_id', middleWare.isAuthorizedComment, (req, res) => {
	Comment.findByIdAndUpdate(
		req.params.comment_id,
		req.body.comment,
		(err, updatedComment) => {
			if (err) {
				res.redirect('back');
			} else {
				res.redirect('/campgrounds/' + req.params.id);
			}
		}
	);
});

// Comment DESTROY ROUTE
router.delete('/:comment_id', middleWare.isAuthorizedComment, (req, res) => {
	Comment.findByIdAndDelete(req.params.comment_id, err => {
		if (err) {
			res.redirect('back');
		} else {
			req.flash('succes', 'Comment deleted');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

module.exports = router;
