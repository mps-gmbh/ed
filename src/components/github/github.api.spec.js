describe('[github/api]', function () {
	var $http, $httpBackend,
		GithubAPIProvider, GithubAPI;

	beforeEach( module('ed.github', function ( _GithubAPIProvider_ ) {
		GithubAPIProvider = _GithubAPIProvider_;
	}));
	beforeEach( inject( function ( _$http_, _$httpBackend_, _GithubAPI_ ) {
		GithubAPI = _GithubAPI_;
		$http = _$http_;
		$httpBackend = _$httpBackend_;

		spyOn( $http, 'get' ).and.callThrough();
	}));


	// Configuration
	// -------------------------
	describe('Configuration', function () {
		it('should be exposed during configuration', function () {
			expect(GithubAPIProvider).toBeDefined();
		});

		it('should have a default "API_BASE"', function () {
			expect(GithubAPIProvider.BASE).toEqual( jasmine.any(String) );
		});

		it('should be possible to set the "BASE"', function () {
			GithubAPIProvider.BASE = 'https://example.com';
			expect(GithubAPIProvider.BASE).toEqual('https://example.com');
		});

		it('should have a default "LOCATION_REPOS"', function () {
			expect(GithubAPIProvider.LOCATION_REPOS).toEqual( jasmine.any(String) );
		});

		it('should be possible to set the "LOCATION_REPOS"', function () {
			GithubAPIProvider.LOCATION_REPOS = 'rreeppooss';
			expect(GithubAPIProvider.LOCATION_REPOS).toEqual('rreeppooss');
		});

		it('should have a default "PREFIX_MILESTONES"', function () {
			expect(GithubAPIProvider.PREFIX_MILESTONES).toEqual( jasmine.any(String) );
		});

		it('should be possible to set the "PREFIX_MILESTONES"', function () {
			GithubAPIProvider.PREFIX_MILESTONES = 'https://example.com';
			expect(GithubAPIProvider.PREFIX_MILESTONES).toEqual('https://example.com');
		});

		it('should have a default "PREFIX_ISSUES"', function () {
			expect(GithubAPIProvider.PREFIX_ISSUES).toEqual( jasmine.any(String) );
		});

		it('should be possible to set the "PREFIX_ISSUES"', function () {
			GithubAPIProvider.PREFIX_ISSUES = 'https://example.com';
			expect(GithubAPIProvider.PREFIX_ISSUES).toEqual('https://example.com');
		});
	});


	// Service
	// -------------------------
	describe('Service', function () {
		var repo, owner, token,
			url, data, resoponseData;

		beforeEach(function() {
			repo = 'ed';
			owner = 'mps-gmbh';
			token = '123456789009876543';

			url = GithubAPIProvider.BASE + 'repos/' + owner + '/' + repo + '/';
			data = null;
		});

		it('should be a service', function() {
			expect(GithubAPI).toEqual(jasmine.any(Object));
		});


		// Config
		// -------------------------
		describe('Config', function () {
			it('should expose a method to get url base', function() {
				expect(GithubAPI.getUrlBase).toEqual( jasmine.any(Function) );
			});

			it('should be possible to get the config url', function() {
				expect(GithubAPI.getUrlBase()).toEqual(GithubAPIProvider.BASE);
			});

			it('should expose a method to get locations', function() {
				expect(GithubAPI.getLocation).toEqual( jasmine.any(Function) );
			});

			it('should be possible to get prefix for "issues"', function() {
				expect(GithubAPI.getLocation('repos')).toEqual(GithubAPIProvider.LOCATION_REPOS);
				expect(GithubAPI.getLocation('reposs')).toEqual(GithubAPIProvider.LOCATION_REPOS);
			});

			it('should return `null` for undefined locations', function() {
				expect(GithubAPI.getLocation('foo')).toEqual(null);
				expect(GithubAPI.getLocation('meh')).toEqual(null);
			});

			it('should expose a method to get entity prefixes', function() {
				expect(GithubAPI.getPrefix).toEqual( jasmine.any(Function) );
			});

			it('should be possible to get prefix for "issues"', function() {
				expect(GithubAPI.getPrefix('issue')).toEqual(GithubAPIProvider.PREFIX_ISSUES);
				expect(GithubAPI.getPrefix('issues')).toEqual(GithubAPIProvider.PREFIX_ISSUES);
			});

			it('should be possible to get prefix for "milestone"', function() {
				expect(GithubAPI.getPrefix('milestone')).toEqual(GithubAPIProvider.PREFIX_MILESTONES);
				expect(GithubAPI.getPrefix('milestones')).toEqual(GithubAPIProvider.PREFIX_MILESTONES);
			});

			it('should return `null` for undefined prefixes', function() {
				expect(GithubAPI.getPrefix('foo')).toEqual(null);
				expect(GithubAPI.getPrefix('meh')).toEqual(null);
			});
		});


		// Issues API
		// -------------------------
		describe('Issues API', function () {
			beforeEach(function() {
				resoponseData = [{ title: 'Issue #1'}];
				$httpBackend.whenGET(url + 'issues').respond(resoponseData);
			});

			it('should expose an API for issues', function() {
				expect(GithubAPI.issue).toBeDefined();
			});

			// All
			// -------------------------
			describe('All', function () {
				it('should expose a method to fetch a collection of issues', function() {
					expect(GithubAPI.issue.all).toEqual( jasmine.any(Function) );
				});

				it('should be possible to fetch all issues', function() {
					GithubAPI.issue.all(owner, repo);
					expect($http.get).toHaveBeenCalledWith( url + 'issues', {
						params : {},
						method: 'get',
						url: 'https://api.github.com/repos/mps-gmbh/ed/issues'
					});
				});

				it('should return the data (not the response object)', function() {
					GithubAPI.issue.all(owner, repo).then( function ( d ) {
						data = d;
					});
					$httpBackend.flush();
					expect(data).toEqual(resoponseData);
				});

				it('should be possible to fetch all issues with AuthToken', function() {
					GithubAPI.issue.all(owner, repo, token);
					expect($http.get).toHaveBeenCalledWith( url + 'issues', {
						params: {},
						headers : { 'Authorization' : 'token 123456789009876543' },
						method: 'get',
						url: 'https://api.github.com/repos/mps-gmbh/ed/issues'
					});
				});

				it('should be possible to add filters to the request', function() {
					var filter = { state: 'closed' };
					GithubAPI.issue.all(owner, repo, null, filter);
					expect($http.get).toHaveBeenCalledWith( url + 'issues', {
						params: filter,
						method: 'get',
						url: 'https://api.github.com/repos/mps-gmbh/ed/issues'
					});

					filter = { milestone: 1 };
					GithubAPI.issue.all(owner, repo, null, filter);
					expect($http.get).toHaveBeenCalledWith( url + 'issues', {
						params: filter,
						method: 'get',
						url: 'https://api.github.com/repos/mps-gmbh/ed/issues'
					});
				});

				it('should throw an error if arguments are missing', function() {
					expect(function () {
						GithubAPI.issue.all();
					}).toThrow();
					expect(function () {
						GithubAPI.issue.all(owner);
					}).toThrow();

					expect(function () {
						GithubAPI.issue.all(owner, repo);
					}).not.toThrow();
					expect(function () {
						GithubAPI.issue.all(owner, repo, token);
					}).not.toThrow();

					expect(function () {
						GithubAPI.issue.all(owner, repo, null, 123);
					}).toThrow();
				});
			});
		});


		// Milestones
		// -------------------------
		describe('Milestones', function () {
			beforeEach(function() {
				resoponseData = [{ title: 'Milestone #1'}];
				$httpBackend.whenGET(url + 'milestones').respond(resoponseData);
				$httpBackend.whenGET(url + 'milestones/1').respond(resoponseData[0]);
			});

			it('should expose an API for milestones', function() {
				expect(GithubAPI.milestone).toBeDefined();
			});

			// Single
			// -------------------------
			describe('Single', function () {
				it('should expose a method to fetch a single milestone', function() {
					expect(GithubAPI.milestone.get).toEqual( jasmine.any(Function) );
				});

				it('should be possible to fetch a milestone', function() {
					GithubAPI.milestone.get(owner, repo, null, 1);
					expect($http.get).toHaveBeenCalledWith( url + 'milestones/1', {
						method: 'get',
						url : 'https://api.github.com/repos/mps-gmbh/ed/milestones/1',
						params: {}
					});
				});

				it('should return the data (not the response object)', function() {
					GithubAPI.milestone.get(owner, repo, null, 1).then( function ( d ) {
						data = d;
					});
					$httpBackend.flush();
					expect(data).toEqual(resoponseData[0]);
				});

				it('should be possible to fetch a milestone with AuthToken', function() {
					GithubAPI.milestone.get(owner, repo, token, 1);
					expect($http.get).toHaveBeenCalledWith( url + 'milestones/1', {
						headers : { 'Authorization' : 'token 123456789009876543' },
						method: 'get',
						url : 'https://api.github.com/repos/mps-gmbh/ed/milestones/1',
						params: {}
					});
				});

				it('should throw an error if arguments are missing', function() {
					expect(function () {
						GithubAPI.milestone.get();
					}).toThrow();
					expect(function () {
						GithubAPI.milestone.get(owner);
					}).toThrow();
					expect(function () {
						GithubAPI.milestone.get(owner, repo, token);
					}).toThrow();
					expect(function () {
						GithubAPI.milestone.get(owner, repo, '123');
					}).toThrow();

					expect(function () {
						GithubAPI.milestone.get(owner, repo, null, 1);
					}).not.toThrow();
				});
			});


			// All
			// -------------------------
			describe('All', function () {
				it('should expose a method to fetch milestones', function() {
					expect(GithubAPI.milestone.all).toEqual( jasmine.any(Function) );
				});

				it('should be possible to fetch milestones', function() {
					GithubAPI.milestone.all(owner, repo);
					expect($http.get).toHaveBeenCalledWith( url + 'milestones', {
						method: 'get',
						url : 'https://api.github.com/repos/mps-gmbh/ed/milestones',
						params: {}
					});
				});

				it('should return the data (not the response object)', function() {
					GithubAPI.milestone.all(owner, repo).then( function ( d ) {
						data = d;
					});
					$httpBackend.flush();
					expect(data).toEqual(resoponseData);
				});

				it('should be possible to fetch milestones with AuthToken', function() {
					GithubAPI.milestone.all(owner, repo, token, 1);
					expect($http.get).toHaveBeenCalledWith( url + 'milestones', {
						headers : { 'Authorization' : 'token 123456789009876543' },
						method: 'get',
						url : 'https://api.github.com/repos/mps-gmbh/ed/milestones',
						params: {}
					});
				});

				it('should throw an error if arguments are missing', function() {
					expect(function () {
						GithubAPI.milestone.all();
					}).toThrow();
					expect(function () {
						GithubAPI.milestone.all(owner);
					}).toThrow();

					expect(function () {
						GithubAPI.milestone.all(owner, repo);
					}).not.toThrow();
					expect(function () {
						GithubAPI.milestone.all(owner, repo, token);
					}).not.toThrow();
				});

			});
		});
	});

});
