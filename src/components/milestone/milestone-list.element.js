(function () {

	angular.module('ed.milestone')
		.directive('edMilestoneList', MilestoneListElement);


	var forEach = angular.forEach;

	// Element
	// -------------------------
	function MilestoneListElement () {
		// DDO
		return {
			restrict: 'E',
			templateUrl: 'milestone/milestone-list.html',
			controller: MilestoneListController,
			controllerAs: 'list',
			bindToController: true,
			scope: {}
		};
	}


	// Controller
	// -------------------------
	MilestoneListController.$inject = [ '$document', 'GithubStore'];
	function MilestoneListController ( $document, GithubStore ) {
		var repo = GithubStore.getActiveRepository(),
			vm = this;

		vm.groups = [];
		vm.isLoading = true;
		vm.adjustPosition = adjustPosition;

		GithubStore.getMilestones(repo.id, true)
			.then(function ( groups ) {
				// Make ordering consistens mit tag list.
				var gs = [];
				forEach( repo.milestones.tags, function ( tag ) {
					gs.push({ name: tag, milestones: groups[tag] });
				});
				vm.groups = gs;
				vm.isLoading = false;
			});

		function adjustPosition ( name, value, element, action ) {
			if( name === 'is-expanded' && action === 'addedAttribute') {
				$document.scrollToElementAnimated(element, 15);
			}
		}
	}

})();
