describe('[github/milestone/factory]', function () {
	var $httpBackend,
		GithubMilestone, GithubIssue,
		json;

	beforeEach(module('ed.github'));
	beforeEach( inject ( function ( _$httpBackend_, _GithubMilestone_, _GithubIssue_ ) {
		$httpBackend = _$httpBackend_;
		GithubMilestone = _GithubMilestone_;
		GithubIssue = _GithubIssue_;

		// Example from Github's API docs
		json = {
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
	}));


	// Construction
	// -------------------------
	describe('Construction', function () {
		it('should be a constructor', function() {
			expect(GithubMilestone).toEqual( jasmine.any(Function) );
		});

		// args = 1
		it('should store all data properties', function() {
			var milestone = new GithubMilestone(json);
			for( var prop in json ) {
				expect(milestone[prop]).toEqual( json[prop] );
			}
		});

		// args = 2
		it('should be possible to call with auth token', function() {
			var token = '123456789',
				milestone = new GithubMilestone(json, token);
			expect(milestone._token).toEqual(token);
			for( var prop in json ) {
				expect(milestone[prop]).toEqual( json[prop] );
			}
		});

		it('should automaticall generate `repo` and `owner', function() {
			var token = '123456789',
				milestone = new GithubMilestone(json, token);
			expect(milestone._owner).toEqual('octocat');
			expect(milestone._repo).toEqual('Hello-World');
		});

		// args = 3
		it('should be possible to call with [owner, repo]', function() {
			var owner = 'mps-gmbh',
				repo = 'ed',
				milestone = new GithubMilestone(json, owner, repo);

			expect(milestone._owner).toEqual(owner);
			expect(milestone._repo).toEqual(repo);
			expect(milestone._token).toBeUndefined();
			for( var prop in json ) {
				expect(milestone[prop]).toEqual( json[prop] );
			}
		});

		// args = 4
		it('should be possible to call with [owner, repo and token]', function() {
			var owner = 'mps-gmbh',
				repo = 'ed',
				token = '123456789',
				milestone = new GithubMilestone(json, owner, repo, token);

			expect(milestone._owner).toEqual(owner);
			expect(milestone._repo).toEqual(repo);
			expect(milestone._token).toEqual(token);
			for( var prop in json ) {
				expect(milestone[prop]).toEqual( json[prop] );
			}
		});

		// args = 0 || >4
		it('should throw errors if constructor was invoked with falsy arguments', function() {
			expect(function () {
				new GithubMilestone();
			}).toThrow();
			expect(function () {
				new GithubMilestone( json, 1, 2, 3, 4);
			}).toThrow();
		});

		it('should set `html_url` if possible', function() {
			var owner = 'mps-gmbh',
				repo = 'ed',
				milestone = new GithubMilestone(json, owner, repo),
				data = angular.copy(json);

			expect(milestone.html_url).toEqual( jasmine.any(String) );

			milestone = new GithubMilestone(json);
			expect(milestone.html_url).toEqual( jasmine.any(String) );

			delete data.url;
			milestone = new GithubMilestone(data);
			expect(milestone.html_url).toBeUndefined();

			data = angular.copy(json);
			delete data.title;
			milestone = new GithubMilestone(data);
			expect(milestone.html_url).toBeUndefined();
		});

		it('should set `new_issue_url` if possible', function() {
			var owner = 'mps-gmbh',
				repo = 'ed',
				milestone = new GithubMilestone(json, owner, repo),
				data = angular.copy(json);

			expect(milestone.new_issue_url).toEqual( jasmine.any(String) );

			milestone = new GithubMilestone(json);
			expect(milestone.new_issue_url).toEqual( jasmine.any(String) );

			delete data.url;
			milestone = new GithubMilestone(data);
			expect(milestone.new_issue_url).toBeUndefined();

			data = angular.copy(json);
			delete data.title;
			milestone = new GithubMilestone(data);
			expect(milestone.new_issue_url).toBeUndefined();
		});
	});


	// Update Progress
	// -------------------------
	describe('Update Progress', function () {
		var owner, repo, token,
			milestone;

		beforeEach(function() {
			owner = 'mps-gmbh';
			repo = 'ed';
			token = '123456789';
			milestone = new GithubMilestone(json, owner, repo, token);
			milestone.issues = [{
				title: 'I want this to be implemented! Yesterday!',
				number: 55,
				state: 'open'
			}, {
				title: 'Yet another feature request',
				number: 1234,
				state: 'closed'
			}, {
				title: 'I found a bug',
				number: 55,
				state: 'open',
				pull_request: { url: 'http://example.com/pull_request' }
			}, {
				title: 'Make button "cornflower blue" instead of "deep sky blue"',
				number: 1234,
				state: 'open'
			}];
		});

		it('should espose a method to update progress', function() {
			expect(milestone.updateProgress).toEqual( jasmine.any(Function) );
		});

		it('should be possible to update progress', function() {
			expect(milestone.progress).toBeUndefined();
			milestone.updateProgress();
			expect(milestone.progress).toBeDefined();
		});

		it('should correctly calculate progress (ignore PRs)', function() {
			milestone.updateProgress();
			expect(milestone.progress).toEqual(1/3);

			milestone.issues[0].state = 'closed';
			milestone.updateProgress();
			expect(milestone.progress).toEqual(2/3);
		});
	});


	// Refresh
	// -------------------------
	describe('Refresh', function () {
		var owner, repo, token,
			milestone,
			milestoneResponse;

		beforeEach(function() {
			owner = 'mps-gmbh';
			repo = 'ed';
			token = '123456789';
			milestone = new GithubMilestone(json, owner, repo, token);
			milestoneResponse = { title: 'Empty Milestone'};
			$httpBackend.whenGET(json.url).respond(milestoneResponse);

			spyOn(GithubMilestone.prototype, 'getIssues');
		});

		it('should expose a method to refresh', function() {
			expect(milestone.refresh).toEqual( jasmine.any(Function) );
		});

		it('should be possible to refresh milestone', function() {
			milestone.refresh();
			$httpBackend.flush();
			angular.forEach( json, function ( value, key ) {
				expect(json[key]).not.toEqual(milestone[key]);
			});
			angular.forEach( milestoneResponse, function ( value, key ) {
				expect(milestoneResponse[key]).toEqual(milestone[key]);
			});
		});

		it('should keep repository data when refreshing', function() {
			milestone.refresh();
			$httpBackend.flush();
			expect(milestone._owner).toEqual(owner);
			expect(milestone._repo).toEqual(repo);
			expect(milestone._token).toEqual(token);
		});

		it('should return the refreshed milestone (as promise)', function() {
			var m;
			milestone.refresh().then(function ( r ) {
				m = r;
			});
			$httpBackend.flush();
			expect(m).toEqual(milestone);
		});

		it('should use auth token if possible', function() {
			$httpBackend.expectGET(json.url, {
				'Authorization': 'token ' + token,
				'Accept': 'application/json, text/plain, */*'
			});
			milestone.refresh();
			$httpBackend.flush();
		});

		it('should throw an error if no `url` is specified', function() {
			expect(function () {
				delete json.url;
				milestone = new GithubMilestone(json);
				milestone.refresh();
			}).toThrow();
		});

		it('should set a loading flag', function() {
			expect(milestone.isRefreshing).toBeUndefined();
			milestone.refresh();
			expect(milestone.isRefreshing).toBeTruthy();
			$httpBackend.flush();
			expect(milestone.isRefreshing).toBeUndefined();
		});

		it('should fetch issues', function() {
			milestone.refresh();
			$httpBackend.flush();
			expect(GithubMilestone.prototype.getIssues).toHaveBeenCalled();
		});
	});


	// Issues
	// -------------------------
	describe('Issues', function () {
		var owner = 'mps-gmbh',
			repo = 'ed',
			token = '123456789',
			prURL = 'https://api.github.com/repos/mps-gmbh/ed/pulls/1',
			milestone,
			issueResponse,
			prResponse;

		beforeEach(function() {
			milestone = new GithubMilestone(json, owner, repo, token);

			// Fake Backend
			issueResponse = {
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
					var number = url.match(/milestone=(\d+)/)[1];
					return [ 200, issueResponse[number] ];
				});
			$httpBackend.whenGET(prURL)
				.respond(prResponse);

			// Spies
			spyOn( GithubMilestone.prototype, 'updateProgress' ).and.callThrough();
		});

		it('should expose a method to fetch issues', function() {
			expect(milestone.getIssues).toEqual( jasmine.any(Function) );
		});

		it('should be possible to fetch issues', function() {
			expect(milestone.issues).toBeUndefined();
			milestone.getIssues();
			$httpBackend.flush();
			expect(milestone.issues).toEqual(issueResponse[milestone.number]);
		});

		it('should cast fetched issues to `GithubIssue` objects', function() {
			milestone.getIssues();
			$httpBackend.flush();
			milestone.issues.forEach( function ( issue ) {
				expect( issue instanceof GithubIssue ).toBeTruthy();
			});
		});

		it('should return fetched issues (as promise)', function() {
			var i;
			milestone.getIssues().then(function ( r ) {
				i = r;
			});
			$httpBackend.flush();
			expect(milestone.issues).toEqual(i);
		});

		it('should set a loading flag', function() {
			expect(milestone.isLoadingIssues).toBeUndefined();
			milestone.getIssues();
			expect(milestone.isLoadingIssues).toBeTruthy();
			$httpBackend.flush();
			expect(milestone.isLoadingIssues).toBeUndefined();
		});

		it('should update progress after updating issues', function() {
			milestone.getIssues();
			$httpBackend.flush();
			expect(GithubMilestone.prototype.updateProgress).toHaveBeenCalled();
		});

		// Pull Requests
		// -------------------------
		describe('Pull Requests', function () {
			beforeEach(function() {
				angular.extend( milestone, {
					"url": "https://api.github.com/repos/octocat/Hello-World/milestones/11",
					"number": 11,
				});
			});

			it('should fetch additional PR data for "PR issues"', function() {
				milestone.getIssues();
				$httpBackend.flush();
				expect(milestone.pull_requests.length).toEqual(1);
			});
		});
	});
});
