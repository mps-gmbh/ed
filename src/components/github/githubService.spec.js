// Provider
// -------------------------
describe('[github/service]', function () {
	var $injector, $http, $q, $httpBackend, githubProvider, github;

	beforeEach( module('ed.github.service', function ( _githubServiceProvider_ ) {
		githubProvider = _githubServiceProvider_;
	}));
	beforeEach(inject( function ( _$injector_, _$http_, _$q_, _$httpBackend_ ) {
		$injector = _$injector_;
		$http = _$http_;
		$q = _$q_;
		$httpBackend = _$httpBackend_;
	}));


	// Configuration
	// -------------------------
	describe('Configuration', function () {
		it('should be exposed during configuration', function () {
			expect(githubProvider).toBeDefined();
		});

		// Owner
		it('should a exepose "owner" getter/setter', function () {
			expect(githubProvider.owner).toEqual( jasmine.any(Function) );
		});

		it('should be possible to set/get the "owner"', function () {
			githubProvider.owner('mps-gmbh');
			expect(githubProvider.owner()).toEqual('mps-gmbh');
		});

		// Repository
		it('should expose a "repository" getter/setter', function () {
			expect(githubProvider.repo).toEqual( jasmine.any(Function) );
		});

		it('should be possible to set/get the "repository"', function () {
			githubProvider.repo('ed');
			expect(githubProvider.repo()).toEqual('ed');
		});

		// Token
		it('should have no default "token"', function () {
			expect(githubProvider.token).toEqual( jasmine.any(Function) );
		});

		it('should be possible to set/get the "token"', function () {
			githubProvider.token('AzAa!1253§$a%&#gH');
			expect(githubProvider.token()).toEqual('AzAa!1253§$a%&#gH');
		});
	});


	// Missing Configuration
	// -------------------------
	describe('Missing Configuration', function () {
		it('should throw an error if no "owner" and "repo" are specified', function () {
			expect(function () { $injector.get('githubService'); }).toThrow();
		});

		it('should throw an error if no "owner" is specified', function () {
			githubProvider.repo('foo');
			expect(function () { $injector.get('githubService'); }).toThrow();
		});

		it('should throw an error if no "repo" is specified', function () {
			githubProvider.owner('mom');
			expect(function () { $injector.get('githubService'); }).toThrow();
		});

		it('should not throw is "owner" and "repo" is specified', function () {
			githubProvider.repo('foo');
			githubProvider.owner('mom');
			expect(function () { $injector.get('githubService'); }).not.toThrow();
		});
	});

	// Service
	// -------------------------
	describe('Service', function () {
		var milestonesResponse,
			issuesResponse;

		beforeEach(function() {
			githubProvider.owner('mps-gmbh');
			githubProvider.repo('ed');

			github = $injector.get('githubService');

			// Reponse Data
			milestonesResponse = [{
				title: 'Milestone 1',
				number: 1
			}, {
				title: 'Milestone 11',
				number: 11
			}];
			issuesResponse = {
				'1': [{
					title: 'I want this to be implemented! Yesterday!',
					number: 55,
					state: 'open'
				}, {
					title: 'Yet another feature request',
					number: 1234,
					state: 'closed'
				}],
				'11': [{
					title: 'I found a bug',
					number: 55,
					state: 'open',
					pull_request: { url: 'https://api.github.com/repos/octocat/Hello-World/pulls/1347' }
				}, {
					title: 'Make button "cornflower blue" instead of "deep sky blue"',
					number: 1234,
					state: 'open'
				}]
			};

			// Mock server
			$httpBackend.whenGET(new RegExp(
				'/repos/' + githubProvider.owner() + '/' + githubProvider.repo() + '/issues'
			)).respond(function ( method, url ) {
				var number = url.match(/milestone=(\d+)/)[1],
					state = url.match(/state=(\w+)/)[1];
				return [ 200, issuesResponse[number].filter(function ( issue ) {
					return state === 'all' || state === issue.state;
				})];
			});
			$httpBackend.whenGET(new RegExp(
				'/repos/' + githubProvider.owner() + '/' + githubProvider.repo() + '/milestones$'
			)).respond(milestonesResponse);
			$httpBackend.whenGET(new RegExp(
				'/repos/' + githubProvider.owner() + '/' + githubProvider.repo() + '/milestones/\\d+$'
			)).respond(function ( method, url ) {
				var number = parseFloat(url.match(/(\d+)$/)[1]),
					ms = milestonesResponse.filter( function ( m ) {
						return m.number === number;
					})[0];
				return [ 200, ms ];
			});
		});

		it('should be defined', function () {
			expect(github).toBeDefined();
		});


		// Milestone Issues
		// -------------------------
		describe('Milestone Issues', function () {
			beforeEach(function() {
				spyOn($http, 'get').and.callThrough();
			});

			it('should expose a method to get issues for a certain milestone', function () {
				expect(github.getIssuesForMilestone).toEqual( jasmine.any(Function) );
			});

			it('should call Github\'s issue API with milestone and state as param', function () {
				github.getIssuesForMilestone( milestonesResponse[0] );
				$httpBackend.flush();

				expect($http.get).toHaveBeenCalledWith( jasmine.any(String), {
					params: {
						milestone: milestonesResponse[0].number,
						state: 'all'
					},
					method: 'get',
					url: jasmine.any(String)
				});

				github.getIssuesForMilestone( milestonesResponse[0], 'closed' );
				$httpBackend.flush();

				expect($http.get).toHaveBeenCalledWith( jasmine.any(String), {
					params: {
						milestone: milestonesResponse[0].number,
						state: 'closed'
					},
					method: 'get',
					url: jasmine.any(String)
				});
			});

			it('should be possible to get issues for a milestone (default)', function () {
				var milestone = angular.copy(milestonesResponse[0]),
					issues;
				github.getIssuesForMilestone( milestone ).then( function ( m ) {
					issues = m.issues;
				});
				$httpBackend.flush();
				expect(issues).toEqual(issuesResponse[milestone.number]);
			});

			it('should be possible to get issues for a milestone (state="all")', function () {
				var milestone = angular.copy(milestonesResponse[0]),
					issues;
				github.getIssuesForMilestone( milestone, 'all' ).then( function ( m ) {
					issues = m.issues;
				});
				$httpBackend.flush();
				expect(issues).toEqual(issuesResponse[milestone.number]);
			});

			it('should be possible to get all open issues for a milestone (state="open")', function () {
				var milestone = angular.copy(milestonesResponse[0]),
					issues;
				github.getIssuesForMilestone( milestone, 'open' ).then( function ( m ) {
					issues = m.issues;
				});
				$httpBackend.flush();
				expect(issues.length).toEqual(1);
				expect(issues).toEqual(issuesResponse[milestone.number].filter(function ( item ) {
					return item.state === 'open';
				}));
			});

			it('should be possible to get all closed issues for a milestone (state="closed")', function () {
				var milestone = angular.copy(milestonesResponse[0]),
					issues;
				github.getIssuesForMilestone( milestone, 'closed' ).then( function ( m ) {
					issues = m.issues;
				});
				$httpBackend.flush();
				expect(issues.length).toEqual(1);
				expect(issues).toEqual(issuesResponse[milestone.number].filter(function ( item ) {
					return item.state === 'closed';
				}));
			});

			it('should set PRs', function () {
				var milestone = angular.copy(milestonesResponse[1]),
					pr;
				github.getIssuesForMilestone( milestone ).then( function ( m ) {
					pr = m.pull_requests;
				});
				$httpBackend.flush();
				expect(pr.length).toEqual(1);

				milestone = angular.copy(milestonesResponse[0]);
				github.getIssuesForMilestone( milestone ).then( function ( m ) {
					pr = m.pull_requests;
				});
				$httpBackend.flush();
				expect(pr.length).toEqual(0);
			});
		});


		// Milestones
		// -------------------------
		describe('Milestones', function () {
			beforeEach(function() {
				spyOn($http, 'get').and.callThrough();
			});

			it('should expose a method to get milestones', function () {
				expect(github.getMilestones).toEqual( jasmine.any(Function) );
			});

			it('should call Github\'s milestone API', function () {
				github.getMilestones();
				$httpBackend.flush();
				expect($http.get).toHaveBeenCalledWith( jasmine.any(String), jasmine.any(Object) );
			});

			it('should be possible to fetch milestones', function () {
				var milestones;
				github.getMilestones().then( function ( m ) {
					milestones = m;
				});
				$httpBackend.flush();
				expect(milestones.name).toEqual(milestonesResponse.name);
				expect(milestones.number).toEqual(milestonesResponse.number);
			});

			it('shoud fetch milestone\'s issues', function () {
				var milestones;
				github.getMilestones().then( function ( m ) {
					milestones = m;
				});
				$httpBackend.flush();
				milestones.forEach( function ( m ) {
					expect(m.issues).toEqual(issuesResponse[m.number]);
				});
			});

			it('shoud fetch milestone\'s PRs', function () {
				var milestones;
				github.getMilestones().then( function ( m ) {
					milestones = m;
				});
				$httpBackend.flush();
				milestones.forEach( function ( m ) {
					expect(m.pull_requests).toEqual(issuesResponse[m.number].filter( function ( i ) {
						return i.pull_request;
					}));
				});
			});
		});


		// Get single Milestone
		// -------------------------
		describe('Get single Milestone', function () {
			beforeEach(function() {
				spyOn($http, 'get').and.callThrough();
			});

			it('should expose a method to get milestones', function () {
				expect(github.getMilestone).toEqual( jasmine.any(Function) );
			});

			it('should call Github\'s milestone API', function () {
				github.getMilestone( 1 );
				$httpBackend.flush();
				expect($http.get).toHaveBeenCalledWith( jasmine.any(String), jasmine.any(Object) );
			});

			it('should be possible to fetch a single milestone', function () {
				var milestone;
				github.getMilestone( 1 ).then( function ( m ) {
					milestone = m;
				});
				$httpBackend.flush();
				expect(milestone.number).toEqual(milestonesResponse[0].number);
				expect(milestone.title).toEqual(milestonesResponse[0].title);
			});

			it('should append related issues to milestone', function () {
				var milestone;
				github.getMilestone( 11 ).then( function ( m ) {
					milestone = m;
				});
				$httpBackend.flush();
				expect(milestone.issues).toEqual(issuesResponse[milestone.number]);
				expect(milestone.pull_requests).toEqual(issuesResponse[milestone.number].filter( function ( item ) {
					return item.pull_request;
				}));
			});
		});
	});


	// OAuth
	// -------------------------
	describe('OAuth', function () {
		var headers;

		beforeEach(function() {
			$httpBackend.whenGET(/.*/).respond(function () {
				headers = arguments[3];
				return [ 200, {}];
			});
		});

		// (None)
		// -------------------------
		describe('(None)', function () {
			beforeEach(function() {
				githubProvider.owner('mps-gmbh');
				githubProvider.repo('ed');

				github = $injector.get('githubService');
			});

			it('should not send any "Authorization" header if no token is set', function () {
				github.getMilestones();
				$httpBackend.flush();
				expect(headers.Authorization).toBeUndefined();

				github.getMilestone(1);
				$httpBackend.flush();
				expect(headers.Authorization).toBeUndefined();

				github.getIssuesForMilestone({ number: 1 });
				$httpBackend.flush();
				expect(headers.Authorization).toBeUndefined();
			});
		});

		// (With)
		// -------------------------
		describe('(With)', function () {
			beforeEach(function() {
				githubProvider.owner('mps-gmbh');
				githubProvider.repo('ed');
				githubProvider.token('123456789');

				github = $injector.get('githubService');
			});

			it('should send "Authorization" header if token is set', function () {
				github.getMilestones();
				$httpBackend.flush();
				expect(headers.Authorization).toMatch('123456789');

				github.getMilestone(1);
				$httpBackend.flush();
				expect(headers.Authorization).toMatch('123456789');

				github.getIssuesForMilestone({ number: 1 });
				$httpBackend.flush();
				expect(headers.Authorization).toMatch('123456789');
			});
		});

	});
});
