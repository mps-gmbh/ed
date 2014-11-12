module.exports = {

	// Linting
	// -------------------------
	lint: ['jshint:all'],


	// Testing
	// -------------------------
	test: ['html2js', 'karma:unit'],
	coverage: ['html2js', 'karma:coverage'],
	tdd: ['html2js', 'karma:tdd'],


	// Local Server
	// -------------------------
	local_server: ['connect:local', 'open:local'],


	// Development
	// -------------------------
	dev: ['concurrent:dev', 'connect:local', 'watch'],


	// Build
	// -------------------------
	config: ['prompt:config'],


	// Default
	// -------------------------
	default: ['dev']

};
