module.exports = function( grunt ) {


	// Project Config
	// -------------------------
	var config = {

		dir: {
			coverage: 'coverage',
			dist: 'dist',
			src: 'src',
			vendor: 'vendor'
		},

		app: {
			prefix: '<%= dir.src %>/app.prefix',
			suffix: '<%= dir.src %>/app.suffix'
		},

		port: {
			livereload: 2407,
			localhost: 5555
		}

	};


	// Grunt Config
	// -------------------------
	require('load-grunt-config')(grunt, {
		data: config
	});


};
