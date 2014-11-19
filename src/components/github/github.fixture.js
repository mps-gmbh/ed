(function () {

	angular.module('github.fixture', [])
		.service('GithubFixture',
			function ( GH_FIXTURE_MILESTONES_1, GH_FIXTURE_ISSUES_1, GH_FIXTURE_ISSUES_2 ) {

			this.milestones = GH_FIXTURE_MILESTONES_1;
			this.issues = {
				'1' : GH_FIXTURE_ISSUES_1,
				'2' : GH_FIXTURE_ISSUES_2
			};
		})

		// Milestones
		// -------------------------
		.value('GH_FIXTURE_MILESTONES_1', [{
			title: 'Back to the Future',
			number: 1
		}, {
			title: 'Spaceballs',
			number: 2
		}])


		// Issues
		// -------------------------
		.value('GH_FIXTURE_ISSUES_1', [{
			title: 'The flux capacitor is leaking.',
			number: 10,
			state: 'open'
		}, {
			title: 'Marty McFly just broke the time barrier.',
			number: 11,
			state: 'closed'
		}, {
			title: 'Nobody calls me chicken!',
			number: 12,
			state: 'open',
			pull_request: {
				url: 'http://www.mcfly.io/pull/42'
			}
		}])

		.value('GH_FIXTURE_ISSUES_2', [{
			title: 'What\'s the matter, Colonel Sandurz? Chicken?',
			number: 20,
			state: 'open'
		}, {
			title: 'They\'ve gone to plaid!',
			number: 21,
			state: 'open'
		}]);

})();
