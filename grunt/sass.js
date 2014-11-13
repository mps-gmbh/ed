module.exports =  function ( grunt, config ) {
	var path = require('path');

	function gatherScssImports () {
		var patterns = grunt.util.toArray(arguments).reduce( function ( a, b ) {
			return a.concat(b);
		}).map( function ( item ) {
			return grunt.template.process(item, { data: config });
		});
		return grunt.file.expand(patterns).map( function ( p ) {
			p = path.dirname(p) + '/' + path.basename(p).replace(/^_|\.scss$/g, '');
			return '@import "' + path.relative(config.dir.tmp, p) + '";';
		});
	}

	function createSassFile () {
		var imports = gatherScssImports(
			config.files.style.core,
			config.files.style.components
		);
		imports.unshift('@import "bourbon";');
		grunt.file.write(config.dir.tmp + '/theme.scss', imports.toString().replace(/,/g, '\n') );
		return config.dir.tmp + '/theme.scss';
	}

	return {
		options: {
			sourceMap: true,
			includePaths: require('node-bourbon').includePaths
		},
		dev: {
			files: {
				'<%= dir.dist %>/<%= package.name %>.css': createSassFile()
			}
		}
	};
};
