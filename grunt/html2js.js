module.exports = {

	options: {
		base: '<%= dir.tpl %>',
		singleModule: true
	},
	components: {
		module: '<%= package.name %>.template.components',
		src: '<%= files.tpl %>',
		dest: '<%= destination.tpl %>'
	},

};
