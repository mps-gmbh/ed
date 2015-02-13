describe('[core/config]', function () {
	var httpProvider,
		GithubStore;

	beforeEach(module('ed.github', function ( $provide, $httpProvider ) {
			$provide.constant('ED_CONFIGURATION', {
				owner: 'mps-gmbh',
				repo: 'ed',
				token: '362414afs623sdz1236asd123',
				milestone_groups: ['sprint', 'backlog']
			});

			$provide.decorator('GithubStore', function ( $delegate ) {
				spyOn( $delegate, 'addRepository' ).and.callThrough();
				spyOn( $delegate, 'setActiveRepository' ).and.callThrough();
				return $delegate;
			});

			httpProvider = $httpProvider;
			spyOn( $httpProvider, 'useApplyAsync' );
	}));
	beforeEach(module('ed.core'));
	beforeEach(inject( function ( _GithubStore_ ) {
		GithubStore = _GithubStore_;
	}));


	// Config Phase
	// -------------------------
	describe('Config Phase', function () {
		it('should use apply async', function() {
			expect(httpProvider.useApplyAsync).toHaveBeenCalledWith( true );
		});
	});


	// Setup Phase
	// -------------------------
	describe('Setup Phase', function () {
		it('should add repo from "ED_CONFIGURATION"', function() {
			expect(GithubStore.addRepository).toHaveBeenCalledWith(
				'mps-gmbh', 'ed', '362414afs623sdz1236asd123', [ 'sprint', 'backlog' ]);
		});
		it('should set repo from "ED_CONFIGURATION" active', function() {
			expect(GithubStore.setActiveRepository).toHaveBeenCalledWith('mps-gmbh/ed');
		});
	});
});
