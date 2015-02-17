(function () {

	angular.module('ed.github')
		.factory('GithubMilestone', GithubMilestoneFactory);


	// Helpers
	// -------------------------
	var extend = angular.extend,
		forEach = angular.forEach,
		isUndefined = angular.isUndefined,
		MinErr = angular.$$minErr('GithubMilestone');


	// Factory
	// -------------------------
	GithubMilestoneFactory.$inject = [ '$http', '$q', 'GithubAPI', 'GithubIssue', 'GithubUtils' ];
	function GithubMilestoneFactory ( $http, $q, GithubAPI, GithubIssue, utils ) {

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
			updateProgress: function () {
				var open = 0,
					closed = 0;
				forEach( this.issues, function ( issue ) {
					// Ignore PR Issues
					if( isUndefined(issue.pull_request) ) {
						if( issue.state === 'open' ) {
							open++;
						} else {
							closed++;
						}
					}
				});
				this.progress = closed/(open + closed);
			},

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
					})
					.then(function () {
						return self.getIssues();
					})
					.then(function () {
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

					// Cast to `GithubIssue` +
					// enqueue to fetch additional `pull request` data
					var calls = [];
					forEach( self.issues, function ( issue, idx ) {
						self.issues[idx] = new GithubIssue(issue);
						if( !issue.pull_request ) {	return; }
						self.pull_requests.push(issue);
						calls.push(
							$http.get(issue.pull_request.url, utils.request.createAuthHeader(self._token))
								.then(utils.response.unwrap)
								.then(function ( pr ) {
									utils.response.shallowClearAndCopy( issue, pr );
								})
						);
					});
					return $q.all(calls);
				}).then( function () {
					self.updateProgress();
					delete self.isLoadingIssues;
					return self.issues;
				});
			}

		};

		return GithubMilestone;
	}

})();
