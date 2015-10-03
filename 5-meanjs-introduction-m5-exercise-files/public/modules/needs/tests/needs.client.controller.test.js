'use strict';

(function() {
	// Needs Controller Spec
	describe('Needs Controller Tests', function() {
		// Initialize global variables
		var NeedsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Needs controller.
			NeedsController = $controller('NeedsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Need object fetched from XHR', inject(function(Needs) {
			// Create sample Need using the Needs service
			var sampleNeed = new Needs({
                title: 'Need Title',
                description: 'Need Description'
			});

			// Create a sample Needs array that includes the new Need
			var sampleNeeds = [sampleNeed];

			// Set GET response
			$httpBackend.expectGET('needs').respond(sampleNeeds);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.needs).toEqualData(sampleNeeds);
		}));

		it('$scope.findOne() should create an array with one Need object fetched from XHR using a needId URL parameter', inject(function(Needs) {
			// Define a sample Need object
			var sampleNeed = new Needs({
                title: 'Need Title',
                description: 'Need Description'
			});

			// Set the URL parameter
			$stateParams.needId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/needs\/([0-9a-fA-F]{24})$/).respond(sampleNeed);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.need).toEqualData(sampleNeed);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Needs) {
			// Create a sample Need object
			var sampleNeedPostData = new Needs({
				title: 'Need Title',
                description: 'Need Description'
			});

			// Create a sample Need response
			var sampleNeedResponse = new Needs({
				_id: '525cf20451979dea2c000001',
				title: 'Need Title',
                description: 'Need Description'
			});

			// Fixture mock form input values
			scope.title = 'Need Title';
			scope.description = 'Need Description';

			// Set POST response
			$httpBackend.expectPOST('needs', sampleNeedPostData).respond(sampleNeedResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');

			// Test URL redirection after the Need was created
			expect($location.path()).toBe('/needs/' + sampleNeedResponse._id);
		}));

		it('$scope.update() should update a valid Need', inject(function(Needs) {
			// Define a sample Need put data
			var sampleNeedPutData = new Needs({
				_id: '525cf20451979dea2c000001',
				title: 'Need Title',
                description: 'Need Description'
			});

			// Mock Need in scope
			scope.need = sampleNeedPutData;

			// Set PUT response
			$httpBackend.expectPUT(/needs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/needs/' + sampleNeedPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid needId and remove the Need from the scope', inject(function(Needs) {
			// Create new Need object
			var sampleNeed = new Needs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Needs array and include the Need
			scope.needs = [sampleNeed];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/needs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleNeed);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.needs.length).toBe(0);
		}));
	});
}());
