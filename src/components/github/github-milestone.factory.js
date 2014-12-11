(function () {

	angular.module('ed.github')
		.factory('GithubMilestone', GithubMilestoneFactory);


	// Helpers
	// -------------------------
	var extend = angular.extend,
		forEach = angular.forEach,
		MinErr = angular.$$minErr('GithubMilestone');


	// Factory
	// -------------------------
	GithubMilestoneFactory.$inject = [ '$http', '$q', 'GithubAPI', 'GithubUtils' ];
	function GithubMilestoneFactory ( $http, $q, GithubAPI, utils ) {

		function GithubMilestone ( data, a1, a2, a3 ) {
			switch( arguments.length ) {
				case 4:
				case 3:
					this._owner = a1;
					this._repo = a2;
					this._token = a3;
					break;
				case 2:
					this._token = a1;
					// Fall through
				case 1:
					// Set a repository and owner from `url`.
					if( data.url ) {
						var parts = data.url
							.slice((GithubAPI.getUrlBase() + GithubAPI.getLocation('repo')).length)
							.split('/');
						this._owner = parts[0];
						this._repo = parts[1];
					}
					break;
				default:
					throw MinErr( 'badargs',
						'Expected `GithubMilestone` to be called with 1-4 arguments, got {0}.',
						argument.length );
					break;
			}
			extend( this, data );
		}

		GithubMilestone.prototype = {

			refresh: function () {
				var self = this;
				if( !self.url ) {
					throw MinErr( 'badcfg',
						'Can not refresh Milestone. Expected property "url" to be defined, ' +
						'got {0}.',
						self.url );
				}
				return $http.get( self.url )
					.then(utils.response.unwrap)
					.then(function ( milestone ) {
						utils.response.shallowClearAndCopy( self, milestone );
						return self;
					});
			},

			getIssues: function () {
				var self = this;
				return GithubAPI.issue.all(
					self._owner, self._repo, self._token,
					{ milestone: self.number }
				).then( function ( issues ) {
					self.issues = issues;
					self.pull_requests = [];

					// Queue to fetch additional `pull request` data
					var calls = [];
					forEach( self.issues, function ( issue ) {
						if( !issue.pull_request ) {	return; }
						self.pull_requests.push(issue);
						// calls.push();
					});
					return self.issues;
				});
			}

		};

		return GithubMilestone;
	}

})();
