module.exports = function ( grunt ) {
	return {
		index: {
			src: '<%= dir.src %>/<%= package.name %>.html',
			dest:  '<%= dir.dist %>/index.html',
			options: {
				process: function ( content ) {
					return grunt.template.process(content);
				}
			}
		}
	};
};
