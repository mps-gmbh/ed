(function () {

	angular.module('ed.toggle')
		.directive('edToggleAttr', ToggleAttrDirective )
		.directive('edAddAttr', AddAttrDirective )
		.directive('edRemoveAttr', RemoveAttrDirective );


	// Helper
	// -------------------------
	var isUndefined = angular.isUndefined,
		isDefined = angular.isDefined,
		toggleGroup = {};

	function getElement( element, attr ) {
		return attr.edToggleAttrClosest ? closest(element, attr.edToggleAttrClosest) : element;
	}

	function closest ( element, tag ) {
		var exp = new RegExp( tag.replace(/[:-]/g, '[:-]') , 'i');
		while( !exp.test(element[0].tagName) && element.parent() ) {
			element = element.parent();
		}
		return element;
	}

	function toggle ( element, attr ) {
		var add = isUndefined(element.attr(attr));
		element[add ? 'attr' : 'removeAttr'](attr, '');
		return add;
	}


	// Toggle
	// -------------------------
	function ToggleAttrDirective () {
		return {
			restrict: 'A',
			link: ToggleDirectiveLink
		};
	}
	function ToggleDirectiveLink ( scope, element, attr ) {
		var attrName = attr.edToggleAttr;
		if( !attrName ) { return; }
		element.on('click', function () {
			var el = getElement( element, attr ),
				added = toggle( el, attrName );
			// Toggle Groups
			if( attr.edToggleAttrGroup ) {
				if( toggleGroup[attr.edToggleAttrGroup] && added ) {
					toggle(toggleGroup[attr.edToggleAttrGroup], attrName);
				}
				toggleGroup[attr.edToggleAttrGroup] = added ? el : undefined;
			}
		});
	}


	// Add
	// -------------------------
	function AddAttrDirective () {
		return {
			restrict: 'A',
			link: AddDirectiveLink
		};
	}
	function AddDirectiveLink ( scope, element, attr ) {
		var attrName = attr.edAddAttr;
		if( !attrName ) { return; }
		element.on('click', function () {
			var el = getElement( element, attr );
			if( isDefined(el.attr(attrName)) ) { return; }
			el.attr(attrName, '');
			if( attr.edToggleAttrGroup ) {
				if( toggleGroup[attr.edToggleAttrGroup] ) {
					toggleGroup[attr.edToggleAttrGroup].removeAttr(attrName);
				}
				toggleGroup[attr.edToggleAttrGroup] = el;
			}
		});
	}


	// Remove
	// -------------------------
	function RemoveAttrDirective () {
		return {
			restrict: 'A',
			link: RemoveDirectiveLink
		};
	}
	function RemoveDirectiveLink ( scope, element, attr ) {
		var attrName = attr.edRemoveAttr;
		if( !attrName ) { return; }
		element.on('click', function () {
			var el = getElement( element, attr );
			if( isDefined(el.attr(attrName)) ) {
				el.removeAttr(attrName);
			}
			if( attr.edToggleAttrGroup ) {
				if( toggleGroup[attr.edToggleAttrGroup] ) {
					toggleGroup[attr.edToggleAttrGroup].removeAttr(attrName);
				}
				toggleGroup[attr.edToggleAttrGroup] = undefined;
			}
		});
	}


})();
