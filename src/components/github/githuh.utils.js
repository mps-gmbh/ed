(function () {

	angular.module('ed.github')
		.service('GithubUtils', GithubUtils);

	function GithubUtils () {

		// Request
		// -------------------------
		this.request = {
			createAuthHeader: function ( token ) {
				return {
					'headers': {
						'Authorization': 'token ' + token
					}
				};
			}
		};


		// Resposne
		// -------------------------
		this.response = {
			unwrap: function ( response ) {
				return response.data;
			},

			shallowClearAndCopy: function ( dst, src ) {
				dst = dst || {};

				// Clear
				for( var key in dst ) {
					if( key.charAt(0) !== '_' ) {
						delete dst[key];
					}
				}
				// Copy
				for( var key in src ) {
					if (src.hasOwnProperty(key) && key.charAt(0) !== '_' ) {
						dst[key] = src[key];
					}
				}

				return dst;
			}
		};
	}

})();
