describe('[pull-request-list/controller]', function () {
	var $controller,
		scope, controller;

	beforeEach(module('ed.pullRequest'));
	beforeEach( inject ( function ( _$controller_ ) {
		$controller = _$controller_;

		scope = {};
		controller = $controller( 'PullRequestListController', { $scope: scope });
	}));

	it('should be defined', function() {
		expect(controller).toBeDefined();
	});

	// State
	// -------------------------
	describe('State', function () {
		it('should expose a method to retrieve the state', function() {
			expect(scope.state).toEqual( jasmine.any(Function) );
		});

		it('should be possible to retrieve the state', function() {
			expect(scope.state({ merged: true, state: 'closed'})).toEqual('merged');
			expect(scope.state({ merged: true})).toEqual('merged');

			expect(scope.state({ merged: false, state: 'closed'})).toEqual('closed');
			expect(scope.state({ state: 'closed'})).toEqual('closed');

			expect(scope.state({ merged: false, state: 'open'})).toEqual('open');
			expect(scope.state({ state: 'open'})).toEqual('open');
		});
	});

});
