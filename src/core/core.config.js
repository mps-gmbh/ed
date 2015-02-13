(function () {

	angular.module('ed.core')
		.config( CoreConfiguration )
		.run( CoreSetup );


	// Configuration
	// -------------------------
	CoreConfiguration.$inject = [ '$httpProvider' ];
	function CoreConfiguration ( $httpProvider ) {
		$httpProvider.useApplyAsync(true);
	}


	// Setup
	// -------------------------
	CoreSetup.$inject = [ 'GithubStore', 'ED_CONFIGURATION' ];
	function CoreSetup ( GithubStore, settings ) {
		var rid = GithubStore.addRepository(
				settings.owner, settings.repo, settings.token,
				settings.milestone_groups);
		GithubStore.setActiveRepository(rid);
	}

})();
