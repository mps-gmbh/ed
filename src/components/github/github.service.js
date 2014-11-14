(function () {

	// Export
	// -------------------------
	angular.module('ed.github.service', [])
		.provider('GithubService', GithubServiceProvider);


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
		var provider = this;

		provider.API_URL = 'https://api.github.com/';
		provider.API_PREFIX_MILESTONES = '/milestones';
		provider.API_PREFIX_ISSUES = '/issues';

		provider.$get = [ '$http', '$q', 'filterFilter', function ( $http, $q, filterFilter ) {

			function GithubService ( owner, repo, token ) {
				if( !(owner && repo) ) {
					throw MinErr( 'badargs',
						'Expected at least 2 arguments [owner, repo], got {0} and {1}.',
						owner, repo );
				}

				var url = provider.API_URL + 'repos/' + owner + '/' + repo,
					httpConfig = {};

				// Add OAuth Header
				if( token ) {
					httpConfig.headers = { 'Authorization': 'token ' + token };
				}

				// Get all issues, which are assigend to the `milestone` and have a certain `sate`
				// (default is `all`).
				// - Isses will be added to the milestone's `issue` property.
				// - Isses that are PRs will be added to the mielstone's `pull_requests` property.
				function getIssuesForMilestone ( milestone, state ) {
					return $http.get( url + provider.API_PREFIX_ISSUES,
						extend( httpConfig, {
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
					return $http.get( url + provider.API_PREFIX_MILESTONES + '/' + number, httpConfig )
						.then(returnData)
						.then(getIssuesForMilestone);
				}

				// Get all **open** milestones for the repositroy
				function getMilestones () {
					return $http.get( url + provider.API_PREFIX_MILESTONES, httpConfig )
						.then(returnData)
						.then( function ( milestones ) {
							var calls = [];
							forEach( milestones, function ( milestone ) {
								calls.push(getIssuesForMilestone( milestone ));
							});
							return $q.all(calls);
						});
				}

				// Service
				return {
					getIssuesForMilestone: getIssuesForMilestone,
					getMilestone: getMilestone,
					getMilestones: getMilestones
				}
			}

			return GithubService;
		}];
	}


})();
