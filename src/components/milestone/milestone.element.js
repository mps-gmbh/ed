(function() {

	angular.module('ed.element.milestone')
		.directive( 'edMilestone', Milestone );


	function Milestone () {
		return {
			restrict: 'E',
			templateUrl: 'milestone/milestone.html',
			controller: 'MilestoneController',
			scope: {
				milestone: '=model'
			}
		};
	}

})();
