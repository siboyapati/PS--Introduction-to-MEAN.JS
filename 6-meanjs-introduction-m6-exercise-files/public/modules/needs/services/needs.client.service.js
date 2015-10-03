'use strict';

//Needs service used to communicate Needs REST endpoints
angular.module('needs').factory('Needs', ['$resource',
	function($resource) {
		return $resource('needs/:needId', { needId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);