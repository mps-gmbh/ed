describe('[issue/value]', function () {
	var ED_ISSUE_LABELS;

	beforeEach(module('ed.issue'));
	beforeEach( inject( function ( _ED_ISSUE_LABELS_ ) {
		ED_ISSUE_LABELS = _ED_ISSUE_LABELS_;
	}));

	it('should be defined', function() {
		expect(ED_ISSUE_LABELS).toBeDefined();
	});
});

describe('[issue/element]', function () {
	var $rootScope, $compile, $templateCache, GithubIssue,
		scope, element,
		ED_ISSUE_LABELS = [ 'bug' ];
	beforeEach(function () {
		module('ed.issue', function ( $provide ) {
			$provide.value('ED_ISSUE_LABELS', ED_ISSUE_LABELS);
		});
	});
	beforeEach(module('ed.template.components'));
	beforeEach(module('ed.github'));
	beforeEach( inject( function ( _$rootScope_, _$compile_, _$templateCache_, _GithubIssue_ ) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;
		$templateCache = _$templateCache_;

		GithubIssue = _GithubIssue_;

		spyOn($templateCache, 'get').and.callThrough();

		scope = $rootScope.$new();
		scope.issue = new GithubIssue({
			title: 'PR 1',
			state: 'open',
			labels: [
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
			]
		});

		element = angular.element('<ed-issue model="issue"><ed-issue>');
		$compile( element )( scope );
	}));


	// Initialization
	// -------------------------
	describe('Initialization', function () {
		it('should compile custom element', function () {
			expect(element.contents().length).toEqual(0);
			$rootScope.$digest();
			expect(element.contents().length).toBeGreaterThan(0);
		});

		it('should use the correct template', function () {
			$rootScope.$digest();
			expect($templateCache.get).toHaveBeenCalledWith('issue/issue.html');
		});

		it('should init an isolate scope', function() {
			expect(element.isolateScope()).toBeUndefined();
			$rootScope.$digest();
			expect(element.isolateScope()).toBeDefined();
		});

		it('should bind "model" to isolate scope "issue"', function() {
			$rootScope.$digest();
			expect(element.isolateScope().issue).toEqual(scope.issue);
		});
	});


	// Labels
	// -------------------------
	describe('Labels', function () {
		var isolateScope;

		beforeEach(function() {
			$rootScope.$digest();
			isolateScope = element.isolateScope();
		});

		it('should expose labels to display', function() {
			expect(isolateScope.displayedLabels).toBeDefined();
		});

		it('should watch `issues.labels` to update `displayedLabels`', function() {
			var oldDisplayedLabels = isolateScope.displayedLabels;
			isolateScope.issue.labels = [];
			isolateScope.$digest();
			expect(isolateScope.displayedLabels).not.toEqual(oldDisplayedLabels);
		});
	});
});
