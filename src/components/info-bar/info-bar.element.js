(function () {

	angular.module('ed.infobar')
		.directive('edInfoBar', InfoBarDirective );


	function InfoBarDirective () {
		return {
			restrict: 'E',
			templateUrl: 'info-bar/info-bar.html',
			scope: {},
			link: linkFn
		};
	}

	function linkFn ( scope ) {
		scope.$on( 'ed:milestones:refreshed', function () {
			scope.refresh_time = (new Date()).toISOString();
		});
	}

})();
