describe('[github/milestone]', function () {
	var GithubMilestone;

	beforeEach(module('ed.github'));
	beforeEach( inject ( function ( _GithubMilestone_ ) {
		GithubMilestone = _GithubMilestone_;
	}));

	it('should be a constructor', function() {
		console.log(GithubMilestone);
	});

});
