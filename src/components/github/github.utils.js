(function () {

	angular.module('ed.github')
		.service('GithubUtils', GithubUtils);


	// Helper
	// -------------------------
	var
		isObject = angular.isObject,
		isDefined = angular.isDefined,
		extend = angular.extend,
		MinErr = angular.$$minErr('GithubUtils');


	// Service
	// -------------------------
	function GithubUtils () {
		var self = this;

		// Request
		// -------------------------
		this.request = {
			createAuthHeader: function ( token ) {
				if( !token ) { return {}; }
				return {
					'headers': {
						'Authorization': 'token ' + token
					}
				};
			},
			createHttpConfig: function ( token, filter ) {
				if( isDefined(filter) && !isObject(filter) ) {
					throw MinErr('badargs',
						'Expected 2nd argument to be `undefined` or an `Object`, got {0}.',
						filter);
				}
				return extend( {},
					self.request.createAuthHeader(token),
					{ params: ( filter ? filter : {} ) }
				);
			}
		};


		// Resposne
		// -------------------------
		this.response = {
			unwrap: function ( response ) {
				return response.data;
			},

			shallowClearAndCopy: function ( dst, src ) {
				var key;
				dst = dst || {};

				// Clear
				for( key in dst ) {
					if( key.charAt(0) !== '_' ) {
						delete dst[key];
					}
				}
				// Copy
				for( key in src ) {
					if (src.hasOwnProperty(key) && key.charAt(0) !== '_' ) {
						dst[key] = src[key];
					}
				}

				return dst;
			}
		};
	}

})();
