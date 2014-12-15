describe('[dashboard/controller]', function () {
	var $controller, $httpBackend, GithubRepository, GithubFixture,
		$injector, tagFilter,
		FakeGithubRepository, gs, params,

		ghConfig = {
			owner: 'mps-gmbh',
			repo: 'ed'
		},
		milestonesGroups = ['sprint', 'refactor'];

	beforeEach(module('github.fixture'));
	beforeEach(module('ed.github'));
	beforeEach(module('ed.string'));
	beforeEach(module('ed.dashboard'));
	beforeEach(module('ed.dashboard', function ( $provide ) {
		$provide.value('MOCK_CONFIG', ghConfig);
		$provide.value('MOCK_CONFIG_EMPTY', {});
		$provide.value('MOCK_CONFIG_OWNER', { owner: 'foo' });
		$provide.value('MOCK_CONFIG_REPO', { repo: 'foo' });

		$provide.value('MOCK_CONFIG_GROUPS', angular.extend( angular.copy(ghConfig), {
			milestone_groups: milestonesGroups
		}));
		$provide.value('MOCK_CONFIG_GROUPS_W_DEFAULT', angular.extend( angular.copy(ghConfig), {
			milestone_groups: milestonesGroups
		}, {
			milestones_groups_default: 'fallback'
		}));
	}));
	beforeEach( inject( function ( _$controller_, _$httpBackend_, _$injector_, _tagFilter_, _GithubRepository_, _GithubFixture_ ) {
		var $ctrl = _$controller_;
		$httpBackend = _$httpBackend_;
		$injector = _$injector_;
		tagFilter = _tagFilter_;

		GithubFixture = _GithubFixture_;

		GithubRepository = _GithubRepository_;
		FakeGithubRepository = jasmine.createSpy('GithubRepository').and.callFake( function ( o, r, t ) {
			gs = new GithubRepository(o, r, t);
			spyOn(gs, 'getMilestones').and.callThrough();
			return gs;
		});

		params = {
			GithubRepository: GithubRepository,
			$injector: $injector,
			tagFilter: tagFilter
		};

		// http://stackoverflow.com/questions/25837774/bindtocontroller-in-unit-tests#answer-26187076
		$controller = function ( name, params, config ) {
			var ctrlConstructor = $ctrl(name, params, true);
			ctrlConstructor.instance.config = config === undefined ? 'MOCK_CONFIG' : config;
			return ctrlConstructor();
		};
	}));


	// Initialization
	// -------------------------
	describe('Initialization', function () {
		it('should be defined', function () {
			expect($controller('DashboardController', params)).toBeDefined();
		});

		it('should throw if config is missing', function () {
			expect(function () {$controller('DashboardController', params, null);}).toThrow();
		});

		it('should throw if config for "owner" is missing', function () {
			expect(function () {$controller('DashboardController', params, 'MOCK_CONFIG_EMPTY');}).toThrow();
			expect(function () {$controller('DashboardController', params, 'MOCK_CONFIG_REPO');}).toThrow();
		});

		it('should throw if config for "repo" is missing', function () {
			expect(function () {$controller('DashboardController', params, 'MOCK_CONFIG_EMPTY');}).toThrow();
			expect(function () {$controller('DashboardController', params, 'MOCK_CONFIG_OWNER');}).toThrow();
		});


		// Github Service
		// -------------------------
		describe('Github Service', function () {
			var controller;

			beforeEach(function () {
				params.GithubRepository = FakeGithubRepository;
			});

			it('should init GithubRepository with passed config', function () {
				controller = $controller('DashboardController', params);
				expect(params.GithubRepository).toHaveBeenCalledWith( ghConfig.owner, ghConfig.repo, undefined );
			});

			it('should init GithubRepository with token', function () {
				ghConfig.token = '1234567890';
				controller = $controller('DashboardController', params);
				expect(params.GithubRepository).toHaveBeenCalledWith( ghConfig.owner, ghConfig.repo, '1234567890' );
			});
		});


		// Fetch Milestones
		// -------------------------
		describe('Fetch Milestones', function () {
			var controller;

			beforeEach(function () {
				params.GithubRepository = FakeGithubRepository;
				controller = $controller('DashboardController', params);

				$httpBackend.whenGET(/milestones$/).respond(GithubFixture.milestones);
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

			it('should inidcate that it is loading', function () {
				expect(controller.repository.isLoadingMilestones).toBeTruthy();
			});

			it('should init empty milestones', function () {
				expect(controller.groups).toEqual([]);
			});

			it('should fetch milestones from remote', function () {
				expect(gs.getMilestones).toHaveBeenCalledWith();
			});

			it('should expose fetched milestones', function () {
				$httpBackend.flush();
				controller.groups[0].milestones.forEach(function ( milestone ) {
					expect(GithubFixture.milestones.some(function ( m ) {
						return milestone.number === m.number && milestone.title === m.title;
					})).toBeTruthy();
					expect(milestone.issues).toEqual(GithubFixture.issues[milestone.number]);
					expect(milestone.pull_requests).toEqual(GithubFixture.issues[milestone.number].filter( function ( i ) {
						return i.pull_request;
					}));
				});
			});

			it('should indicate that loading has finished', function () {
				$httpBackend.flush();
				expect(controller.isLoading).toBeFalsy();
			});
		});


		// Group Milestones
		// -------------------------
		describe('Group Milestones', function () {
			var controller;

			function hasMilestone ( a, m ) {
				return a.some( function ( item ) {
					return item.title === m.title && item.number === m.number;
				});
			}

			beforeEach(function () {
				params.GithubRepository = FakeGithubRepository;
				controller = $controller('DashboardController', params, 'MOCK_CONFIG_GROUPS');

				$httpBackend.whenGET(/milestones$/).respond(GithubFixture.milestones);
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

			it('should put milestones in group "milestones" per default', function() {
				controller = $controller('DashboardController', params, 'MOCK_CONFIG');
				$httpBackend.flush();

				expect(controller.groups[0].milestones).toBeDefined();
				expect(controller.groups[0].milestones).toEqual( jasmine.any(Array) );
			});

			it('should create a default milestone group "backlog" if none specified', function() {
				$httpBackend.flush();
				expect(controller.groups[controller.groups.length-1].name).toEqual('backlog');
				expect(controller.groups[controller.groups.length-1].milestones).toEqual( jasmine.any(Array) );
				expect(controller.groups[controller.groups.length-1].milestones.length).toBeGreaterThan( 0 );
			});

			it('should be possible to create a default milestone group', function() {
				controller = $controller('DashboardController', params, 'MOCK_CONFIG_GROUPS_W_DEFAULT');
				$httpBackend.flush();

				expect(controller.groups[controller.groups.length-1].name).toEqual('fallback');
				expect(controller.groups[controller.groups.length-1].milestones).toEqual( jasmine.any(Array) );
			});

			it('should create groups', function () {
				$httpBackend.flush();
				milestonesGroups.forEach( function ( name ) {
					expect(controller.groups.some( function ( group ) {
						return group.name === name;
					})).toBeTruthy();
				});
			});

			it('should be possible to group milestones', function () {
				$httpBackend.flush();
				GithubFixture.milestones.forEach( function ( m ) {
					if( /^\[sprint/i.test(m.title) ) {
						expect(hasMilestone( controller.groups[0].milestones, m )).toBeTruthy();
					} else if( /^\[sprint/i.test(m.title) ) {
						expect(controller.groups[1].milestones.length).toEqual(0);
					} else {
						expect(hasMilestone( controller.groups[2].milestones, m )).toBeTruthy();
					}
				});
			});
		});
	});
});
