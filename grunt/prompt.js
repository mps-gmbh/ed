module.exports = function ( grunt, options ) {

	function moduleTemplate ( coreConfig, issueConfig ) {
		var tpl =	'angular.module(\'ed.core\')\n' +
					'	.value(\'ED_GITHUB_CONFIG\', ' + JSON.stringify(coreConfig) + ');\n' +
					'angular.module(\'ed.issue\')\n' +
					'	.value(\'ED_ISSUE_LABELS\', ' + JSON.stringify(issueConfig) + ');\n';
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
		}, {
			name: 'grouping',
			type: 'confirm',
			message: 'Should milestones be grouped?',
			default: true
		}, {
			name: 'milestone_groups',
			type: 'input',
			message: 'Please specify a (comma seperated) list of group names:',
			default: 'sprint, refactor',
			validate: function ( value ) {
				return /^[-\w\s]+(?:,[-\w\s]*)*$/.test(value);
			},
			filter: function ( value ) {
				return value.split(/\s*,\s*/);
			},
			when: function ( answers ) {
				return answers['grouping'] === true;
			}
		}, {
			name: 'milestones_groups_default',
			type: 'input',
			message: 'Please specify a default group for milestones without tags:',
			default: 'backlog',
			validate: function ( value ) {
				return !!value;
			},
			when: function ( answers ) {
				return answers['grouping'] === true;
			}
		}, {
			name: 'milestones_refresh_timer',
			type: 'input',
			message: 'Please specify an interval (in minutes), in which the milestones should be updated:',
			default: 10,
			validate: function ( value ) {
				return (typeof value === 'number');
			}
		}, {
			name: 'issue_display_labels',
			type: 'input',
			message: 'Please specify a (comma seperated) list of labels to display:',
			default: 'FE, BE',
			validate: function ( value ) {
				return /^[-\w\s]+(?:,[-\w\s]*)*$/.test(value);
			},
			filter: function ( value ) {
				return value.split(/\s*,\s*/);
			}
		}],
		then: function ( answers, done ) {
			var issueConfig = answers.issue_display_labels;
			delete answers.type;
			delete answers.issue_display_labels;
			grunt.file.write(
				options.dir.tmp + '/github.config.js',
				moduleTemplate(answers, issueConfig)
			);
			done();
			return true;
		}
	};

	return {

		config: { options: config }

	};
};
