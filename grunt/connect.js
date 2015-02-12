module.exports = {
	local: {
		options: {
			hostname: 'localhost',
			base: '<%= dir.dist %>',
			port: '<%= port.localhost %>',
			livereload: '<%= port.livereload %>',
			open: true
		}
	}
};
