(function () {

	angular.module('ed.issue')
		.directive('edBug', BugElement);


	function BugElement () {
		// DDO
		return {
			restrict: 'E',
			templateUrl: 'issue/bug.html',
			scope: {
				bug: '=model'
			}
		};
	}

})();
