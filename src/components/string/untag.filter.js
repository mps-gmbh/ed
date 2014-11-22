(function () {

	angular.module('ed.string')
		.filter('untag', UntagFilter);

	function UntagFilter () {
		return function untag ( text ) {
			return text.replace(/^\[[^\]]+\]\s?/, '');
		};
	}

})();
