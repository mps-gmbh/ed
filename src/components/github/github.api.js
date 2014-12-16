(function () {

	angular.module('ed.github')
		.provider('GithubAPI', GithubAPIProvider);


	// Helpers
	// -------------------------
	var isObject = angular.isObject,
		isNumber = angular.isNumber,
		MinErr = angular.$$minErr('GithubAPI');


	// Provider
	// -------------------------
	function GithubAPIProvider () {
		var provider = this;

		provider.BASE_API = 'https://api.github.com/';
		provider.BASE_HTML = 'https://www.github.com/';

		provider.LOCATION_REPOS = 'repos/';

		provider.PREFIX_MILESTONES = '/milestones';
		provider.PREFIX_ISSUES = '/issues';

		function createRepoUrl ( base, owner, repo ) {
			if( !(base && owner && repo) ) {
				throw MinErr('badargs',
					'Expected [base, owner, repo], got "{0}", "{1}" and "{2}".',
					base, owner, repo);
			}
			return base + provider.LOCATION_REPOS + owner + '/' + repo;
		}

		// Getter
		// -------------------------
		provider.$get = [ '$http', 'GithubUtils', function ( $http, utils ) {

			// Service
			// -------------------------
			function GithubAPI () {}

			GithubAPI.prototype = {

				// Config
				getAPIBase: function () {
					return provider.BASE_API;
				},
				getHTMLBase: function () {
					return provider.BASE_HTML;
				},
				getLocation: function ( type ) {
					if( /repos?/i.test(type) ) {
						return provider.LOCATION_REPOS;
					}
					return null;
				},
				getPrefix: function ( type ) {
					if( /milestones?/i.test(type) ) {
						return provider.PREFIX_MILESTONES;
					}
					if( /issues?/i.test(type) ) {
						return provider.PREFIX_ISSUES;
					}
					return null;
				},


				// Issue API
				issue: {
					all: function ( owner, repo, token, filter ) {
						if ( filter && !isObject(filter) ) {
							throw MinErr('badargs',
								'Expected filter (4th arg) to be an Object, got {0}.',
								typeof filter );
						}
						filter = filter || {};
						filter.state = filter.state || 'all';
						return $http.get(
							createRepoUrl(provider.BASE_API, owner, repo) + provider.PREFIX_ISSUES,
							utils.request.createHttpConfig(token, filter)
						).then(utils.response.unwrap);
					}
				},

				// Milestone API
				milestone: {
					get: function ( owner, repo, token, number ) {
						if ( !isNumber(number) ) {
							throw MinErr('badargs',
								'Expected 4th arguments to be milestone\'s number, got {0}.',
								number );
						}
						return $http.get(
							createRepoUrl(provider.BASE_API, owner, repo) + provider.PREFIX_MILESTONES + '/' + number,
							utils.request.createHttpConfig(token)
						).then(utils.response.unwrap);
					},

					all: function ( owner, repo, token ) {
						return $http.get(
							createRepoUrl(provider.BASE_API, owner, repo) + provider.PREFIX_MILESTONES,
							utils.request.createHttpConfig(token)
						).then(utils.response.unwrap);
					}
				}
			};

			return new GithubAPI();
		}];
	}

})();
