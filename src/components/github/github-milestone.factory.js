(function () {

	angular.module('ed.github')
		.factory('GithubMilestone', GithubMilestoneFactory);


	// Helpers
	// -------------------------
	var extend = angular.extend,
		forEach = angular.forEach,
		MinErr = angular.$$minErr('GithubMilestone');

		function returnResponseData ( response ) {
			return response.data;
		}
		function shallowClearAndCopy( src, dst ) {
			dst = dst || {};

			forEach(dst, function ( value, key ) {
				if( !(key.charAt(0) === '_') ) {
					delete dst[key];
				}
			});

			for (var key in src) {
				if (src.hasOwnProperty(key)) {
					dst[key] = src[key];
				}
			}

			return dst;
		}

	// Factory
	// -------------------------
	GithubMilestoneFactory.$inject = [ '$http', 'GithubAPI' ];
	function GithubMilestoneFactory ( $http, GithubAPI ) {

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
					.then(returnResponseData)
					.then(function ( milestone ) {
						shallowClearAndCopy( milestone, self );
						return self;
					});
			},

			getIssues: function () {
				var self = this;
				return GithubAPI.issue.all(
					self._owner, self._repo, self._token,
					{ milestone: self.number }
				).then( function ( issues ) {
					return self.issues = issues;
				});
			}

		};

		return GithubMilestone;
	}

})();
