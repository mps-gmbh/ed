(function () {

	angular.module('github.fixture', [])
		.service('GithubFixture',
			function ( GH_FIXTURE_MILESTONES_1, GH_FIXTURE_ISSUES_1, GH_FIXTURE_ISSUES_2, GH_FIXTURE_ISSUES_3 ) {

			this.milestones = GH_FIXTURE_MILESTONES_1;
			this.issues = {
				'1' : GH_FIXTURE_ISSUES_1,
				'2' : GH_FIXTURE_ISSUES_2,
				'3' : GH_FIXTURE_ISSUES_3
			};
		})

		// Milestones
		// -------------------------
		.value('GH_FIXTURE_MILESTONES_1', [{
			title: '[Sprint] Back to the Future',
			number: 1
		}, {
			title: 'Spaceballs',
			number: 2
		}, {
			title: '[Sprint] Firefly',
			number: 3
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
		}])

		.value('GH_FIXTURE_ISSUES_3', [{
			title: 'Captain, you mind if I say grace?',
			number: 30,
			state: 'open'
		}, {
			title: 'Only if you say it out loud.',
			number: 31,
			state: 'open'
		}])		;

})();
