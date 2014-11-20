(function () {

	angular.module('ed.pullRequest')
		.controller('PullRequestListController', PullRequestListController);

	PullRequestListController.$inect = ['$scope'];
	function PullRequestListController ( $scope ) {
		$scope.state = function ( pr ) {
			return pr.merged && 'merged' || pr.state;
		};
	}

})();
