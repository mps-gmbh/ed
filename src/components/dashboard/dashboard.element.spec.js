describe('[dashboard/element]', function () {
	var $rootScope, $compile, $templateCache, DashboardController, element;

	beforeEach(module('ed.dashboard'));
	beforeEach(module('ed.template.components'));
	// Overwrite <dashboard>'s controller
	beforeEach(function () {
		module('ed.dashboard', function($controllerProvider) {
			$controllerProvider.register('DashboardController',
				DashboardController = jasmine.createSpy('DashboardController') );
		});
	});
	beforeEach( inject( function ( _$rootScope_, _$compile_, _$templateCache_ ) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;
		$templateCache = _$templateCache_;

		spyOn($templateCache, 'get').and.callThrough();

		element = angular.element('<ed-dashboard config=\'{ owner: "me", repo: "mine"}\'><ed-dashboard>');
		$compile( element )( $rootScope.$new() );
	}));

	it('should compile custom element', function () {
		expect(element.contents().length).toEqual(0);
		$rootScope.$digest();
		expect(element.contents().length).toBeGreaterThan(0);
	});

	it('should use the correct template', function () {
		$rootScope.$digest();
		expect($templateCache.get).toHaveBeenCalledWith('dashboard/dashboard.html');
	});

	it('should init an isolate scope', function() {
		expect(element.isolateScope()).toBeUndefined();
		$rootScope.$digest();
		expect(element.isolateScope()).toBeDefined();
	});

	it('should init the correct controller', function() {
		expect(DashboardController).not.toHaveBeenCalled();
		$rootScope.$digest();
		expect(DashboardController).toHaveBeenCalled();
	});

	it('should controller with "as dashboard" syntax', function() {
		$rootScope.$digest();
		expect(element.isolateScope().dashboard).toEqual( jasmine.any(Object) );
	});
});
