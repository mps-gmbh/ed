module.exports = {

	options : {
		livereload: '<%= port.livereload %>'
	},

	src: {
		files: [
			'<%= dir.src %>/<%= package.name %>.js',
			'<%= dir.src %>/**/!(*spec|*fixture).js'
		],
		tasks: ['concat:src']
	},

	template: {
		files: [
			'<%= dir.src %>/components/**/*.html'
		],
		tasks: ['html2js']
	},

	style: {
		files: [
			'<%= dir.src %>/**/*.scss'
		],
		tasks: ['sass:dev']
	},

	index: {
		files: [
			'<%= dir.src %>/<%= package.name %>.html'
		],
		tasks: ['copy:index']
	}
};
