'use strict';

// Configuring the Articles module
angular.module('needs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Needs', 'needs', 'dropdown', '/needs(/create)?');
		Menus.addSubMenuItem('topbar', 'needs', 'List Needs', 'needs');
		Menus.addSubMenuItem('topbar', 'needs', 'New Need', 'needs/create');
	}
]);