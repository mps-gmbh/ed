module.exports = function(config) {
	config.set({


		basePath: '',
		files: [
			'vendor/angular/angular.js',
			'vendor/angular-animate/angular-animate.js',
			'vendor/angular-mocks/angular-mocks.js',
			'dist/*.template.js',
			'src/**/*.js'
		],
		exclude: [
		],


		frameworks: ['jasmine'],
		browsers: ['Chrome'],


		preprocessors: {},
		reporters: ['dots'],


		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,


		autoWatch: true,
		singleRun: false
	});
};
