module.exports = function ( grunt, options ) {

	function moduleTemplate ( data ) {
		var tpl =	'angular.module(\'ed.config\', [])\n' +
					'	.constant(\'ED_CONFIG\', ' + JSON.stringify(data) + ')';
		return tpl;
	};

	var config = {
		questions: [{
			name: 'owner',
			type: 'input',
			message: 'Repository owner/organization:'
		}, {
			name: 'repo',
			type: 'input',
			message: 'Repository name:'
		}, {
			name: 'type',
			type: 'list',
			choices: [{ name: 'public' }, { name: 'private' }],
			message: 'Repository type:'
		}, {
			name: 'token',
			type: 'input',
			message: 'OAuth token to access the repository:',
			when: function ( answers ) {
				return answers['type'] === 'private';
			}
		}],
		then: function ( answers, done ) {
			delete answers.type;
			grunt.file.write(
				options.dir.dist + '/ed.config.js',
				moduleTemplate(answers)
			);
			done();
			return true;
		}
	};

	return {

		config: { options: config }

	};
};
