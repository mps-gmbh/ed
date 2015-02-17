(function () {

	angular.module('ed.issue')
		.directive('edBugList', BugListElement);


	// Element
	// -------------------------
	function BugListElement () {
		// DDO
		return {
			restrict: 'E',
			templateUrl: 'issue/bug-list.html',
			controller: BugListController,
			controllerAs: 'list',
			bindToController: true,
			scope: {}
		};
	}


	// Controller
	// -------------------------
	BugListController.$inject = ['GithubStore'];
	function BugListController ( GithubStore ) {
		var repo = GithubStore.getActiveRepository(),
			vm = this;

		vm.bugs = [];
		vm.isLoading = true;

		vm.priority = function ( issue ) {
			return issue.priorityAsNumber();
		};

		GithubStore.getBugs(repo.id).then(function ( bugs ) {
			vm.bugs = bugs;
			vm.isLoading = false;
		});
	}

})();
