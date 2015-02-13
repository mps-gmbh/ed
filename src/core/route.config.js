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
				template: '<h1>comming soon!</h1><img src="http://stream1.gifsoup.com/view5/2581467/rick-roll-o.gif" alt="ricky" />'
			})
			// Fallback
			.otherwise({ redirectTo: '/milestones' });
	}

})();
