(function () {

	angular.module('ed.dashboard')
		.controller('DashboardController', DashboardController);


	// Helpers
	// -------------------------
	var MinErr = angular.$$minErr('DashboardController');


	// Controller
	// -------------------------
	DashboardController.$inject = [ '$attrs', '$injector', 'GithubService' ];
	function DashboardController ( $attrs, $injector, GithubService ) {
		var vm = this,
			config,
			github;

		vm.isLoading = true;
		vm.milestones = [];

		//TODO Show errors on the page, not the console.
		if( !$attrs.config ) {
			throw MinErr('badargs',
				'Expected configuration for `GithubService` got {0}.\n' +
				'Please generate a configuration with `grunt config`!',
				$attrs.config );
		}

		config = $injector.get($attrs.config);
		if( !(config.owner && config.repo) ) {
			throw MinErr('badargs',
				'Expected configuration for `owner` and `repository` got {0} and {1}.',
				config.owner, config.repo );
		}

		github = new GithubService(
			config.owner,
			config.repo,
			config.token
		);

		github.getMilestones().then( function ( milestones ) {
			vm.milestones = milestones;
			vm.isLoading = false;
		});
	}

})();
