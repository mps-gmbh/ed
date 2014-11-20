module.exports = function( grunt ) {


	// Project Config
	// -------------------------
	var config = {

		dir: {
			coverage: 'coverage',
			dist: 'dist',
			src: 'src',
			components: '<%= dir.src %>/components',
			tpl: '<%= dir.components %>',
			vendor: 'vendor',
			tmp: '.tmp'
		},

		files: {

			// SCSS
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
			},

			// App
			index: '<%= dir.src %>/<%= package.name %>.html',
			src: [
				'<%= dir.src %>/**/*.module.js',
				'<%= dir.src %>/**/!(*module|*spec|*fixture).js',
				'<%= dir.tmp %>/github.config.js'
			],
			tpl: [
				'<%= dir.components %>/**/*.html',
				'<%= dir.components %>/**/icon-*.svg'
			],

			// All source files
			all: [
				'src/**/*.module.js',
				'src/**/!(*module).js'
			],

			// Testing
			mock: '<%= dir.vendor %>/angular-mocks/angular-mocks.js',
			coverage: 'src/**/!(*module|*spec|*fixture).js',

			// Vendor
			vendor: [
				'<%= dir.vendor %>/showdown/compressed/showdown.js',

				'<%= dir.vendor %>/angular/angular.js',
				'<%= dir.vendor %>/angular-sanitize/angular-sanitize.js',
				'<%= dir.vendor %>/angular-animate/angular-animate.js',
				'<%= dir.vendor %>/angular-progress-arc/angular-progress-arc.js',
				'<%= dir.vendor %>/angular-markdown-directive/markdown.js'
			]
		},

		destination: {
			style: '<%= dir.dist %>/<%= package.name %>.css',
			index:  '<%= dir.dist %>/index.html',
			src: '<%= dir.dist %>/<%= package.name %>.js',
			tpl: '<%= dir.dist %>/<%= package.name %>.template.js',
			vendor: '<%= dir.dist %>/vendor.js'
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
