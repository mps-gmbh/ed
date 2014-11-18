describe('[icon]', function () {
	var $rootScope, $compile, $http, $httpBackend, scope;

	function compile ( name ) {
		var el = angular.element('<ed-icon name="' + name + '"></ed-icon>');
		$compile( el )( scope );
		scope.$digest();
		return el;
	}

	beforeEach(module('ed.icon'));
	beforeEach( inject( function ( _$rootScope_, _$compile_, _$http_, _$httpBackend_ ) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;
		$http = _$http_;
		$httpBackend = _$httpBackend_;

		spyOn( $http, 'get' ).and.callThrough();

		scope = $rootScope.$new();
	}));

	it('should throw an error when "name" attribute is missing', function () {
		expect(function() {
			var element = angular.element('<ed-icon></ed-icon>');
			$compile( element )( scope );
		}).toThrow();

		expect(function() {
			var element = angular.element('<ed-icon name></ed-icon>');
			$compile( element )( scope );
		}).toThrow();
	});


	// Compiling
	// -------------------------
	describe('Compiling', function () {
		var element, parent, url, html;

		beforeEach(function() {
			html = '<div>I am compiled!</div>';
			url = 'icon/icon-error.svg';
			$httpBackend.expectGET(url).respond( html );
			element = compile( 'error' );
			parent = element.parent();
			$httpBackend.flush();
		});

		it('should fetch html', function () {
			expect( $http.get ).toHaveBeenCalledWith( url, jasmine.any(Object) );
		});

		it('should append template', function () {
			var shouldBe = angular.element(html);
			expect(element.children()[0].tagName ).toEqual( shouldBe[0].tagName );
			expect(element.children()[0].innerHTML ).toEqual( shouldBe[0].innerHTML );
		});
	});

});
