describe('[core/constant]', function () {
	var ED_CONFIGURATION;

	beforeEach(module('ed.core'));
	beforeEach( inject( function ( _ED_CONFIGURATION_ ) {
		ED_CONFIGURATION = _ED_CONFIGURATION_;
	}));

	it('should be defined', function() {
		expect(ED_CONFIGURATION).toBeDefined();
	});

});
