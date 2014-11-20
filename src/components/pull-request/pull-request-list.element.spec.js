describe('[pull-request/element]', function () {
	var $rootScope, $compile, $templateCache,
		PullRequestListController, scope, element;

	beforeEach(module('ed.pullRequest'));
	beforeEach(module('ed.template.components'));
	// Overwrite element's controller
	beforeEach(function () {
		module('ed.pullRequest', function($controllerProvider) {
			$controllerProvider.register('PullRequestListController',
				PullRequestListController = jasmine.createSpy('PullRequestListController') );
		});
	});
	beforeEach( inject( function ( _$rootScope_, _$compile_, _$templateCache_ ) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;
		$templateCache = _$templateCache_;

		spyOn($templateCache, 'get').and.callThrough();

		scope = $rootScope.$new();
		scope.pullRequests = [{
			title: 'PR 1'
		}, {
			title: 'PR 2'
		}];
		element = angular.element('<ed-pull-request-list pull-requests="pullRequests"><ed-pull-request-list>');
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
			expect($templateCache.get).toHaveBeenCalledWith('pull-request/pull-request-list.html');
		});

		it('should init an isolate scope', function() {
			expect(element.isolateScope()).toBeUndefined();
			$rootScope.$digest();
			expect(element.isolateScope()).toBeDefined();
		});

		it('should bind "pullRequests" to isolate scope', function() {
			$rootScope.$digest();
			expect(element.isolateScope().pullRequests).toEqual(scope.pullRequests);
		});

		it('should init the correct controller', function() {
			expect(PullRequestListController).not.toHaveBeenCalled();
			$rootScope.$digest();
			expect(PullRequestListController).toHaveBeenCalled();
		});
	});
});
