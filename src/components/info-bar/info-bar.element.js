(function () {

	angular.module('ed.infobar')
		.directive('edInfoBar', InfoBarDirective );


	InfoBarDirective.$inject = ['GithubStore'];
	function InfoBarDirective ( GithubStore ) {
		// Link
		function linkFn ( scope ) {
			GithubStore.listenTo( 'repository.updated', function ( ev, repo ) {
				scope.refresh_time = repo.updated_at.toISOString();
			});
		}

		//DDO
		return {
			restrict: 'E',
			templateUrl: 'info-bar/info-bar.html',
			scope: {},
			link: linkFn
		};
	}

})();
