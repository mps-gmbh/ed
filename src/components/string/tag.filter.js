(function () {

	angular.module('ed.string')
		.filter('tag', TagFilter);

	function TagFilter () {
		return function tagFn ( text, tag ) {
			return tag ?
				'[' + tag + '] ' + text :
				(text.match(/^\[([^\]]+)\]/) || [,null])[1];
		};
	}

})();
