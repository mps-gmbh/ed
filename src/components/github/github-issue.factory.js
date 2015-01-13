( function () {

	angular.module('ed.github')
		.factory('GithubIssue', GithubIssueFactory);


	// Helpers
	// -------------------------
	var extend = angular.extend;


	// Factory
	// -------------------------
	function GithubIssueFactory () {

		function GithubIssue ( data ) {
			extend( this, data );
		}

		GithubIssue.prototype = {

			hasLabel: function ( name ) {
				var exp = new RegExp( '^' + name + '$', 'i' );
				return this.labels.some( function ( label ) {
					return exp.test(label.name);
				});
			}

		};

		return GithubIssue;
	}

})();
