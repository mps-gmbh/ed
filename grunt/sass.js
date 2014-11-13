module.exports =  function () {

	var main = "@import 'scss/lib/bourbon/bourbon';\n" +
				"@import 'scss/lib/normalize';\n" +


				"@import 'scss/core/font';\n" +
				"@import 'scss/core/colors';\n" +

				"@import 'scss/core/root';\n" +
				"@import 'scss/core/animations';\n" +
				"@import 'scss/core/utils';\n" +


				"@import 'scss/components/page';\n" +
				"@import 'scss/components/brand';\n" +
				"@import 'scss/components/loading-spinner';\n";


	return {
		options: {
			sourceMap: true,
			includePaths: require('node-bourbon').includePaths
		},
		dev: {
			files: {
				'<%= dir.dist %>/<%= package.name %>.css': '<%= dir.src %>/<%= package.name %>.scss'
			}
		}
	};
};
