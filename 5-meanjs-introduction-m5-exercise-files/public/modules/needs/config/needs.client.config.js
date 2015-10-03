'use strict';

// Configuring the Articles module
angular.module('needs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Volunteer Needs', 'needs', 'dropdown', '/needs(/create)?', true, ['*'], 3);
		Menus.addSubMenuItem('topbar', 'needs', 'List Needs', 'needs', null, true);
		Menus.addSubMenuItem('topbar', 'needs', 'New Need', 'needs/create', null, false, ['admin']);
	}
]);