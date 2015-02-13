describe('[milestone/list]', function() {
	var $rootScope, $compile, $templateCache, $httpBackend, $document,
		GithubStore, GithubFixture,
		element;

	beforeEach(module('ed.milestone'));
	beforeEach(module('ed.github'));
	beforeEach(module('github.fixture'));
	beforeEach(module('ed.template.components'));
	beforeEach( inject( function ( _$rootScope_, _$compile_, _$templateCache_, _$httpBackend_, _$document_, _GithubStore_, _GithubFixture_ ) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;
		$templateCache = _$templateCache_;
		$httpBackend = _$httpBackend_;
		$document = _$document_;
		GithubStore = _GithubStore_;

		GithubFixture = _GithubFixture_;

		// Spies
		spyOn($templateCache, 'get').and.callThrough();

		spyOn(GithubStore, 'getActiveRepository').and.callThrough();
		spyOn(GithubStore, 'getMilestones').and.callThrough();

		// Server
		$httpBackend.whenGET(/milestones\?per_page=\d*$/).respond(GithubFixture.milestones);
		$httpBackend.whenGET(/issues\?/)
			.respond(function ( method, url ) {
				var number = url.match(/milestone=(\d+)/)[1],
					state = url.match(/state=(\w+)/)[1];
				return [ 200, GithubFixture.issues[number].filter(function ( issue ) {
					return state === 'all' || state === issue.state;
				})];
			});
		$httpBackend.whenGET('http://www.mcfly.io/pull/42').respond({});

		// Element + Setup
		GithubStore.addRepository('mps-gmbh', 'ed');
		GithubStore.setActiveRepository('mps-gmbh/ed');

		element = angular.element('<ed-milestone-list><ed-milestone-list>');
		$compile( element )( $rootScope.$new() );
		$rootScope.$digest();
	}));


	// Element
	// -------------------------
	describe('Element', function () {
		it('should compile custom element', function () {
			expect(element[0].tagName).toEqual('ED-MILESTONE-LIST');
			expect(element.contents().length).toBeGreaterThan(0);
		});

		it('should use the correct template', function () {
			expect($templateCache.get).toHaveBeenCalledWith('milestone/milestone-list.html');
		});

		it('should init an isolate scope', function() {
			expect(element.isolateScope()).toBeDefined();
		});

		it('should bind to controller "list"', function() {
			expect(element.isolateScope().list).toBeDefined();
		});

		it('should init a controller', function() {
			expect(element.controller('edMilestoneList')).toBeDefined();
		});
	});


	// Controller
	// -------------------------
	describe('Controller', function () {
		var ctrl;

		beforeEach(function() {
			ctrl = element.controller('edMilestoneList');
		});

		// Initalization
		// -------------------------
		describe('Initalization', function () {
			it('should init empty groups array', function() {
				expect(ctrl.groups).toEqual([]);
			});

			it('should set loading state to true', function() {
				expect(ctrl.isLoading).toEqual(true);
			});

			it('should fetch active repo', function() {
				expect(GithubStore.getActiveRepository).toHaveBeenCalled();
			});

			it('shoudl fetch active repos milestones', function() {
				expect(GithubStore.getMilestones).toHaveBeenCalledWith('mps-gmbh/ed', true);
			});
		});


		// Load Milestones
		// -------------------------
		describe('Load Milestones', function () {
			var repo;

			beforeEach(function() {
				repo = GithubStore.getActiveRepository();
				$httpBackend.flush();
			});

			it('should create object for each group', function() {
				expect(ctrl.groups.length).toEqual(repo.milestones.tags.length);
			});

			it('should create groups with names, milestones and correct order', function() {
				repo.milestones.tags.forEach( function ( tag, idx ) {
					expect(ctrl.groups[idx].name).toEqual(tag);
					expect(ctrl.groups[idx].milestones).toEqual(repo.milestones.group[tag]);
				});
			});

			it('should set loading falsy', function() {
				expect(ctrl.isLoading).toEqual(false);
			});
		});


		// Adjust Position
		// -------------------------
		describe('Adjust Position', function () {
			var div, span;

			beforeEach(function () {
				div = angular.element('<div></div>');
				span = angular.element('<span></span>');
				$document.scrollToElementAnimated = jasmine.createSpy();
			});

			it('should expose a method to adjust position', function() {
				expect(ctrl.adjustPosition).toEqual( jasmine.any(Function) );
			});

			it('should call `scrollToElementAnimated` if attribute `is-expanded` was added', function() {
				ctrl.adjustPosition('is-expanded', '', div, 'addedAttribute');
				expect($document.scrollToElementAnimated).toHaveBeenCalledWith( div, 15 );

				ctrl.adjustPosition('is-foo', '', span, 'addedAttribute');
				expect($document.scrollToElementAnimated).not.toHaveBeenCalledWith( span, 15 );

				ctrl.adjustPosition('is-expanded', '', span, 'removedAttribute');
				expect($document.scrollToElementAnimated).not.toHaveBeenCalledWith( span, 15 );
			});
		});
	});
});
