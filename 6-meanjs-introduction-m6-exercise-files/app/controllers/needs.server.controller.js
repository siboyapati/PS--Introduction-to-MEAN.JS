'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Need = mongoose.model('Need'),
	_ = require('lodash');

/**
 * Create a Need
 */
exports.create = function(req, res) {
	var need = new Need(req.body);
	//need.user = req.user;
	need.createdBy = req.user;

	need.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(need);
		}
	});
};

/**
 * Show the current Need
 */
exports.read = function(req, res) {
	res.jsonp(req.need);
};

/**
 * Update a Need
 */
exports.update = function(req, res) {
	var need = req.need ;

	need = _.extend(need , req.body);

	need.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(need);
		}
	});
};

/**
 * Delete an Need
 */
exports.delete = function(req, res) {
	var need = req.need ;

	need.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(need);
		}
	});
};

/**
 * List of Needs
 */
exports.list = function(req, res) { 
	Need.find().sort('-created').populate('user', 'displayName').exec(function(err, needs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(needs);
		}
	});
};

/**
 * Need middleware
 */
exports.needByID = function(req, res, next, id) { 
	Need.findById(id).populate('user', 'displayName').exec(function(err, need) {
		if (err) return next(err);
		if (! need) return next(new Error('Failed to load Need ' + id));
		req.need = need ;
		next();
	});
};

/**
 * Need authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	var hasAuth = false;
	var isAdminRole = _.contains(req.user.roles, 'admin');
	
	// Anyone has authorization to their own documents...
	if (req.need.createdBy === req.user.id) {
		hasAuth = true;
	// Admins can edit any data...
	} else if (isAdminRole) { 
		hasAuth = true;
	}
			
	if (!hasAuth) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
