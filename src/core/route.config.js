(function () {

	angular.module('ed.core')
		.config( RouteConfiguration );


	RouteConfiguration.$inject = ['$locationProvider', '$routeProvider'];
	function RouteConfiguration ( $locationProvider, $routeProvider ) {
		$locationProvider.hashPrefix('!');

		$routeProvider
			// Grouped Milestones
			.when('/milestones', {
				template: '<ed-milestone-list></ed-milestone-list>'
			})
			// Bug List
			.when('/bugs', {
				template: '<ed-bug-list></ed-bug-list>'
			})
			// Fallback
			.otherwise({ redirectTo: '/milestones' });
	}

})();
