describe('[github/service]', function () {
	var $http, $q, $httpBackend, GithubServiceProvider, GithubService;

	beforeEach( module('ed.github.service', function ( _GithubServiceProvider_ ) {
		GithubServiceProvider = _GithubServiceProvider_;
	}));
	beforeEach(inject( function ( _$http_, _$q_, _$httpBackend_, _GithubService_ ) {
		GithubService = _GithubService_;
		$http = _$http_;
		$q = _$q_;
		$httpBackend = _$httpBackend_;
	}));


	// Configuration
	// -------------------------
	describe('Configuration', function () {
		it('should be exposed during configuration', function () {
			expect(GithubServiceProvider).toBeDefined();
		});

		it('should have a default "API_URL"', function () {
			expect(GithubServiceProvider.API_URL).toEqual( jasmine.any(String) );
		});

		it('should be possible to set the "API_URL"', function () {
			GithubServiceProvider.API_URL = 'https://example.com';
			expect(GithubServiceProvider.API_URL).toEqual('https://example.com');
		});

		it('should have a default "API_PREFIX_MILESTONES"', function () {
			expect(GithubServiceProvider.API_PREFIX_MILESTONES).toEqual( jasmine.any(String) );
		});

		it('should be possible to set the "API_PREFIX_MILESTONES"', function () {
			GithubServiceProvider.API_PREFIX_MILESTONES = 'https://example.com';
			expect(GithubServiceProvider.API_PREFIX_MILESTONES).toEqual('https://example.com');
		});

		it('should have a default "API_PREFIX_ISSUES"', function () {
			expect(GithubServiceProvider.API_PREFIX_ISSUES).toEqual( jasmine.any(String) );
		});

		it('should be possible to set the "API_PREFIX_ISSUES"', function () {
			GithubServiceProvider.API_PREFIX_ISSUES = 'https://example.com';
			expect(GithubServiceProvider.API_PREFIX_ISSUES).toEqual('https://example.com');
		});
	});


	// Factory
	// -------------------------
	describe('Factory', function () {
		it('should be a factory', function() {
			expect(GithubService).toEqual(jasmine.any(Function));
		});

		it('should throw an error if no "owner" and "repo" are specified', function () {
			expect(function () { new GithubService(); }).toThrow();
		});

		it('should throw an error if no "owner" is specified', function () {
			expect(function () { new GithubService('foo') ;}).toThrow();
		});

		it('should throw an error if no "repo" is specified', function () {
			expect(function () { new GithubService(null, 'mom'); }).toThrow();
		});

		it('should not throw is "owner" and "repo" is specified', function () {
			expect(function () { new GithubService('foo', 'mom'); }).not.toThrow();
		});
	});


	// Service
	// -------------------------
	describe('Service', function () {
		var owner = 'mps-gmbh',
			repo = 'ed',
			prURL = 'https://api.github.com/repos/mps-gmbh/ed/pulls/1',
			milestonesResponse,
			issuesResponse,
			prResponse,
			github;

		beforeEach(function() {
			github = new GithubService(owner, repo);

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
					pull_request: { url: prURL }
				}, {
					title: 'Make button "cornflower blue" instead of "deep sky blue"',
					number: 1234,
					state: 'open'
				}]
			};
			prResponse = {
				merged: false,
				someOtherData: 'that-should-be-merged'
			};

			// Mock server
			$httpBackend.whenGET(new RegExp('/repos/' + owner + '/' + repo + '/issues'))
				.respond(function ( method, url ) {
					var number = url.match(/milestone=(\d+)/)[1],
						state = url.match(/state=(\w+)/)[1];
					return [ 200, issuesResponse[number].filter(function ( issue ) {
						return state === 'all' || state === issue.state;
					})];
				});
			$httpBackend.whenGET(new RegExp('/repos/' + owner + '/' + repo + '/milestones$'))
				.respond(milestonesResponse);
			$httpBackend.whenGET(new RegExp('/repos/' + owner + '/' + repo + '/milestones/\\d+$'))
				.respond(function ( method, url ) {
					var number = parseFloat(url.match(/(\d+)$/)[1]),
						ms = milestonesResponse.filter( function ( m ) {
							return m.number === number;
						})[0];
					return [ 200, ms ];
				});
			$httpBackend.whenGET(prURL)
				.respond(prResponse);
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

			it('shoud fetch milestone\'s issues (includes PRs!)', function () {
				var milestones;
				github.getMilestones().then( function ( m ) {
					milestones = m;
				});
				$httpBackend.flush();
				milestones.forEach( function ( m ) {
					var isusResponse = issuesResponse[m.number].map(function ( isu ) {
							if( isu.pull_request ){
								angular.extend(isu, prResponse);
							}
							return isu;
						});
					expect(m.issues).toEqual(isusResponse);
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
						angular.extend(i, prResponse);
						return i.pull_request;
					}));
				});
			});

			it('should merge PRs with additional data', function() {
				var milestones;
				github.getMilestones().then( function ( m ) {
					milestones = m;
				});
				$httpBackend.flush();
				milestones.forEach( function ( m ) {
					var plainIssue = issuesResponse[m.number].filter( function ( i ) {
						return i.pull_request;
					})[0];
					m.pull_requests.forEach( function ( pr ) {
						expect(pr).not.toEqual(plainIssue);
						expect(pr).toEqual(angular.extend(plainIssue, prResponse));
					});
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

			it('should append related issues and PRs to milestone', function () {
				var milestone,
					isusResponse;
				github.getMilestone( 11 ).then( function ( m ) {
					milestone = m;
				});
				$httpBackend.flush();

				isusResponse = issuesResponse[milestone.number].map(function ( isu ) {
					if( isu.pull_request ){
						angular.extend(isu, prResponse);
					}
					return isu;
				});

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
		var owner = 'mps-gmbh',
			repo = 'ed',
			github,
			headers;

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
				github = new GithubService(owner, repo);
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
				github = new GithubService(owner, repo, 123456789);
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
