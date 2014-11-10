module.exports = function( grunt ) {


	// Project Config
	// -------------------------
	var config = {

		dir: {
			coverage: 'coverage',
			dist: 'dist',
			src: 'src',
			vendor: 'vendor'
		}

	};


	// Grunt Config
	// -------------------------
	require('load-grunt-config')(grunt, {
		data: config
	});


};
