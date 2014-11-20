describe('[issue/element]', function () {
	var $rootScope, $compile, $templateCache,
		PullRequestListController, scope, element;

	beforeEach(module('ed.issue'));
	beforeEach(module('ed.template.components'));
	beforeEach( inject( function ( _$rootScope_, _$compile_, _$templateCache_ ) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;
		$templateCache = _$templateCache_;

		spyOn($templateCache, 'get').and.callThrough();

		scope = $rootScope.$new();
		scope.issue = {
			title: 'PR 1',
			state: 'open'
		};
		element = angular.element('<ed-issue model="issue"><ed-issue>');
		$compile( element )(scope );
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
});
