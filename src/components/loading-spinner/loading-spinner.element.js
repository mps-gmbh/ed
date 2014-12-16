(function() {

	angular.module('ed.loadingSpinner')
		.directive( 'edLoadingSpinner', LoadingSpinner );

	function LoadingSpinner () {
		return {
			restrict: 'E',
			templateUrl: 'loading-spinner/loading-spinner.html'
		};
	}

})();
