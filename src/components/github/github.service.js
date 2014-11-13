(function () {

	// Export
	// -------------------------
	angular.module('ed.github.service', [])
		.provider('githubService', GithubServiceProvider);


	// Defaults
	// -------------------------
	var CONFIG_PARAMS = ['owner', 'repo'],
		CONFIG_PARAMS_OPTIONAL = ['token'],

		GITHUB_API_URL = 'https://api.github.com/',
		GITHUB_API_MILESTONES = '/milestones',
		GITHUB_API_ISSUES = '/issues';


	// Helpers
	// -------------------------
	var extend = angular.extend,
		forEach = angular.forEach,
		isDefined = angular.isDefined,
		MinErr = angular.$$minErr('GithubService'),
		returnData = function ( response ) {
			return response.data;
		};


	// Provider
	// -------------------------
	function GithubServiceProvider () {
		var provider = this,
			ghConfig = {};

		// Create setter/getter for configuration params.
		forEach( [].concat(CONFIG_PARAMS, CONFIG_PARAMS_OPTIONAL), function ( name ) {
			provider[name] = function ( value ) {
				if( isDefined(value) ) {
					ghConfig[name] = value;
				}
				return ghConfig[name];
			};
		});


		// Service
		provider.$get = [ '$http', '$q', 'filterFilter', function ( $http, $q, filterFilter ) {
			// Check required config params.
			forEach(CONFIG_PARAMS, function ( name ) {
				if( !ghConfig[name] ) {
					throw MinErr( 'badconfig',
						'Expected configuration property `{0}` to be defined, got {1}. \n' +
						'Please set the property via `GithubServiceProvider.{0}(<value>)`!',
						name, ghConfig[name] );
				}
			});

			var BASE_URL = GITHUB_API_URL + 'repos/' + ghConfig.owner + '/' + ghConfig.repo,
				HTTP_CONFIG = {};

			// Add OAuth Header
			if( ghConfig.token ) {
				HTTP_CONFIG.headers = { 'Authorization': 'token ' + ghConfig.token };
			}

			// Get all issues, which are assigend to the `milestone` and have a certain `sate`
			// (default is `all`).
			// - Isses will be added to the milestone's `issue` property.
			// - Isses that are PRs will be added to the mielstone's `pull_requests` property.
			function getIssuesForMilestone ( milestone, state ) {
				return $http.get( BASE_URL + GITHUB_API_ISSUES,
					extend( HTTP_CONFIG, {
						params: {
							'milestone': milestone.number,
							'state': state || 'all'
						}
					})
				).then(returnData).then( function ( issues ) {
					milestone.issues = issues;
					milestone.pull_requests = filterFilter( issues, { pull_request: '!!' } );
					return milestone;
				});
			}

			// Get a single milestone
			function getMilestone( number ) {
				return $http.get( BASE_URL + GITHUB_API_MILESTONES + '/' + number, HTTP_CONFIG )
					.then(returnData)
					.then(getIssuesForMilestone);
			}

			// Get all **open** milestones for the repositroy
			function getMilestones () {
				return $http.get( BASE_URL + GITHUB_API_MILESTONES, HTTP_CONFIG )
					.then(returnData)
					.then( function ( milestones ) {
						var calls = [];
						forEach( milestones, function ( milestone ) {
							calls.push(getIssuesForMilestone( milestone ));
						});
						return $q.all(calls);
					});
			}


			// Export
			return {
				getIssuesForMilestone: getIssuesForMilestone,
				getMilestone: getMilestone,
				getMilestones: getMilestones
			};
		}];
	}

})();
