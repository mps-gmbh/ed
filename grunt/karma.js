module.exports = {
	options: {
		configFile: 'karma-unit.conf.js'
	},

	// Sinle run
	unit: {
		singleRun: true,
		preprocessors: {
			'src/**/!(*spec|*fixture).js': ['coverage']
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
			'src/**/!(*spec|*fixture).js': ['coverage']
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
