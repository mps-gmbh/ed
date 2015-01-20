(function () {

	angular.module('ed.core')
		.config( CoreConfiguration );

	CoreConfiguration.$inject = [ '$httpProvider' ];
	function CoreConfiguration ( $httpProvider ) {
		$httpProvider.useApplyAsync(true);
	}

})();
