module.exports = {

	// Base configuratio
	options: {
		basePath: '',
		files: [
			'<%= files.vendor %>',
			'<%= files.mock %>',

			'<%= destination.tpl %>',

			'<%= files.all %>'
		],
		exclude: [
		],

		frameworks: ['jasmine'],
		browsers: ['Chrome'],


		preprocessors: {},
		reporters: ['dots'],


		port: 9876,
		colors: true,
		logLevel: 'INFO',


		autoWatch: true,
		singleRun: false
	},

	// Sinle run
	unit: {
		singleRun: true,
		preprocessors: {
			'<%= files.coverage %>': ['coverage']
		},
		reporters: ['dots', 'coverage'],
		coverageReporter: {
			type : 'text-summary'
		},
	},

	// Create coverage report
	coverage: {
		singleRun: true,
		preprocessors: {
			'<%= files.coverage %>': ['coverage']
		},
		reporters: ['dots', 'coverage'],
		coverageReporter: {
			type : 'html',
			dir: '<%= dir.coverage %>/'
		},
	},

	// TDD
	tdd: {}
};
