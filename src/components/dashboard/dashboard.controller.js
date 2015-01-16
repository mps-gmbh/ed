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
	DashboardController.$inject = [ '$rootScope', '$injector', '$interval', 'tagFilter', 'GithubRepository' ];
	function DashboardController ( $rootScope, $injector, $interval, tagFilter, GithubRepository  ) {
		var vm = this,
			config;

		vm.groups = [];
		vm.repository = {};
		vm.adjustPosition = adjustPosition;

		//TODO Show errors on the page, not the console.
		if( !vm.config ) {
			throw MinErr('badargs',
				'Expected configuration to instanciate `GithubRepository ` got {0}.\n' +
				'Please generate a configuration with `grunt config`!',
				vm.config );
		}

		config = $injector.get(vm.config);
		if( !(config.owner && config.repo) ) {
			throw MinErr('badargs',
				'Expected configuration for `owner` and `repository` got {0} and {1}.',
				config.owner, config.repo );
		}

		// Initializie repository.
		vm.repository = new GithubRepository (
			config.owner,
			config.repo,
			config.token
		);
		refreshMilestones();

		// Automatically refresh every x minutes
		$interval(refreshMilestones, (config.milestones_refresh_timer || 10) * 60000);

		function refreshMilestones () {
			vm.groups = [];
			vm.repository.getMilestones().then( function ( milestones ) {
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
				return milestones;
			}).then( function ( milestones ) {
				forEach( milestones, function ( milestone ) {
					milestone.getIssues();
				});
			}).then( function () {
				$rootScope.$broadcast( 'ed:milestones:refreshed', vm.repository.name );
			});
		}

		function adjustPosition () {
			console.log('adjust!');
			console.log(arguments);
		}
	}

})();
