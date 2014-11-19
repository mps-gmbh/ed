(function () {

	// Export
	// -------------------------
	angular.module('ed.github.service', [])
		.provider('GithubService', GithubServiceProvider);


	// Helpers
	// -------------------------
	var extend = angular.extend,
		forEach = angular.forEach,
		copy = angular.copy,
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

		provider.$get = [ '$http', '$q', function ( $http, $q ) {

			function GithubService ( owner, repo, token ) {
				if( !(owner && repo) ) {
					throw MinErr( 'badargs',
						'Expected at least 2 arguments [owner, repo], got {0} and {1}.',
						owner, repo );
				}

				var url = provider.API_URL + 'repos/' + owner + '/' + repo,
					httpConfig = {};

				// Helper to fetch PRs + extend issues with received data.
				function getPullRequestFromIssue ( issue ) {
					return $http.get(issue.pull_request.url, httpConfig)
						.then(returnData)
						.then( function ( pr ) {
							extend( issue, pr );
						});
				}

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
						extend( copy(httpConfig), {
							params: {
								'milestone': milestone.number,
								'state': state || 'all'
							}
						})
					).then(returnData).then( function ( issues ) {
						var calls = [];
						milestone.issues = issues;
						milestone.pull_requests = [];
						forEach( milestone.issues, function ( isu ) {
							if( !isu.pull_request ) { return; }
							milestone.pull_requests.push(isu);
							calls.push(getPullRequestFromIssue(isu));
						});
						return $q.all(calls);
					}).then(function () {
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
				};
			}

			return GithubService;
		}];
	}


})();
