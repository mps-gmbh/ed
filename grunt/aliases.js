module.exports = {

	// Linting
	// -------------------------
	lint: ['jshint:all'],


	// Testing
	// -------------------------
	test: ['karma:unit'],
	coverage: ['karma:coverage'],
	tdd: ['karma:tdd'],


	// Build
	// -------------------------
	config: ['prompt:config'],


	// Default
	// -------------------------
	default: ['tdd']

};
