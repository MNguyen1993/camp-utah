const Campground = require('../models/campground'),
	Comment = require('../models/comment'),
	User = require('../models/user'),
	middlewareObj = {};

// Middleware needs req, res, next
middlewareObj.isAuthorizedCampground = function (req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if (err) {
				req.flash('error', 'Campground was not found');
				res.redirect('back');
			} else {
				if (!foundCampground) {
					req.flash('error', 'Campground does not exist');
					return res.redirect('back');
				}

				if (foundCampground.author.id.equals(req.user._id)) {
					req.campground = foundCampground;
					next();
				} else {
					req.flash('error', 'You do not have permission to do that');
					res.redirect('back');
				}
			}
		});
	} else {
		// users can't even see the buttons unless their ids match
		// but if someone sends a request via 3rd party software
		// would have to manually type in ridiculous url, but just to be super secure
		req.flash('error', 'You need to be logged in to do that!');
		res.redirect('back');
	}
};

middlewareObj.isAuthorizedComment = function (req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				req.flash('error', 'Comment not found');
				res.redirect('back');
			} else {
				if (!foundComment) {
					req.flash('error', 'Comment does not exist');
					return res.redirect('back');
				}

				if (foundComment.author.id.equals(req.user._id)) {
					req.comment = foundComment;
					next();
				} else {
					req.flash('error', 'You do not have permission to do that');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to be logged in to do that');
		res.redirect('back');
	}
};

middlewareObj.isAuthorizedUser = async (req, res, next) => {
	try {
		if (req.isAuthenticated()) {
			const user = await User.findOne({ _id: req.user._id });

			if (!user) {
				throw new Error();
			}

			next();
		} else {
			throw new Error();
		}
	} catch (err) {
		req.flash('error', 'You need to be logged in to do that');
		res.redirect('back');
	}
};

middlewareObj.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You need to be logged in to do that!');
	res.redirect('/users/login');
};

module.exports = middlewareObj;
