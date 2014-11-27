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
			'src/**/!(*module|*spec|*fixture).js': ['coverage']
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
			'src/**/!(*module|*spec|*fixture).js': ['coverage']
		},
		reporters: ['dots', 'coverage'],
		coverageReporter: {
			type : 'html',
			dir: 'coverage/'
		},
	},

	// TDD
	tdd: {}
};
