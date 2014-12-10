(function () {

	angular.module('ed.github')
		.factory('GithubRepository', GithubRepositoryFactory);


	// Factory
	// -------------------------
	GithubRepositoryFactory.$inject = [ 'GithubAPI' ];
	function GithubRepositoryFactory ( GithubAPI ) {

		function GithubRepository ( owner, name, token ) {
			this.owner = owner;
			this.name = name;
			this.token = token;
		}

		GithubRepository.prototype = {

			// Issues
			getIssues: function ( filter ) {
				return GithubAPI.issue.all.call( null,
					this.owner,
					this.name,
					this.token,
					filter );
			},

			// Milestones
			getMilestones: function () {
				return GithubAPI.milestone.all.call( null,
					this.owner,
					this.name,
					this.token );
			},

			getMilestone: function ( number ) {
				return GithubAPI.milestone.get.call( null,
					this.owner,
					this.name,
					this.token,
					number );
			}
		};

		return GithubRepository;
	}

})();
