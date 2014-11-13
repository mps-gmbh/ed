(function() {

	angular.module('ed.element.loadingSpinner', [])
		.directive( 'loadingSpinner', LoadingSpinner );

	function LoadingSpinner () {
		return {
			restrict: 'E',
			templateUrl: 'loading-spinner/loading-spinner.html'
		};
	}

})();
