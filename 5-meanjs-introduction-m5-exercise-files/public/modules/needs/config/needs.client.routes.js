'use strict';

//Setting up route
angular.module('needs').config(['$stateProvider',
	function($stateProvider) {
		// Needs state routing
		$stateProvider.
		state('listNeeds', {
			url: '/needs',
			templateUrl: 'modules/needs/views/list-needs.client.view.html'
		}).
		state('createNeed', {
			url: '/needs/create',
			templateUrl: 'modules/needs/views/create-need.client.view.html'
		}).
		state('viewNeed', {
			url: '/needs/:needId',
			templateUrl: 'modules/needs/views/view-need.client.view.html'
		}).
		state('editNeed', {
			url: '/needs/:needId/edit',
			templateUrl: 'modules/needs/views/edit-need.client.view.html'
		});
	}
]);