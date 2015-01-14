(function () {

	angular.module('ed.issue')
		.value('ED_ISSUE_LABELS', [])
		.directive('edIssue', IssueDirective);


	// Element
	// -------------------------
	IssueDirective.$inject = ['ED_ISSUE_LABELS'];
	function IssueDirective ( ED_ISSUE_LABELS ) {
		var ddo = {
			restrict: 'E',
			templateUrl: 'issue/issue.html',
			scope: {
				issue: '=model'
			},
			link: linkFn
		};

		// Link
		function linkFn ( scope ) {
			scope.$watchCollection('issue.labels', filterLabels);
			function filterLabels () {
				var list = ED_ISSUE_LABELS.filter( function ( labelName ) {
					return scope.issue.hasLabel(labelName);
				});
				scope.displayedLabels = list.join(' / ');
			}
		}

		return ddo;
	}

})();
