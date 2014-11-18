module.exports = function( grunt ) {


	// Project Config
	// -------------------------
	var config = {

		dir: {
			coverage: 'coverage',
			dist: 'dist',
			src: 'src',
			vendor: 'vendor',
			tmp: '.tmp'
		},

		files: {
			style: {
				core: [
					'<%= dir.src %>/core/variables.scss',
					'<%= dir.src %>/core/normalize.scss',
					'<%= dir.src %>/core/base.scss',
					'<%= dir.src %>/core/animations.scss',
					'<%= dir.src %>/core/mixins.scss'
				],
				components: [
					'<%= dir.src %>/{components,utils}/**/*.scss'
				]
			}
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
