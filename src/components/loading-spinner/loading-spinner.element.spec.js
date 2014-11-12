describe('[element/loading-spinner]', function () {
	var $rootScope, $compile, $templateCache, element;

	beforeEach(module('ed.element.loadingSpinner'));
	beforeEach(module('ed.template.components'));
	beforeEach( inject( function ( _$rootScope_, _$compile_, _$templateCache_ ) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;
		$templateCache = _$templateCache_;

		spyOn($templateCache, 'get').and.callThrough();

		element = angular.element('<loading-spinner><loading-spinner>');
		$compile( element )( $rootScope.$new() );
	}));

	it('should compile custom element', function () {
		expect(element.children().length).toEqual(0);
		$rootScope.$digest();
		expect(element.children().length).toBeGreaterThan(0);
	});

	it('should use the correct template', function () {
		$rootScope.$digest();
		expect($templateCache.get).toHaveBeenCalledWith('loading-spinner/loading-spinner.html');
	});

	it('should have five div children', function () {
		$rootScope.$digest();
		expect(element.children().length).toEqual(5);
	});
});
