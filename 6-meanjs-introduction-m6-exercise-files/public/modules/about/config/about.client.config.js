'use strict';

// About module config
angular.module('about').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'About', 'about', 'item', '/about', true, null, 2);
	}
]);

