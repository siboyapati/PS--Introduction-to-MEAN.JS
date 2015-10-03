'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Need = mongoose.model('Need'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, need;

/**
 * Need routes tests
 */
describe('Need CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			roles: ['user', 'admin'],
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Need
		user.save(function() {
			need = {
                title: 'Need Title',
                description: 'Need Description'
			};

			done();
		});
	});

	it('should be able to save Need instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Need
				agent.post('/needs')
					.send(need)
					.expect(200)
					.end(function(needSaveErr, needSaveRes) {
						// Handle Need save error
						if (needSaveErr) done(needSaveErr);

						// Get a list of Needs
						agent.get('/needs')
							.end(function(needsGetErr, needsGetRes) {
								// Handle Need save error
								if (needsGetErr) done(needsGetErr);

								// Get Needs list
								var needs = needsGetRes.body;

								// Set assertions
								(needs[0].createdBy).should.equal(userId);
								(needs[0].title).should.match('Need Title');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Need instance if not logged in', function(done) {
		agent.post('/needs')
			.send(need)
			.expect(401)
			.end(function(needSaveErr, needSaveRes) {
				// Call the assertion callback
				done(needSaveErr);
			});
	});

	it('should not be able to save Need instance if no title is provided', function(done) {
		// Invalidate title field
		need.title = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Need
				agent.post('/needs')
					.send(need)
					.expect(400)
					.end(function(needSaveErr, needSaveRes) {
						// Set message assertion
						(needSaveRes.body.message).should.match('Please provide a title');
						
						// Handle Need save error
						done(needSaveErr);
					});
			});
	});

	it('should be able to update Need instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Need
				agent.post('/needs')
					.send(need)
					.expect(200)
					.end(function(needSaveErr, needSaveRes) {
						// Handle Need save error
						if (needSaveErr) done(needSaveErr);

						// Update Need title
						need.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Need
						agent.put('/needs/' + needSaveRes.body._id)
							.send(need)
							.expect(200)
							.end(function(needUpdateErr, needUpdateRes) {
								// Handle Need update error
								if (needUpdateErr) done(needUpdateErr);

								// Set assertions
								(needUpdateRes.body._id).should.equal(needSaveRes.body._id);
								(needUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Needs if not signed in', function(done) {
		// Create new Need model instance
		var needObj = new Need(need);

		// Save the Need
		needObj.save(function() {
			// Request Needs
			request(app).get('/needs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Need if not signed in', function(done) {
		// Create new Need model instance
		var needObj = new Need(need);

		// Save the Need
		needObj.save(function() {
			request(app).get('/needs/' + needObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', need.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Need instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Need
				agent.post('/needs')
					.send(need)
					.expect(200)
					.end(function(needSaveErr, needSaveRes) {
						// Handle Need save error
						if (needSaveErr) done(needSaveErr);

						// Delete existing Need
						agent.delete('/needs/' + needSaveRes.body._id)
							.send(need)
							.expect(200)
							.end(function(needDeleteErr, needDeleteRes) {
								// Handle Need error error
								if (needDeleteErr) done(needDeleteErr);

								// Set assertions
								(needDeleteRes.body._id).should.equal(needSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Need instance if not signed in', function(done) {
		// Set Need user 
		need.user = user;

		// Create new Need model instance
		var needObj = new Need(need);

		// Save the Need
		needObj.save(function() {
			// Try deleting Need
			request(app).delete('/needs/' + needObj._id)
			.expect(401)
			.end(function(needDeleteErr, needDeleteRes) {
				// Set message assertion
				(needDeleteRes.body.message).should.match('User is not logged in');

				// Handle Need error error
				done(needDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Need.remove().exec();
		done();
	});
});
