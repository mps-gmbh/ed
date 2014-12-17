describe('[info-bar/element]', function () {
	var $rootScope, $compile, $templateCache,
		scope, element;

	beforeEach(module('ed.infobar'));
	beforeEach(module('ed.template.components'));
	beforeEach( inject( function ( _$rootScope_, _$compile_, _$templateCache_ ) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$templateCache = _$templateCache_;

		spyOn($templateCache, 'get').and.callThrough();

		scope = $rootScope.$new();
		element = angular.element('<ed-info-bar></ed-info-bar>');
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
			expect($templateCache.get).toHaveBeenCalledWith('info-bar/info-bar.html');
		});

		it('should init an isolate scope', function() {
			expect(element.isolateScope()).toBeUndefined();
			$rootScope.$digest();
			expect(element.isolateScope()).toBeDefined();
		});
	});


	// Listen to Milestone Refresh
	// -------------------------
	describe('Listen to Milestone Refresh', function () {
		beforeEach(function() {
			$rootScope.$digest();
		});

		it('should not init `refresh_time` ', function() {
			expect(element.isolateScope().refresh_time).toBeUndefined();
		});

		it('should update `refresh_time` when milestone are refreshed', function() {
			$rootScope.$broadcast('ed:milestones:refreshed');
			expect(element.isolateScope().refresh_time).toBeDefined();
		});

		it('should update `refresh_time` to a valid ISO datew', function() {
			$rootScope.$broadcast('ed:milestones:refreshed');
			expect(moment(element.isolateScope().refresh_time, "YYYY-MM-DDTHH:mm:ss.SSSZ", true).isValid()).toBeTruthy();

		});
	});
});
