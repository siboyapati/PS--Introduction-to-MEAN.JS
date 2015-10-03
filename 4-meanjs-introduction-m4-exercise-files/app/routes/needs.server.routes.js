'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var needs = require('../../app/controllers/needs.server.controller');

	// Needs Routes
	app.route('/needs')
		.get(needs.list)
		.post(users.requiresLogin, needs.create);

	app.route('/needs/:needId')
		.get(needs.read)
		.put(users.requiresLogin, needs.hasAuthorization, needs.update)
		.delete(users.requiresLogin, needs.hasAuthorization, needs.delete);

	// Finish by binding the Need middleware
	app.param('needId', needs.needByID);
};
