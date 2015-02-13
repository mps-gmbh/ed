(function () {

	angular.module('ed.github')
		.provider('GithubStore', GithubStoreProvider);


	// Helpers
	// -------------------------
	var copy = angular.copy,
		forEach = angular.forEach,
		isString = angular.isString,

		MinErr = angular.$$minErr('GithubStore');


	function GithubStoreProvider () {
		var provider = this;

		provider.milestone_group_default = 'backlog';
		provider.milestone_groups = [provider.milestone_group_default];
		provider.refresh_timer = 600000; // 10min

		provider.$get = GithubStoreConstructor;

		// Constructor
		GithubStoreConstructor.$inject = [ '$q', 'GithubRepository', 'tagFilter' ];
		function GithubStoreConstructor ( $q, GithubRepository, tagFilter ) {
			// Create empty milestone groups.
			// This will be added to every repository added to the store.
			var emptyMilestoneGroups = {};
			forEach( provider.milestone_groups, function ( name ) {
				emptyMilestoneGroups[name] = [];
			});


			// Service
			// -------------------------
			function GithubStore () {
				// Internal stores are public accessible but users should use exposed
				// methods most of the time! Exposing them publicly makes it easiert
				// to test and debug.
				this._repositories = {};
				this._issues = {};
			}

			// Repository Methods
			GithubStore.prototype.addRepository = function ( owner, name, token ) {
				var rid = this._getRepositoryIdentifier( owner, name );
				if( this.hasRepository(rid) ) {
					throw MinErr('badcfg',
						'Repository "' + rid + '" already stored.');
				}
				this._repositories[rid] = {
					instance: new GithubRepository( owner, name, token ),
					milestones: {
						all: [],
						group: copy(emptyMilestoneGroups)
					}
				};
				return rid;
			};
			GithubStore.prototype.removeRepository = function ( a1, name ) {
				delete this._repositories[this._getRepositoryIdentifier(a1, name)];
			};
			GithubStore.prototype.hasRepository = function ( a1, name ) {
				return !!this._repositories[this._getRepositoryIdentifier(a1, name)];
			};


			// Milestones
			// If the user requests milestones we will always return a promise.
			// This is due to the fact that we will fetch the data from Github
			// if it's too old.
			GithubStore.prototype.getMilestones = function ( a1, a2, a3 ) {
				var grouped, rid, repo,
					deferred;

				switch(arguments.length) {
					case 3:
						rid = this._getRepositoryIdentifier(a1, a2);
						grouped = a3;
						break;
					case 2:
					case 1:
						if( isString(a2) ) {
							rid = this._getRepositoryIdentifier(a1, a2);
							grouped = false;
							break;
						}
						rid = this._getRepositoryIdentifier(a1);
						grouped = a2;
						break;
					default:
						throw MinErr('badargs',
							'Expected 1-3 arguments [owner, name, grouped] got {0}.',
							arguments.length);
				}

				if( !this.hasRepository(rid) ) {
					throw MinErr('badargs',
						'Repository "' + rid + '" does not exist in the store.');
				}

				repo = this._repositories[rid];
				if( this._isTooOld(repo.updated_at) ) {
					return repo.instance.getMilestones()
						// Update and gorup milestones
						.then( function ( milestones ) {
							repo.updated_at = new Date();
							repo.milestones.all = milestones;
							forEach( milestones, function ( milestone ) {
								var tag;
								milestone.getIssues();
								tag = (tagFilter(milestone.title) || '').toLowerCase();
								tag = ~provider.milestone_groups.indexOf(tag) ?
									tag : provider.milestone_group_default;
								repo.milestones.group[tag].push(milestone);
							});
							return grouped ? repo.milestones.group : milestones;
						});
				} else {
					deferred = $q.defer();
					deferred.resolve(repo.milestones[grouped ? 'group' : 'all']);
					return deferred.promise;
				}
			};


			// "Private" Utility Methods
			// Some methods can be called with the (1) "identifier"
			// or with (2) "owner" AND "name". IN those cases:
			// (1) -> a1 is the full identifier, e.g. "mps-gmbh/ed"
			// (2) -> a1 is the owner, e.g. "mps-gmbh"
			GithubStore.prototype._getRepositoryIdentifier = function ( a1, name ) {
				return name ? a1 + '/' + name : a1;
			};

			// Test if a `Date` is too old.
			GithubStore.prototype._isTooOld = function ( date ) {
				if( !date ) { return true; }

				var now = (new Date()).getTime();
				return (now - date.getTime()) > (provider.refresh_timer * 60000);
			};

			// Exports
			return new GithubStore();
		}
	}



})();