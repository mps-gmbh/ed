// Provider
// -------------------------
describe('[github/store/provider]', function () {
	var GithubStoreProvider;

	beforeEach(module('ed.github', function ( _GithubStoreProvider_ ) {
		GithubStoreProvider = _GithubStoreProvider_;
	}));
	beforeEach(inject( function () {}));


	it('should expose a default milestone group', function() {
		expect(GithubStoreProvider.milestone_group_default).toBeDefined();
	});

	it('should have "backlog" as default milestone group', function() {
		expect(GithubStoreProvider.milestone_group_default).toEqual('backlog');
	});

	it('should expose milestone groups', function() {
		expect(GithubStoreProvider.milestone_groups).toBeDefined();
	});

	it('should have "backlog" as milestone group', function() {
		expect(GithubStoreProvider.milestone_groups).toEqual(['backlog']);
	});

	it('should expose a refresh timer', function() {
		expect(GithubStoreProvider.refresh_timer).toBeDefined();
	});

	it('should have 10 minutes as default refresh timer', function() {
		expect(GithubStoreProvider.refresh_timer).toEqual(600000);
	});
});


// Service
// -------------------------
describe('[github/store/service]', function() {
	var $rootScope, $httpBackend,
		GithubStore,
		GithubRepository, GithubRepositorySpy,
		GithubFixture,

		milestoneGroups = ['sprint', 'backlog'];

	beforeEach(module('github.fixture'));
	beforeEach(module('ed.github', function ( $provide, GithubStoreProvider ) {
		GithubStoreProvider.milestone_groups = milestoneGroups;

		$provide.decorator( 'GithubRepository', function ( $delegate ) {
			GithubRepository = $delegate;
			return GithubRepositorySpy = jasmine.createSpy('GithubRepository')
				.and.callFake( function (owner, name, token) {
					return new $delegate(owner, name, token);
				});
		});
	}));
	beforeEach(inject( function ( _$rootScope_, _$httpBackend_, _GithubStore_, _GithubFixture_ ) {
		$rootScope = _$rootScope_;
		$httpBackend = _$httpBackend_;
		GithubStore = _GithubStore_;

		GithubFixture = _GithubFixture_;
	}));


	it('should be a service', function() {
		expect(GithubStore).toEqual(jasmine.any(Object));
	});

	// Utils
	// -------------------------
	describe('Utils', function () {
		it('should have a method to get repo identifier', function() {
			expect(GithubStore._getRepositoryIdentifier).toEqual(jasmine.any(Function));
		});

		it('should be possible to get a repo identifier', function() {
			expect(GithubStore._getRepositoryIdentifier('mps-gmbh', 'ed')).toEqual('mps-gmbh/ed');
			expect(GithubStore._getRepositoryIdentifier('mps-gmbh/ed')).toEqual('mps-gmbh/ed');
		});

		it('should have a method to test if something is too old', function() {
			expect(GithubStore._isTooOld).toEqual(jasmine.any(Function));
		});

		it('should be possible to test if something is too old', function() {
			expect(GithubStore._isTooOld(null)).toBeTruthy();
			expect(GithubStore._isTooOld(new Date(1912, 5, 23))).toBeTruthy();

			expect(GithubStore._isTooOld(new Date())).toBeFalsy();
			expect(GithubStore._isTooOld(
				new Date((new Date()).getTime() - GithubStore.refresh_timer + 1000)
			)).toBeFalsy();
		});
	});


	// Repository
	// -------------------------
	describe('Repository', function () {
		// Add
		// -------------------------
		describe('Add', function () {
			it('should expose a method to add a repo', function() {
				expect(GithubStore.addRepository).toEqual(jasmine.any(Function));
			});

			it('should return the identifier for the repo', function() {
				var rid = GithubStore.addRepository('mps-gmbh', 'ed');
				expect(rid).toEqual('mps-gmbh/ed');
			});

			it('should be possible to add a repo', function() {
				var rid = GithubStore.addRepository('mps-gmbh', 'ed');
				expect(GithubStore._repositories[rid]).toBeDefined();
			});

			it('should create a new `GithubRepository`', function() {
				var rid = GithubStore.addRepository('mps-gmbh', 'ed', '2345678');
				expect(GithubRepositorySpy).toHaveBeenCalledWith('mps-gmbh', 'ed', '2345678');
				expect(GithubStore._repositories[rid].instance instanceof GithubRepository).toBeTruthy();
			});

			it('should create properties for milestones and groups', function() {
				var rid = GithubStore.addRepository('mps-gmbh', 'ed', '2345678'),
					repo = GithubStore._repositories[rid];

				expect(repo.milestones).toEqual(jasmine.any(Object));
				expect(repo.milestones.all).toEqual([]);
				expect(repo.milestones.group).toEqual(jasmine.any(Object));

				expect(repo.milestones.group.sprint).toEqual(jasmine.any(Array));
				expect(repo.milestones.group.backlog).toEqual(jasmine.any(Array));
			});

			it('should throw an error if repo with an existing identifier is added', function() {
				GithubStore.addRepository('mps-gmbh', 'ed');
				expect(function () {
					GithubStore.addRepository('mps-gmbh', 'ed');
				}).toThrow();
			});
		});


		// Remove
		// -------------------------
		describe('Remove', function () {
			it('should expose a method to remove a repo', function() {
				expect(GithubStore.removeRepository).toEqual(jasmine.any(Function));
			});

			it('should be possible to remove a repo', function() {
				var rid = GithubStore.addRepository('mps-gmbh', 'ed');
				GithubStore.removeRepository(rid);
				expect(GithubStore.hasRepository(rid)).toBeFalsy();
			});
		});


		// Has Repository
		// -------------------------
		describe('Has Repository', function () {
			it('should expose a method to check if repo is already stored', function() {
				expect(GithubStore.hasRepository).toEqual(jasmine.any(Function));
			});

			it('should return "true" if repo exists', function() {
				GithubStore.addRepository('mps-gmbh', 'ed');
				expect(GithubStore.hasRepository('mps-gmbh', 'ed')).toEqual(true);
			});

			it('should return "false" if the repo doesn\'t exist', function() {
				expect(GithubStore.hasRepository('not/stored')).toEqual(false);
				expect(GithubStore.hasRepository('not', 'stored')).toEqual(false);
			});
		});
	});


	// Milestones
	// -------------------------
	describe('Milestones', function () {
		var msResponse,
			rid;

		beforeEach(function() {
			rid = GithubStore.addRepository('mps-gmbh', 'ed');
			msResponse = [{
				title: 'Milestone #1',
				number: 1
			}];

			// Spies
			spyOn( GithubStore._repositories[rid].instance, 'getMilestones' )
				.and.callThrough();

			// Server
			$httpBackend.whenGET(/milestones\?per_page=\d*$/).respond(GithubFixture.milestones);
			$httpBackend.whenGET(/issues\?/)
				.respond(function ( method, url ) {
					var number = url.match(/milestone=(\d+)/)[1],
						state = url.match(/state=(\w+)/)[1];
					return [ 200, GithubFixture.issues[number].filter(function ( issue ) {
						return state === 'all' || state === issue.state;
					})];
				});
			$httpBackend.whenGET('http://www.mcfly.io/pull/42').respond({});
		});

		it('should expose a method to get a repo\'s milestones', function() {
			expect(GithubStore.getMilestones).toEqual(jasmine.any(Function));
		});

		it('should be possible to get a repo\s milestones (remote)', function() {
			var milestones;
			GithubStore.getMilestones(rid).then( function ( ms ) {
				milestones = ms;
			});
			$httpBackend.flush();

			expect(GithubStore._repositories[rid].instance.getMilestones).toHaveBeenCalled();
			milestones.forEach(function ( milestone ) {
				expect(milestone.issues.length).toBeGreaterThan(0);
			});

			// Internal storage
			expect(GithubStore._repositories[rid].milestones.all.length).toBeGreaterThan(0);
			expect(GithubStore._repositories[rid].milestones.group.sprint.length).toBeGreaterThan(0);
			expect(GithubStore._repositories[rid].milestones.group.backlog.length).toBeGreaterThan(0);
		});

		it('should be possible to get a repo\s milestones (cache)', function() {
			var milestones;
			GithubStore.getMilestones(rid);
			$httpBackend.flush();

			GithubStore.getMilestones(rid).then( function ( ms ) {
				milestones = ms;
			});
			$rootScope.$digest();

			expect(milestones).toEqual(GithubStore._repositories[rid].milestones.all);
			expect(GithubStore._repositories[rid].instance.getMilestones.calls.count()).toEqual(1);
		});

		it('should re-frecht data if it is too old', function() {
			GithubStore.getMilestones(rid);
			$httpBackend.flush();

			// Make it oooold.
			GithubStore._repositories[rid].updated_at = new Date(1917, 4, 5);

			GithubStore.getMilestones(rid);
			$httpBackend.flush();

			expect(GithubStore._repositories[rid].instance.getMilestones.calls.count()).toEqual(2);
		});

		it('should set `updated_at` whenever it fetched data from remote', function() {
			expect(GithubStore._repositories[rid].updated_at).toBeUndefined();

			GithubStore.getMilestones(rid);
			$httpBackend.flush();

			expect(GithubStore._repositories[rid].updated_at).toEqual(jasmine.any(Date));
		});

		it('should be possible to get grouped milestones', function() {
			var milestones;
			GithubStore.getMilestones(rid, true).then( function ( ms ) {
				milestones = ms;
			});
			$httpBackend.flush();
			expect(milestones).toEqual(GithubStore._repositories[rid].milestones.group);

			GithubStore.getMilestones(rid, true).then( function ( ms ) {
				milestones = ms;
			});
			$rootScope.$digest();
			expect(milestones).toEqual(GithubStore._repositories[rid].milestones.group);
		});

		it('should throw an error if repo does not exist', function() {
			expect(function () {
				GithubStore.getMilestones('not/there');
			}).toThrow();
		});

		it('should throw an error if called without args', function() {
			expect(function () {
				GithubStore.getMilestones();
			}).toThrow();
		});
	});

});
