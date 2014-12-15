describe('[github/repository]', function () {
	var GithubAPI, GithubRepository,
		repo;

	beforeEach(module('ed.github'));
	beforeEach( inject( function ( _GithubAPI_, _GithubRepository_ ) {
		GithubAPI = _GithubAPI_;
		GithubRepository = _GithubRepository_;
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
	});


	// Issues
	// -------------------------
	describe('Issues', function () {
		var r1, r2;

		beforeEach(function() {
			r1 = new GithubRepository( 'me', 'foo' );
			r2 = new GithubRepository( 'me', 'foo', '13479120516203' );
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
	});


	// Milestones
	// -------------------------
	describe('Milestones', function () {
		var r1, r2;

		beforeEach(function() {
			r1 = new GithubRepository( 'me', 'foo' );
			r2 = new GithubRepository( 'me', 'foo', '13479120516203' );
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
		});
	});
});
