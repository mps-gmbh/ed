(function () {

	angular.module('ed.dashboard')
		.directive('edDashboard', DashboardDirective );

	function DashboardDirective () {
		return {
			restrict: 'E',
			templateUrl: 'dashboard/dashboard.html',
			controller: 'DashboardController',
			controllerAs: 'dashboard',
			scope: {}
		};
	}

})();
