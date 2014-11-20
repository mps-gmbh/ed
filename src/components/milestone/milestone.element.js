(function() {

	angular.module('ed.milestone')
		.directive( 'edMilestone', Milestone );


	function Milestone () {
		return {
			restrict: 'E',
			templateUrl: 'milestone/milestone.html',
			scope: {
				milestone: '=model'
			}
		};
	}

})();
