describe('[github/issue/factory]', function () {
	var GithubIssue,
		issue,

		issueJson = {
			"id": 1,
			"url": "https://api.github.com/repos/octocat/Hello-World/issues/1347",
			"html_url": "https://github.com/octocat/Hello-World/issues/1347",
			"number": 1347,
			"state": "open",
			"title": "Found a bug",
			"body": "I'm having a problem with this.",
			"labels": [
				{
					"url": "https://api.github.com/repos/octocat/Hello-World/labels/bug",
					"name": "bug",
					"color": "f29513"
				},
				{
					"url": "https://api.github.com/repos/octocat/Hello-World/labels/foo",
					"name": "foo",
					"color": "000000"
				}
			],
		};

	beforeEach(module('ed.github'));
	beforeEach( inject( function ( _GithubIssue_ ) {
		GithubIssue = _GithubIssue_;
	}));


	// Construction
	// -------------------------
	describe('Construction', function () {
		it('should be a constructor', function() {
			expect(GithubIssue).toEqual( jasmine.any(Function) );
		});

		it('should store all passed data', function() {
			issue = new GithubIssue(issueJson);
			for( var prop in issueJson ) {
				expect(issue[prop]).toEqual( issueJson[prop] );
			}
		});
	});


	// Label Methods
	// -------------------------
	describe('Label Methods', function () {
		beforeEach(function() {
			issue = new GithubIssue(issueJson);
		});

		it('should expose a method to check if issue has a certain label', function() {
			expect(issue.hasLabel).toEqual(jasmine.any(Function));
		});

		it('should be possible to check if issue has a certain label', function() {
			expect(issue.hasLabel('bug')).toBeTruthy();
			expect(issue.hasLabel('bUg')).toBeTruthy();

			expect(issue.hasLabel('foo')).toBeTruthy();
			expect(issue.hasLabel('fOO')).toBeTruthy();

			expect(issue.hasLabel('n0pe')).toBeFalsy();
			expect(issue.hasLabel('ney')).toBeFalsy();
		});
	});
});
