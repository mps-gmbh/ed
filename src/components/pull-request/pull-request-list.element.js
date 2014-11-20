(function () {

	angular.module('ed.pullRequest')
		.directive('edPullRequestList', PullRequestListDirective);

	function PullRequestListDirective () {
		return {
			restrict: 'E',
			templateUrl: 'pull-request/pull-request-list.html',
			controller: 'PullRequestListController',
			scope: {
				pullRequests: '='
			}
		};
	}

})();
