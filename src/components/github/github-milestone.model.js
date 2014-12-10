(function () {

	// angular.module('ed.github')
	// 	.factory('GithubMilestone', GithubMilestoneFactory);


	// Helpers
	// -------------------------
	var extend = angular.extend;


	// Factory
	// -------------------------
	GithubMilestoneFactory.$inject = ['$http'];
	function GithubMilestoneFactory () {

		function GithubMilestone ( json ) {
			extend = (this, json);
			// Create URL to view milestone in browser.
			this.html_url = provider.HTML_URL + owner + '/' + repo +
				provider.API_PREFIX_MILESTONES + '/' + this.title;
		}

		GithubMilestone.prototype = {

		};

		return GithubMilestone;
	}


})();
