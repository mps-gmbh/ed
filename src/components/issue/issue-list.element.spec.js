describe('[issue-list]', function () {
	var $rootScope, $compile, $templateCache,
		element, scope;

	beforeEach(module('ed.issue'));
	beforeEach(module('ed.template.components'));
	beforeEach( inject( function ( _$rootScope_, _$compile_, _$templateCache_ ) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;
		$templateCache = _$templateCache_;

		spyOn($templateCache, 'get').and.callThrough();

		element = angular.element('<ed-issue-list><ed-issue-list>');
		element.attr('filter', '{ state: \'!closed\' }');
		element.attr('heading', 'Some Issue List!');
		element.attr('issues', 'issues');

		scope = $rootScope.$new();
		scope.issues = [{
			title: 'Hey!',
			state: 'open',
			labeels: [],
			hasLabel: angular.noop
		}, {
			title: 'Ho!',
			state: 'closed',
			labeels: [],
			hasLabel: angular.noop
		}];

		$compile( element )( scope );
	}));

	it('should compile custom element', function () {
		expect(element.contents().length).toEqual(0);
		$rootScope.$digest();
		expect(element.contents().length).toBeGreaterThan(0);
	});

	it('should use the correct template', function () {
		$rootScope.$digest();
		expect($templateCache.get).toHaveBeenCalledWith('issue/issue-list.html');
	});

	it('should init an isolate scope', function() {
		expect(element.isolateScope()).toBeUndefined();
		$rootScope.$digest();
		expect(element.isolateScope()).toBeDefined();
	});


	// Template Bindings
	// -------------------------
	describe('Template Bindings', function () {
		beforeEach(function() {
			$rootScope.$digest();
		});

		it('should have isolated "heading"', function() {
			expect(element.isolateScope().heading).toBeDefined();
		});

		it('should display display "heading"', function() {
			expect(element.children().eq(0).text()).toEqual(element.attr('heading'));
		});

		it('should have isolated "filter"', function() {
			expect(element.isolateScope().filter).toBeDefined();
		});

		it('should use filter to display issues', function() {
			var ngRepeat = element[0].querySelector('[ng-repeat]')
				.getAttribute('ng-repeat');
			expect(ngRepeat).toMatch(/filter$/);
		});

		it('should have isolated "issues"', function() {
			expect(element.isolateScope().issues).toBeDefined();
		});

		it('should bind to attribute', function() {
			expect(element.isolateScope().issues).toEqual(scope.issues);
		});
	});
});
