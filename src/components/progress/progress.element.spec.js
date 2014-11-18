describe('[element/progress]', function () {
	var $rootScope, $compile, $templateCache, element, scope;

	beforeEach(module('ed.element.progress'));
	beforeEach(module('ed.template.components'));
	beforeEach( inject( function ( _$rootScope_, _$compile_, _$templateCache_ ) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;
		$templateCache = _$templateCache_;

		spyOn($templateCache, 'get').and.callThrough();

		scope = $rootScope.$new();
		scope.model = { max: 100, current: 24 };
		element = angular.element('<ed-progress percentage="model.current/model.max"><ed-progress>');
		$compile( element )( scope );
	}));

	it('should compile custom element', function () {
		expect(element.children().length).toEqual(0);
		scope.$digest();
		expect(element.children().length).toBeGreaterThan(0);
	});

	it('should use the correct template', function () {
		scope.$digest();
		expect($templateCache.get).toHaveBeenCalledWith('progress/progress.html');
	});

	// Percentage
	// -------------------------
	describe('Percentage', function () {
		beforeEach(function() {
			scope.$digest();
		});

		it('should display the correct percentage', function () {
			var isolatePercentage = element.isolateScope().percentage,
				displayedPercentage = element.find('span').text();

			expect(isolatePercentage * 100).toEqual(parseFloat(displayedPercentage));
		});
	});
});
