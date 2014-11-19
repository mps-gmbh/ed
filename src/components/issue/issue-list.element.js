(function () {

	angular.module('ed.issue')
		.directive('edIssueList', IssueListDirective);

	function IssueListDirective () {
		return {
			restrict: 'E',
			templateUrl: 'issue/issue-list.html',
			scope: {
				heading: '@',
				issues: '=',
				filter: '='
			}
		};
	}

})();
