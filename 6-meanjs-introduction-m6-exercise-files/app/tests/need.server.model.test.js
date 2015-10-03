'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Need = mongoose.model('Need');

/**
 * Globals
 */
var user, need;

/**
 * Unit tests
 */
describe('Need Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			need = new Need({
				title: 'Need Title',
				description: 'Need Description',
				createdBy: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return need.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without title and description', function(done) { 
			need.title = '';
			need.description = '';
			
			return need.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Need.remove().exec();
		User.remove().exec();

		done();
	});
});