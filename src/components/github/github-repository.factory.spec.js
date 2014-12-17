describe('[github/repository]', function () {
	var GithubAPI, GithubMilestone, GithubRepository,
		$httpBackend,
		repo;

	beforeEach(module('ed.github'));
	beforeEach( inject( function ( _GithubAPI_, _GithubMilestone_, _GithubRepository_, _$httpBackend_ ) {
		GithubAPI = _GithubAPI_;
		GithubMilestone = _GithubMilestone_;
		GithubRepository = _GithubRepository_;

		$httpBackend = _$httpBackend_;

		repo = null;

		spyOn(GithubAPI.issue, 'all').and.callThrough();
		spyOn(GithubAPI.milestone, 'all').and.callThrough();
		spyOn(GithubAPI.milestone, 'get').and.callThrough();
	}));


	// Construction
	// -------------------------
	describe('Construction', function () {
		it('should be a constructor', function() {
			expect(GithubRepository).toEqual( jasmine.any(Function) );
		});

		it('should store [owner, name and token]', function() {
			var repo = new GithubRepository( 'owner', 'name', 'token' );

			expect(repo.owner).toBeDefined();
			expect(repo.owner).toEqual('owner');

			expect(repo.name).toBeDefined();
			expect(repo.name).toEqual('name');

			expect(repo.token).toBeDefined();
			expect(repo.token).toEqual('token');
		});

		it('should init an empty milestones array', function() {
			var repo = new GithubRepository( 'owner', 'name', 'token' );
			expect(repo.milestones).toEqual([]);
		});
	});


	// Issues
	// -------------------------
	describe('Issues', function () {
		var r1, r2;

		beforeEach(function() {
			r1 = new GithubRepository( 'me', 'foo' );
			r2 = new GithubRepository( 'me', 'foo', '13479120516203' );

			$httpBackend.whenGET(/.*/).respond([]);
		});

		it('should expose a method to fetch all issues', function() {
			expect(r1.getIssues).toEqual( jasmine.any(Function) );
		});

		it('should use `GithubAPI` service to fetch issues', function() {
			r1.getIssues();
			expect(GithubAPI.issue.all).toHaveBeenCalledWith( 'me', 'foo', undefined, undefined );

			r2.getIssues();
			expect(GithubAPI.issue.all).toHaveBeenCalledWith( 'me', 'foo', '13479120516203', undefined );

			r2.getIssues({ 'state': 'open' });
			expect(GithubAPI.issue.all).toHaveBeenCalledWith( 'me', 'foo', '13479120516203', { 'state': 'open' } );
		});

		it('should return a promise', function() {
			expect(r1.getIssues().$$state).toEqual( jasmine.any(Object) );
			expect(r1.getIssues().then).toEqual( jasmine.any(Function) );
		});

		it('should set loading flag', function() {
			expect(r1.isLoadingIssues).toBeUndefined();
			r1.getIssues();
			expect(r1.isLoadingIssues).toBeTruthy();
			$httpBackend.flush();
			expect(r1.isLoadingIssues).toBeUndefined();
		});
	});


	// Milestones
	// -------------------------
	describe('Milestones', function () {
		var r1, r2,
			// Example from Github's API docs
			milestoneJson = {
				"url": "https://api.github.com/repos/octocat/Hello-World/milestones/1",
				"number": 1,
				"state": "open",
				"title": "v1.0",
				"description": "",
				"creator": {
					"login": "octocat",
					"id": 1,
					"avatar_url": "https://github.com/images/error/octocat_happy.gif",
					"gravatar_id": "",
					"url": "https://api.github.com/users/octocat",
					"html_url": "https://github.com/octocat",
					"followers_url": "https://api.github.com/users/octocat/followers",
					"following_url": "https://api.github.com/users/octocat/following{/other_user}",
					"gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
					"starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
					"subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
					"organizations_url": "https://api.github.com/users/octocat/orgs",
					"repos_url": "https://api.github.com/users/octocat/repos",
					"events_url": "https://api.github.com/users/octocat/events{/privacy}",
					"received_events_url": "https://api.github.com/users/octocat/received_events",
					"type": "User",
					"site_admin": false
				},
				"open_issues": 4,
				"closed_issues": 8,
				"created_at": "2011-04-10T20:09:31Z",
				"updated_at": "2014-03-03T18:58:10Z",
				"closed_at": "2013-02-12T13:22:01Z",
				"due_on": null
			};

		beforeEach(function() {
			r1 = new GithubRepository( 'me', 'foo' );
			r2 = new GithubRepository( 'me', 'foo', '13479120516203' );

			$httpBackend.whenGET(/milestones\/?(d+)?/).respond( function ( method, url ) {
				var response = /\d+$/.test(url) ?
					milestoneJson :
					[milestoneJson, milestoneJson];
				return [ 200, response ];
			});
		});

		// All
		describe('All', function () {
			it('should expose a method to fetch all milestones', function() {
				expect(r1.getMilestones).toEqual( jasmine.any(Function) );
			});

			it('should use `GithubAPI` service to fetch issues', function() {
				r1.getMilestones();
				expect(GithubAPI.milestone.all).toHaveBeenCalledWith( 'me', 'foo', undefined );

				r2.getMilestones();
				expect(GithubAPI.milestone.all).toHaveBeenCalledWith( 'me', 'foo', '13479120516203' );
			});

			it('should return a promise', function() {
				expect(r1.getMilestones().$$state).toEqual( jasmine.any(Object) );
				expect(r1.getMilestones().then).toEqual( jasmine.any(Function) );
			});

			it('should cast fetched milestones to `GithubMilestone` objects', function() {
				var milestones;
				r2.getMilestones().then( function ( resultMilestones ) {
					milestones = resultMilestones;
				});
				$httpBackend.flush();
				milestones.forEach( function ( m ) {
					expect(m instanceof GithubMilestone).toBeTruthy();
				});
			});

			it('should update repositor\'s milestones', function() {
				expect(r1.milestones).toEqual([]);
				r1.getMilestones();
				$httpBackend.flush();
				expect(r1.milestones).toBeDefined();
				expect(r1.milestones).toEqual(jasmine.any(Array));
			});

			it('should set loading flag', function() {
				expect(r1.isLoadingMilestones).toBeUndefined();
				r1.getMilestones();
				expect(r1.isLoadingMilestones).toBeTruthy();
				$httpBackend.flush();
				expect(r1.isLoadingMilestones).toBeUndefined();
			});
		});


		// Single
		describe('Single', function () {
			it('should expose a method to fetch all milestones', function() {
				expect(r1.getMilestone).toEqual( jasmine.any(Function) );
			});

			it('should use `GithubAPI` service to fetch issues', function() {
				r1.getMilestone(1);
				expect(GithubAPI.milestone.get).toHaveBeenCalledWith( 'me', 'foo', undefined, 1 );

				r2.getMilestone(2);
				expect(GithubAPI.milestone.get).toHaveBeenCalledWith( 'me', 'foo', '13479120516203', 2 );
			});

			it('should return a promise', function() {
				expect(r1.getMilestone(1).$$state).toEqual( jasmine.any(Object) );
				expect(r1.getMilestone(1).then).toEqual( jasmine.any(Function) );
			});

			it('should cast fetched milestone to `GithubMilestone` objects', function() {
				var milestone;
				r2.getMilestone(1).then( function ( resultMilestone ) {
					milestone = resultMilestone;
				});
				$httpBackend.flush();
				expect(milestone instanceof GithubMilestone).toBeTruthy();
			});

			it('should store fetched milestone inside the repository', function() {
				expect(r1.milestones).toEqual([]);
				r1.getMilestone(1);
				$httpBackend.flush();
				expect(r1.milestones.length).toEqual(1);
			});

			it('should overwrite milestone if fetched milestone already exists', function() {
				r1.getMilestone(1);
				$httpBackend.flush();

				r1.milestones[0].title = 'Changed title';

				r1.getMilestone(1);
				$httpBackend.flush();

				expect(r1.milestones.length).toEqual(1);
				expect(r1.milestones[0].title).toEqual(milestoneJson.title);
			});

			it('should set loading flag', function() {
				expect(r1.isLoadingMilestone).toBeUndefined();
				r1.getMilestone(1);
				expect(r1.isLoadingMilestone).toEqual(1);
				$httpBackend.flush();
				expect(r1.isLoadingMilestone).toBeUndefined();
			});
		});
	});
});
