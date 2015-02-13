describe('[core/route]', function() {
	var $route, $location;

	beforeEach(module('ed.core'));
	beforeEach(inject( function ( _$route_, _$location_ ){
		$route = _$route_;
		$location = _$location_;
	}));


	// Location
	// -------------------------
	describe('Location', function () {
		it('should prefix locations with a "!"', function() {
			$location.path('/milestones');
			expect($location.absUrl()).toMatch('#!');
		});
	});


	// Routes
	// -------------------------
	describe('Routes', function () {
		it('should have a "/milestones" route', function() {
			expect($route.routes['/milestones']).toBeDefined();
		});

		it('should load `<ed-milestone-list>` as template', function() {
			expect($route.routes['/milestones'].template).toEqual('<ed-milestone-list></ed-milestone-list>');
		});

		it('should have a "/bugs" route', function() {
			expect($route.routes['/bugs']).toBeDefined();
		});

		it('should fallback to "/milestones" if route is uknown', function() {
			expect($route.routes[null].redirectTo).toEqual('/milestones');
		});
	});
});
