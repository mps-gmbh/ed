(function () {

	angular.module('ed.dashboard')
		.controller('DashboardController', DashboardController);


	// Helpers
	// -------------------------
	var MinErr = angular.$$minErr('DashboardController'),
		isArray = angular.isArray,
		isNumber = angular.isNumber,
		forEach = angular.forEach,

		MILESTONE_FALLBACK_GROUP = 'backlog';


	// Controller
	// -------------------------
	DashboardController.$inject = [ '$attrs', '$injector', 'tagFilter', 'GithubService' ];
	function DashboardController ( $attrs, $injector, tagFilter, GithubService ) {
		var vm = this,
			config,
			github;

		vm.isLoading = true;
		vm.groups = [];

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
			// Fallback for no groups
			if( !(config.milestone_groups && isArray(config.milestone_groups)) ) {
				vm.groups.push({ name: 'milestones', milestones: milestones });
			} else {

				var groupMap = {},
					last;
				forEach( config.milestone_groups, function ( name, idx ) {
					vm.groups.push({ name: name.toLowerCase(), milestones: [] });
					groupMap[name] = idx;
				});
				vm.groups.push({
					name: (config.milestones_groups_default || MILESTONE_FALLBACK_GROUP).toLowerCase(),
					milestones: []
				});
				last = vm.groups.length - 1;
				forEach( milestones, function ( milestone ) {
					var groupIdx = groupMap[(tagFilter(milestone.title) || '').toLowerCase()];
					vm.groups[isNumber(groupIdx) ? groupIdx : last].milestones
						.push(milestone);
				});
			}
			vm.isLoading = false;
		});
	}

})();
