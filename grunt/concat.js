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
			src: '<%= files.src %>',
			dest: '<%= destination.src %>'
		},

		vendor: {
			src: '<%= files.vendor %>',
			dest: '<%= destination.vendor %>'
		}
	};

};
