'use strict';

// Needs controller
angular.module('needs').controller('NeedsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Needs',
	function($scope, $stateParams, $location, $http, Authentication, Needs) {
		$scope.authentication = Authentication;

		// Create new Need
		$scope.create = function() {
            // Create new Need object
            var need = new Needs({
                title: this.title,
                description: this.description,
                organization: this.organization,
                location: this.location,
                numberNeeded: this.numberNeeded,
                startDate: this.startDate,
                endDate: this.endDate,
                isActive: this.isActive
            });

			// Redirect after save
			need.$save(function(response) {
				$location.path('needs/' + response._id);

                // Clear form fields
                $scope.title = '';
                $scope.description = '';
                $scope.organization = '';
                $scope.location = '';
                $scope.numberNeeded = 1;
                $scope.startDate = Date.now;
                $scope.endDate = null;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Need
		$scope.remove = function(need) {
			if ( need ) { 
				need.$remove();

				for (var i in $scope.needs) {
					if ($scope.needs [i] === need) {
						$scope.needs.splice(i, 1);
					}
				}
			} else {
				$scope.need.$remove(function() {
					$location.path('needs');
				});
			}
		};

		// Update existing Need
		$scope.update = function() {
			var need = $scope.need;

			need.$update(function() {
				$location.path('needs/' + need._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        // Find a list of Needs
        $scope.find = function() {
            $scope.needs = Needs.query();

            $scope.signUpData = {
                name: '',
                email: '',
                message: '',
                needTitle: '',
                need_id: ''
            };
        };

		// Find existing Need
		$scope.findOne = function() {
			$scope.need = Needs.get({ 
				needId: $stateParams.needId
			});
		};

        // Sign-up form
        $scope.signUp = function (need) {
            var frm = $scope.signUpData;
            var msg = frm.name + ' has requested to volunteer for ' + need.title + ', item: [' + need._id + ']';

            $http.post('/email', {
                name: frm.name,
                email: frm.email,
                message: msg
            }).
                success(function (response) {
                    //
                    console.log('Success - sent email!');

                }).error(function (response) {
                    console.log('Oops - no sendie email!');
                });
        };

	}
]);
