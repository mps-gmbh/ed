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

			this.priority = (function ( labels ) {
				for (var i = labels.length - 1; i >= 0; i--) {
					var matches = /^priority:(.*)/.exec(labels[i].name);
					return matches ? matches[1] : 'normal';
				}
			})( data.labels );
		}

		GithubIssue.prototype = {

			hasLabel: function ( name ) {
				var exp = new RegExp( '^' + name + '$', 'i' );
				return this.labels.some( function ( label ) {
					return exp.test(label.name);
				});
			},

			priorityAsNumber: function () {
				switch( this.priority ) {
					case 'high':
						return 3;
					case 'low':
						return 1;
					default:
						return 2;
				}
			}

		};

		return GithubIssue;
	}

})();
