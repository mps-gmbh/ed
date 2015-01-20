describe('[core/config]', function () {
	var httpProvider;

	beforeEach(module('ng', function ( $httpProvider ) {
			httpProvider = $httpProvider;
			spyOn( $httpProvider, 'useApplyAsync' );
	}));
	beforeEach(module('ed.core'));
	beforeEach(function(){ inject(); });

	it('should use apply async', function() {
		expect(httpProvider.useApplyAsync).toHaveBeenCalledWith( true );
	});

});
