(function() {

	function LoadingSpinner () {
		return {
			restrict: 'E',
			templateUrl: 'loading-spinner/loading-spinner.html'
		};
	}

	angular.module('ed.element.loadingSpinner', [])
		.directive( 'loadingSpinner', LoadingSpinner );

})();
