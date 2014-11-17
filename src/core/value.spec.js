describe('[core/constant]', function () {
	var ED_GITHUB_CONFIG;

	beforeEach(module('ed.core'));
	beforeEach( inject( function ( _ED_GITHUB_CONFIG_ ) {
		ED_GITHUB_CONFIG = _ED_GITHUB_CONFIG_;
	}));

	it('should be defined', function() {
		expect(ED_GITHUB_CONFIG).toBeDefined();
	});

});
