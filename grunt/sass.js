module.exports =  {
	options: {
		sourceMap: true
	},
	dev: {
		files: {
			'<%= dir.dist %>/<%= package.name %>.css': '<%= dir.src %>/<%= package.name %>.scss'
		}
	}
};
