module.exports = function ( grunt ) {
	return {
		index: {
			src: '<%= files.index %>',
			dest:  '<%= destination.index %>',
			options: {
				process: function ( content ) {
					return grunt.template.process(content);
				}
			}
		},
		maps: {
			src: '<%= files.maps %>',
			dest:  '<%= dir.dist %>/',
			expand: true,
			flatten: true,
		}
	};
};
