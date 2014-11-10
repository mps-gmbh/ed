module.exports =  {
	options: {
		sourceMap: true
	},
	dist: {
		files: {
			'<%= dir.dist %>/<%= package.name %>.css': '<%= dir.src %>/<%= package.name %>.scss'
		}
	}
};
