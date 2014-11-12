module.exports = {

	src: {
		src: [
			'<%= app.prefix %>',
			'<%= dir.src %>/**/!(*spec|*fixture).js',
			'<%= app.suffix %>'
		],
		dest: '<%= dir.dist %>/<%= package.name %>.js'
	},

	ng: {
		src: [
			'<%= dir.vendor %>/angular/angular.js',
			'<%= dir.vendor %>/angular-animate/angular-animate.js'
		],
		dest: '<%= dir.dist %>/angular.js'
	}

};
