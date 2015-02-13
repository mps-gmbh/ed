(function () {

	angular.module('ed.github')
		.provider('GithubStore', GithubStoreProvider);


	// Helpers
	// -------------------------
	var forEach = angular.forEach,
		isString = angular.isString,
		isArray = angular.isArray,

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

			// Service
			// -------------------------
			function GithubStore () {
				// Internal stores are public accessible but users should use exposed
				// methods most of the time! Exposing them publicly makes it easiert
				// to test and debug.
				this._repositories = {};
				this._issues = {};
				this._active = null;
			}

			// Repository Methods
			GithubStore.prototype.addRepository = function ( owner, name, a2, a3 ) {
				var rid = this._getRepositoryIdentifier( owner, name ),
					token, tags;

				if( this.hasRepository(rid) ) {
					throw MinErr('badcfg',
						'Repository "' + rid + '" already stored.');
				}

				// Arguments 3 and 4 are optional. Can either the auth token or
				// customized tags.
				switch(arguments.length) {
					case 4:
						token = a2;
						tags = a3;
						break;
					case 3:
						if( isString(a2) ) {
							token = a2;
						} else {
							tags = a2;
						}
						break;
				}

				// Add default group if missing.
				if( isArray(tags) ) {
					if( !~tags.indexOf(provider.milestone_group_default) ) {
						tags.push(provider.milestone_group_default);
					}
				// Fallback to use default milestone group
				} else {
					tags = provider.milestone_groups;
				}
				tags = isArray(tags) ? tags : provider.milestone_groups;

				this._repositories[rid] = {
					id: rid,
					instance: new GithubRepository( owner, name, token ),
					milestones: {
						all: [],
						group: createGroups(tags),
						tags: tags
					}
				};
				return rid;
			};
			GithubStore.prototype.removeRepository = function ( a1, name ) {
				delete this._repositories[this._getRepositoryIdentifier(a1, name)];
			};
			GithubStore.prototype.getRepository = function ( a1, name ) {
				var rid = this._getRepositoryIdentifier( a1, name );
				if( !this.hasRepository(rid) ) {
					throw MinErr('badargs',
						'Repository "' + rid + '" does not exist in the store.');
				}
				return this._repositories[rid];
			};
			GithubStore.prototype.hasRepository = function ( a1, name ) {
				return !!this._repositories[this._getRepositoryIdentifier(a1, name)];
			};
			GithubStore.prototype.setActiveRepository = function ( a1, name ) {
				var rid = this._getRepositoryIdentifier( a1, name );
				if( !this.hasRepository(rid) ) {
					throw MinErr('badargs',
						'Repository "' + rid + '" does not exist in the store.');
				}

				this._active = rid;
			};
			GithubStore.prototype.getActiveRepository = function () {
				return this._repositories[this._active];
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
								tag = ~repo.milestones.tags.indexOf(tag) ?
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


			// Create empty milestone groups.
			// This will be added to every repository added to the store.
			function createGroups ( tags ) {
				var groups = {};
				forEach( tags, function ( name ) {
					groups[name] = [];
				});
				return groups;
			}


			// Exports
			return new GithubStore();
		}
	}



})();
