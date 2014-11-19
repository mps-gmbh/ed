(function () {

	angular.module('ed.issue')
		.directive('edIssue', IssueDirective);

	function IssueDirective () {
		return {
			restrict: 'E',
			templateUrl: 'issue/issue.html',
			scope: {
				issue: '=model'
			}
		};
	}

})();
