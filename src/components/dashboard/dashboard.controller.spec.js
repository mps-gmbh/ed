describe('[dashboard/controller]', function () {
	var $controller, $httpBackend, GithubRepository, GithubFixture,
		$injector, $document, $interval, $rootScope, tagFilter,
		FakeGithubRepository, gs, params,
		intervalFn, intervalTimer,

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
	beforeEach( inject( function ( _$controller_, _$httpBackend_, _$injector_, _$document_, _tagFilter_, _GithubRepository_, _GithubFixture_ ) {
		var $ctrl = _$controller_;
		$httpBackend = _$httpBackend_;
		$injector = _$injector_;
		$document = _$document_;
		tagFilter = _tagFilter_;

		GithubFixture = _GithubFixture_;

		$interval = jasmine.createSpy('$interval').and.callFake( function ( fn, timer ) {
			intervalFn = fn;
			intervalTimer = timer;
		});
		$rootScope = jasmine.createSpyObj('$rootScope', ['$broadcast']);

		GithubRepository = _GithubRepository_;
		FakeGithubRepository = jasmine.createSpy('GithubRepository').and.callFake( function ( o, r, t ) {
			gs = new GithubRepository(o, r, t);
			spyOn(gs, 'getMilestones').and.callThrough();
			return gs;
		});

		params = {
			GithubRepository: GithubRepository,
			$injector: $injector,
			$interval: $interval,
			$rootScope: $rootScope,
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

				// Fake Remote
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

			it('should inidcate that it is loading', function () {
				expect(controller.repository.isLoadingMilestones).toBeTruthy();
			});

			it('should init empty milestones', function () {
				expect(controller.groups).toEqual([]);
			});

			it('should fetch milestones from remote', function () {
				expect(gs.getMilestones).toHaveBeenCalled();
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


			// Automatically refresh Milestones
			// -------------------------
			describe('Automatically refresh Milestones', function () {
				it('should set an interval', function() {
					expect($interval).toHaveBeenCalledWith( jasmine.any(Function), jasmine.any(Number) );
				});

				it('should have 10 minutes as default', function() {
					expect(ghConfig.milestones_refresh_timer).toBeUndefined();
					expect(intervalTimer).toEqual(600000);
				});

				it('should set a flush timer if one is defined inside the config', function() {
					ghConfig.milestones_refresh_timer = 1;
					$controller('DashboardController', params);

					expect(ghConfig.milestones_refresh_timer).toBeDefined();
					expect(intervalTimer).toEqual(60000);
				});

				it('should refresh milestones when the intervall flushes', function() {
					var count;
					$httpBackend.flush();
					count = gs.getMilestones.calls.count();

					intervalFn();
					expect(gs.getMilestones.calls.count()).toEqual( count + 1 );
				});
			});


			// Broadcast Refresh
			// -------------------------
			describe('Broadcast Refresh', function () {
				it('should broadcast event', function() {
					$httpBackend.flush();
					expect($rootScope.$broadcast).toHaveBeenCalledWith(
						'ed:milestones:refreshed',
						controller.repository.name
					);
				});
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


	// Adjust Position
	// -------------------------
	describe('Adjust Position', function () {
		var controller,
			element, anotherElement;

		beforeEach(function () {
			controller = $controller('DashboardController', params);
			element = angular.element('<div></div>');
			anotherElement = angular.element('<span></span>');
			spyOn( $document, 'scrollToElementAnimated' );
		});

		it('should expose a method to adjust position', function() {
			expect(controller.adjustPosition).toEqual( jasmine.any(Function) );
		});

		it('should call `scrollToElementAnimated` if attribute `is-expanded` was added', function() {
			controller.adjustPosition('is-expanded', '', element, 'addedAttribute');
			expect($document.scrollToElementAnimated).toHaveBeenCalledWith( element, 15 );

			controller.adjustPosition('is-foo', '', anotherElement, 'addedAttribute');
			expect($document.scrollToElementAnimated).not.toHaveBeenCalledWith( anotherElement, 15 );

			controller.adjustPosition('is-expanded', '', anotherElement, 'removedAttribute');
			expect($document.scrollToElementAnimated).not.toHaveBeenCalledWith( anotherElement, 15 );
		});
	});
});
