(function () {

	angular.module('ed.github')
		.factory('GithubRepository', GithubRepositoryFactory);


	// Helpers
	// -------------------------
	var isArray = angular.isArray,
		forEach = angular.forEach;


	// Factory
	// -------------------------
	GithubRepositoryFactory.$inject = [ 'GithubAPI', 'GithubIssue', 'GithubMilestone' ];
	function GithubRepositoryFactory ( GithubAPI, GithubIssue, GithubMilestone ) {

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
				var self = this;
				self.isLoadingIssues = true;
				return GithubAPI.issue.all.call( null,
					this.owner,
					this.name,
					this.token,
					filter
				).then( function ( issues ) {
					forEach( issues, function ( issue, idx ) {
						issues[idx] = new GithubIssue(issue);
					});
					delete self.isLoadingIssues;
					return issues;
				});
			},

			// Milestones
			getMilestones: function () {
				var self = this;
				self.isLoadingMilestones = true;
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
					delete self.isLoadingMilestones;
					return milestones;
				});
			},

			getMilestone: function ( number ) {
				var self = this;
				self.isLoadingMilestone = number;
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
					}
					if( !found ) {
						self.milestones.push(milestone);
					}
					delete self.isLoadingMilestone;
					return milestone;
				});
			}
		};

		return GithubRepository;
	}

})();
