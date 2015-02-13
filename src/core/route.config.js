(function () {

	angular.module('ed.core')
		.config( RouteConfiguration );


	RouteConfiguration.$inject = ['$locationProvider', '$routeProvider'];
	function RouteConfiguration ( $locationProvider, $routeProvider ) {
		$locationProvider.hashPrefix('!');

		$routeProvider
			// Grouped Milestones
			.when('/milestones', {
				template: 'MILESTONES'
			})
			// Bug List
			.when('/bugs', {
				template: 'BUGS'
			})
			// Fallback
			.otherwise({ redirectTo: '/milestones' });
	}

})();
