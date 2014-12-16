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
			/* jshint -W086 */ /* (purposefully fall through case statements) */
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
							.slice((GithubAPI.getAPIBase() + GithubAPI.getLocation('repo')).length)
							.split('/');
						this._owner = parts[0];
						this._repo = parts[1];
					}
					break;
				default:
					throw MinErr( 'badargs',
						'Expected `GithubMilestone` to be called with 1-4 arguments, got {0}.',
						arguments.length );
			}
			/* jshint +W086 */ /* (purposefully fall through case statements) */
			extend( this, data );

			if( this._owner && this._repo && this.title ) {
				this.html_url = GithubAPI.getHTMLBase() + this._owner + '/' + this._repo +
						GithubAPI.getPrefix('milestone') + '/' + this.title;
			}
		}

		GithubMilestone.prototype = {

			refresh: function () {
				var self = this;
				self.isRefreshing = true;
				if( !self.url ) {
					throw MinErr( 'badcfg',
						'Can not refresh Milestone. Expected property "url" to be defined, ' +
						'got {0}.',
						self.url );
				}
				return $http.get( self.url, utils.request.createAuthHeader(self._token) )
					.then(utils.response.unwrap)
					.then(function ( milestone ) {
						utils.response.shallowClearAndCopy( self, milestone );
						delete self.isRefreshing;
						return self;
					});
			},

			getIssues: function () {
				var self = this;
				self.isLoadingIssues = true;
				return GithubAPI.issue.all(
					self._owner, self._repo, self._token,
					{ milestone: self.number }
				).then( function ( issues ) {
					self.issues = issues;
					self.pull_requests = [];

					// Enqueue to fetch additional `pull request` data
					var calls = [];
					forEach( self.issues, function ( issue ) {
						if( !issue.pull_request ) {	return; }
						self.pull_requests.push(issue);
						calls.push(function () {
							return $http.get(issue.pull_request.url, utils.request.createAuthHeader(self._token))
								.then(utils.response.unwrap)
								.then(function ( pr ) {
									utils.response.shallowClearAndCopy( issue, pr );
								});
						});
					});
					return $q.all(calls);
				}).then( function () {
					delete self.isLoadingIssues;
					return self.issues;
				});
			}

		};

		return GithubMilestone;
	}

})();
