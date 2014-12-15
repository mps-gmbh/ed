(function () {

	angular.module('ed.github')
		.factory('GithubRepository', GithubRepositoryFactory);


	// Helpers
	// -------------------------
	var isArray = angular.isArray,
		forEach = angular.forEach;


	// Factory
	// -------------------------
	GithubRepositoryFactory.$inject = [ 'GithubAPI', 'GithubMilestone' ];
	function GithubRepositoryFactory ( GithubAPI, GithubMilestone ) {

		function GithubRepository ( owner, name, token ) {
			this.owner = owner;
			this.name = name;
			this.token = token;

			if( !isArray(this.milestones) ) {
				this.milestones = [];
			}
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
				var self = this;
				return GithubAPI.milestone.all.call( null,
					self.owner,
					self.name,
					self.token
				).then( function ( milestones ) {
					self.milestones = milestones;
					forEach( milestones, function ( milestone, idx ) {
						milestones[idx] = new GithubMilestone(
							milestone,
							self.owner,
							self.name,
							self.token
						);
					});
					return milestones;
				});
			},

			getMilestone: function ( number ) {
				var self = this;
				return GithubAPI.milestone.get.call( null,
					self.owner,
					self.name,
					self.token,
					number
				).then( function ( m ) {
					var milestone = new GithubMilestone(
							m,
							self.owner,
							self.name,
							self.token
						),
						found = false;

					for (var i = self.milestones.length - 1; i >= 0; i--) {
						if( self.milestones[i].number === milestone.number ) {
							self.milestones[i] = milestone;
							found = true;
							break;
						}
					};
					if( !found ) {
						self.milestones.push(milestone);
					}

					return milestone;
				});
			}
		};

		return GithubRepository;
	}

})();
