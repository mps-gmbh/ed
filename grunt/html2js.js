module.exports = {

	options: {
		base: '<%= dir.src %>/components/',
		singleModule: true
	},
	components: {
		module: 'ed.template.components',
		src: [
			'<%= dir.src %>/components/**/*.html',
			'<%= dir.src %>/components/**/icon-*.svg'
		],
		dest: '<%= dir.dist %>/<%= package.name %>.template.js'
	},

};
