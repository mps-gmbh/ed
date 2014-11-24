describe('[dashboard/controller]', function () {
	var $controller, $httpBackend, GithubService, GithubFixture,
		FakeGithubService, gs, params,

		ghConfig = {
			owner: 'mps-gmbh',
			repo: 'ed'
		},
		milestonesGroups = ['sprint', 'refactor'];

	beforeEach(module('github.fixture'));

	beforeEach(module('ed.github.service'));
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
	beforeEach( inject( function ( _$controller_, _$httpBackend_, _GithubService_ , _GithubFixture_ ) {
		$controller = _$controller_;
		$httpBackend = _$httpBackend_;

		GithubFixture = _GithubFixture_;

		GithubService = _GithubService_;
		FakeGithubService = jasmine.createSpy('GithubService').and.callFake( function ( o, r, t ) {
			gs = new GithubService(o, r, t);
			spyOn(gs, 'getMilestones').and.callThrough();
			return gs;
		});

		params = {
			$attrs: {
				config: 'MOCK_CONFIG'
			},
			GithubService: GithubService
		};
	}));


	// Initialization
	// -------------------------
	describe('Initialization', function () {
		it('should be defined', function () {
			expect($controller('DashboardController', params)).toBeDefined();
		});

		it('should throw if config is missing', function () {
			delete params.$attrs.config;
			expect(function () {$controller('DashboardController', params);}).toThrow();
		});

		it('should throw if config for "owner" is missing', function () {
			params.$attrs.config = 'MOCK_CONFIG_EMPTY';
			expect(function () {$controller('DashboardController', params);}).toThrow();

			params.$attrs.config = 'MOCK_CONFIG_REPO';
			expect(function () {$controller('DashboardController', params);}).toThrow();
		});

		it('should throw if config for "repo" is missing', function () {
			params.$attrs.config = 'MOCK_CONFIG_EMPTY';
			expect(function () {$controller('DashboardController', params);}).toThrow();

			params.$attrs.config = 'MOCK_CONFIG_OWNER';
			expect(function () {$controller('DashboardController', params);}).toThrow();
		});


		// Github Service
		// -------------------------
		describe('Github Service', function () {
			var controller;

			beforeEach(function () {
				params.GithubService = FakeGithubService;
			});

			it('should init GithubService with passed config', function () {
				controller = $controller('DashboardController', params);
				expect(params.GithubService).toHaveBeenCalledWith( ghConfig.owner, ghConfig.repo, undefined );
			});

			it('should init GithubService with token', function () {
				ghConfig.token = '1234567890';
				controller = $controller('DashboardController', params);
				expect(params.GithubService).toHaveBeenCalledWith( ghConfig.owner, ghConfig.repo, '1234567890' );
			});
		});


		// Fetch Milestones
		// -------------------------
		describe('Fetch Milestones', function () {
			var controller;

			beforeEach(function () {
				params.GithubService = FakeGithubService;
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
				expect(controller.isLoading).toBeTruthy();
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
				params.GithubService = FakeGithubService;
				params.$attrs.config = 'MOCK_CONFIG_GROUPS';
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

			it('should put milestones in group "milestones" per default', function() {
				params.$attrs.config = 'MOCK_CONFIG';
				controller = $controller('DashboardController', params);
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
				params.$attrs.config = 'MOCK_CONFIG_GROUPS_W_DEFAULT';
				controller = $controller('DashboardController', params);
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
