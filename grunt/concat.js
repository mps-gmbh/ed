module.exports = function () {

	var WRAP_BANNER =	'(function(window, angular, undefined) {\n' +
						'\'use strict\';\n\n',
		WRAP_FOOTER =	'})(window, window.angular);';

	return {
		src: {
			options: {
				banner: WRAP_BANNER,
				footer: WRAP_FOOTER
			},
			src: [
				'<%= dir.src %>/**/*.module.js',
				'<%= dir.src %>/**/!(*module|*spec|*fixture).js'
			],
			dest: '<%= dir.dist %>/<%= package.name %>.js'
		},

		ng: {
			src: [
				'<%= dir.vendor %>/angular/angular.js',
				'<%= dir.vendor %>/angular-animate/angular-animate.js',
				'<%= dir.vendor %>/angular-progress-arc/angular-progress-arc.js'
			],
			dest: '<%= dir.dist %>/angular.js'
		}
	};

};
