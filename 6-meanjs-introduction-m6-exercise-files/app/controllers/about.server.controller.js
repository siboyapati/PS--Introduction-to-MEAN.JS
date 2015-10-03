'use strict';

/**
 * Module dependencies.
 */
exports.read = function(req, res) {
	res.render('about', {
		user: req.user || null,
		request: req
	});
};