'use strict';

module.exports = function(app) {
	// Root routing
	var about = require('../../app/controllers/about.server.controller');
	app.route('/about').get(about.read);
};