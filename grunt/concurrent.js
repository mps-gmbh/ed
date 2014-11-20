module.exports = {

	options: {
		logConcurrentOutput: true
	},

	dev: ['lint', 'concat:src', 'concat:vendor', 'html2js', 'sass:dev', 'copy:index']
};
