describe('observeAttr', function () {
	var $rootScope, $compile, $document,
		scope,
		elementOne, elementTwo;

	beforeEach(module('ed.attr.observe'));
	beforeEach( inject ( function ( _$rootScope_, _$compile_, _$document_ ) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;
		$document = _$document_;

		scope = $rootScope.$new();
		scope.callback = jasmine.createSpy('callback');

		elementOne = angular.element('<span ed-attr-observe="{ \'foo\': callback }">Some text!</span>');
		$compile( elementOne )( scope );

		elementTwo = angular.element('<span bar="foo" ed-attr-observe="{ \'bar\': callback }">Some text!</span>');
		$compile( elementTwo )( scope );

		scope.$digest();
	}));


	// Initialization
	// -------------------------
	describe('Initialization', function () {
		var element;

		beforeEach(function() {
			element = null;
		});

		it('should throw an error when config is messed up', function() {
			element = angular.element('<span ed-attr-observe="foo">Some text!</span>');
			expect(function () {
				$compile( element )( scope );
				scope.$digest();
			}).toThrow();

			element = angular.element('<span ed-attr-observe>Some text!</span>');
			expect(function () {
				$compile( element )( scope );
				scope.$digest();
			}).toThrow();
		});
	});


	// Observe Attribute
	// -------------------------
	describe('Observe Attribute', function () {

		// Add
		// -------------------------
		describe('Add', function () {
			beforeEach(function( done ) {
				elementOne.attr('foo', 'bar');
				setTimeout(function () {
					done();
				}, 200);
			});

			it('it should execute callbacks when attribute is added', function() {
				expect(scope.callback).toHaveBeenCalledWith( 'foo', 'bar', elementOne, 'addedAttribute' );
			});
		});

		// Remove
		// -------------------------
		describe('Remove', function () {
			beforeEach(function( done ) {
				elementTwo.removeAttr('bar');
				setTimeout(function () {
					done();
				}, 200);
			});

			it('it should execute callbacks when attribute is removed', function() {
				expect(scope.callback).toHaveBeenCalledWith( 'bar', undefined, elementTwo, 'removedAttribute' );
			});
		});

		// Update
		// -------------------------
		describe('Update', function () {
			beforeEach(function( done ) {
				elementTwo.attr('bar', 'update');
				setTimeout(function () {
					done();
				}, 200);
			});

			it('it should execute callbacks when attribute is udpated', function() {
				expect(scope.callback).toHaveBeenCalledWith( 'bar', 'update', elementTwo, 'updatedAttributed' );
			});
		});
	});
});
