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
		}
	};
};
