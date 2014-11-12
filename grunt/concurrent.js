module.exports = {

	options: {
		logConcurrentOutput: true
	},

	dev: ['lint', 'concat:src', 'concat:ng', 'html2js', 'sass:dev', 'copy:index']
};
