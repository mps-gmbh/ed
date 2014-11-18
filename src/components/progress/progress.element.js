(function () {

	angular.module('ed.element.progress')
		.directive('edProgress', ProgressDirective );

	function ProgressDirective () {
		return {
			restrict: 'E',
			templateUrl: 'progress/progress.html',
			scope: {
				percentage: '='
			}
		};
	}

})();
