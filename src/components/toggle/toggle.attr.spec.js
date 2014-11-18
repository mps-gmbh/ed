describe('toggleAttr', function () {
	var $rootScope, $compile,
		element, scope;

	//TODO: Add this globally.
	beforeEach(function () {
		function toHaveAttrMatcher () {
			return {
				compare: function ( element, attrName, attrValue ) {
					var result = {
						pass: element.hasAttribute(attrName),
						message: 'Expected ' + element.outerHTML + 'to have attribute "' + attrName + '".'
					};
					if( attrValue && result.pass ) {
						result.pass = element.getAttribute(attrName) === attrValue;
						result.message = 'Expected attribute "' + attrName + '" to be "' + attrValue +
							'", but was "' + element.getAttribute(attrName) + '".';
					}
					return result;
				},
				negativeCompare: function ( element, attrName, attrValue ) {
					var result = {
						pass: !element.hasAttribute(attrName),
						message: 'Expected ' + element.outerHTML + ' not to have attribute "' + attrName + '".'
					};
					if( attrValue && result.pass ) {
						result.pass = element.getAttribute(attrName) !== attrValue;
						result.message = 'Expected attribute "' + attrName + '" not to be "' + attrValue +
							'", but was "' + element.getAttribute(attrName) + '".';
					}
					return result;
				},
			};
		}
		jasmine.addMatchers({toHaveAttr: toHaveAttrMatcher});
	});

	beforeEach(module('ed.toggle'));
	beforeEach( inject ( function ( _$rootScope_, _$compile_ ) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;
	}));


	// Add Attribute
	// -------------------------
	describe('Add Attribute', function () {
		beforeEach(function() {
			scope = $rootScope.$new();
			element = angular.element('<span ed-add-attr="foo">Click me!</span>');
			$compile( element )( scope );
			scope.$digest();
		});

		it('should be possible to add a attribute', function() {
			expect(element[0]).not.toHaveAttr('foo');
			element.triggerHandler('click');
			expect(element[0]).toHaveAttr('foo');
		});

		it('should not remove the attribute if clicked again', function() {
			expect(element[0]).not.toHaveAttr('foo');
			element.triggerHandler('click');
			expect(element[0]).toHaveAttr('foo');
			element.triggerHandler('click');
			expect(element[0]).toHaveAttr('foo');
			element.triggerHandler('click');
			expect(element[0]).toHaveAttr('foo');
		});

		it('should not do anything if no attribute was specified', function () {
			element = angular.element('<span ed-add-attr>Click me!</span>');
			$compile( element )( scope );
			scope.$digest();

			expect(element[0]).not.toHaveAttr('foo');
			element.triggerHandler('click');
			expect(element[0]).not.toHaveAttr('foo');
		});
	});


	// Remove Attribute
	// -------------------------
	describe('Remove Attribute', function () {
		beforeEach(function() {
			scope = $rootScope.$new();
			element = angular.element('<span ed-remove-attr="foo" foo>Click me!</span>');
			$compile( element )( scope );
			scope.$digest();
		});

		it('should be possible to remove a attribute', function() {
			expect(element[0]).toHaveAttr('foo');
			element.triggerHandler('click');
			expect(element[0]).not.toHaveAttr('foo');
		});

		it('should not add the attribute if clicked again', function() {
			expect(element[0]).toHaveAttr('foo');
			element.triggerHandler('click');
			expect(element[0]).not.toHaveAttr('foo');
			element.triggerHandler('click');
			expect(element[0]).not.toHaveAttr('foo');
			element.triggerHandler('click');
			expect(element[0]).not.toHaveAttr('foo');
		});

		it('should not do anything if no attribute was specified', function () {
			element = angular.element('<span ed-remove-attr foo>Click me!</span>');
			$compile( element )( scope );
			scope.$digest();

			expect(element[0]).toHaveAttr('foo');
			element.triggerHandler('click');
			expect(element[0]).toHaveAttr('foo');
		});
	});


	// Toggle Attribue
	// -------------------------
	describe('Toggle Attribue', function () {
		beforeEach(function() {
			scope = $rootScope.$new();
			element = angular.element('<span ed-toggle-attr="foo">Click me!</span>');
			$compile( element )( scope );
			scope.$digest();
		});

		it('should be possible to toggle a attribute', function() {
			expect(element[0]).not.toHaveAttr('foo');
			element.triggerHandler('click');
			expect(element[0]).toHaveAttr('foo');

			element.triggerHandler('click');
			expect(element[0]).not.toHaveAttr('foo');

			element.triggerHandler('click');
			expect(element[0]).toHaveAttr('foo');
		});

		it('should not do anything if no attribute was specified', function () {
			element = angular.element('<span ed-toggle-attr>Click me!</span>');
			$compile( element )( scope );
			scope.$digest();

			expect(element[0]).not.toHaveAttr('foo');
			element.triggerHandler('click');
			expect(element[0]).not.toHaveAttr('foo');
		});
	});


	// Toggle Group
	// -------------------------
	describe('Toggle Group', function () {
		function clickElement ( n ) {
			element.eq(n).triggerHandler('click');
		}

		beforeEach(function() {
			scope = $rootScope.$new();
			element = angular.element(
				'<span ed-add-attr="foo" ed-toggle-attr-group="group">Click 1!</span>' +
				'<span ed-remove-attr="foo" ed-toggle-attr-group="group">Click 2!</span>' +
				'<span ed-toggle-attr="foo" ed-toggle-attr-group="group">Click 3!</span>' +
				'<span ed-toggle-attr="foo" ed-toggle-attr-group="alone">Click 4!</span>'
			);
			$compile( element )( scope );
			scope.$digest();
		});

		it('should only add attribute to itself', function() {
			clickElement(0);
			expect(element[0]).toHaveAttr('foo');
			for (var i = 1; i < element.length; i++) {
				expect(element[i]).not.toHaveAttr('foo');
			}
		});

		it('should exist only one (or no) element with specified attribute (inside a group)', function() {
			clickElement(0);
			expect(element[0]).toHaveAttr('foo');
			expect(element[1]).not.toHaveAttr('foo');
			expect(element[2]).not.toHaveAttr('foo');
			expect(element[3]).not.toHaveAttr('foo');

			clickElement(2);
			expect(element[0]).not.toHaveAttr('foo');
			expect(element[1]).not.toHaveAttr('foo');
			expect(element[2]).toHaveAttr('foo');
			expect(element[3]).not.toHaveAttr('foo');

			clickElement(0);
			expect(element[0]).toHaveAttr('foo');
			expect(element[1]).not.toHaveAttr('foo');
			expect(element[2]).not.toHaveAttr('foo');
			expect(element[3]).not.toHaveAttr('foo');
		});

		it('should have independent groups', function() {
			clickElement(0);
			clickElement(3);
			expect(element[0]).toHaveAttr('foo');
			expect(element[1]).not.toHaveAttr('foo');
			expect(element[2]).not.toHaveAttr('foo');
			expect(element[3]).toHaveAttr('foo');

			clickElement(2);
			expect(element[0]).not.toHaveAttr('foo');
			expect(element[1]).not.toHaveAttr('foo');
			expect(element[2]).toHaveAttr('foo');
			expect(element[3]).toHaveAttr('foo');
		});

		it('should remove attribute from every element inside the group', function() {
			clickElement(0);
			clickElement(3);
			expect(element[0]).toHaveAttr('foo');
			expect(element[1]).not.toHaveAttr('foo');
			expect(element[2]).not.toHaveAttr('foo');
			expect(element[3]).toHaveAttr('foo');

			clickElement(1); // remove
			expect(element[0]).not.toHaveAttr('foo');
			expect(element[1]).not.toHaveAttr('foo');
			expect(element[2]).not.toHaveAttr('foo');
			expect(element[3]).toHaveAttr('foo');
		});
	});

	// Closest Parent
	// -------------------------
	describe('Closest Parent', function () {
		function clickElement ( n ) {
			element.children().eq(n).triggerHandler('click');
		}

		beforeEach(function() {
			scope = $rootScope.$new();
			element = angular.element(
				'<div>' +
				'	<span ed-add-attr="foo" ed-toggle-attr-closest="div">Click 1!</span>' +
				'	<span ed-remove-attr="foo" ed-toggle-attr-closest="div">Click 2!</span>' +
				'	<span ed-toggle-attr="foo" ed-toggle-attr-closest="div">Click 3!</span>' +
				'</div>'
			);
			$compile( element )( scope );
			scope.$digest();
		});

		it('should be possible to toggle attribute for a parent', function() {
			expect(element[0]).not.toHaveAttr('foo');

			// Add
			clickElement(0);
			expect(element[0]).toHaveAttr('foo');

			// Remove
			clickElement(1);
			expect(element[0]).not.toHaveAttr('foo');

			clickElement(2);
			expect(element[0]).toHaveAttr('foo');
			clickElement(2);
			expect(element[0]).not.toHaveAttr('foo');
		});
	});


	// Closest with Groups
	// -------------------------
	describe('Closest with Groups', function () {
		function clickElement ( n ) {
			element.eq(n).children().eq(0).triggerHandler('click');
		}

		beforeEach(function() {
			scope = $rootScope.$new();
			element = angular.element(
				'<div id="1">' +
				'	<span ed-toggle-attr="foo" ed-toggle-attr-group="group" ed-toggle-attr-closest="div">Click!</span>' +
				'</div>' +
				'<div id="2">' +
				'	<span ed-toggle-attr="foo" ed-toggle-attr-group="group" ed-toggle-attr-closest="div">Click!</span>' +
				'</div>'
			);
			$compile( element )( scope );
			scope.$digest();
		});

		it('should be possible to to use groups and closest options', function() {
			expect(element[0]).not.toHaveAttr('foo');
			expect(element[1]).not.toHaveAttr('foo');

			clickElement(0);
			expect(element[0]).toHaveAttr('foo');
			expect(element[1]).not.toHaveAttr('foo');

			clickElement(1);
			expect(element[0]).not.toHaveAttr('foo');
			expect(element[1]).toHaveAttr('foo');

			clickElement(1);
			expect(element[0]).not.toHaveAttr('foo');
			expect(element[1]).not.toHaveAttr('foo');
		});
	});
});
