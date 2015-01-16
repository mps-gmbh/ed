(function () {

	angular.module('ed.attr.toggle')
		.directive('edAttrToggle', ToggleAttrDirective )
		.directive('edAttrAdd', AddAttrDirective )
		.directive('edAttrRemove', RemoveAttrDirective );


	// Helper
	// -------------------------
	var isUndefined = angular.isUndefined,
		isDefined = angular.isDefined,
		toggleGroup = {};

	function getElement( element, attr ) {
		return attr.edAttrToggleClosest ? closest(element, attr.edAttrToggleClosest) : element;
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

	// Group Map Methods
	function setActiveGroupItem ( groupName, attrName, el, id ) {
		if ( groupName ) {
			if ( toggleGroup[groupName] && toggleGroup[groupName].element ) {
				toggleGroup[groupName].element.removeAttr(attrName);
			}
			toggleGroup[groupName] = {
				element: el,
				identifier: id
			};
		}
	}

	function removeActiveGroupItem ( groupName, attrName, el ) {
		if( isDefined(el.attr(attrName)) ) {
			el.removeAttr(attrName);
		}
		if( groupName ) {
			if ( toggleGroup[groupName] && toggleGroup[groupName].element ) {
				toggleGroup[groupName].element.removeAttr(attrName);
			}
			toggleGroup[groupName] = {};
		}
	}

	function wasActive ( groupName, attrName, id ) {
		return groupName && id && toggleGroup[groupName] && toggleGroup[groupName].identifier === id;
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
		var attrName = attr.edAttrToggle;
		if( !attrName ) { return; }
		if ( wasActive( attr.edAttrToggleGroup, attrName, attr.edAttrToggleId ) ) {
			toggleAttribute();
		}
		element.on('click', toggleAttribute );

		function toggleAttribute () {
			var el = getElement( element, attr ),
				added = toggle( el, attrName );
			if( added ) {
				setActiveGroupItem( attr.edAttrToggleGroup, attrName, el, attr.edAttrToggleId );
			} else {
				removeActiveGroupItem ( attr.edAttrToggleGroup, attrName, el );
			}
		}
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
		var attrName = attr.edAttrAdd;
		if( !attrName ) { return; }
		if ( wasActive( attr.edAttrToggleGroup, attrName, attr.edAttrToggleId ) ) {
			addAttribute();
		}
		element.on('click', addAttribute);

		function addAttribute () {
			var el = getElement( element, attr );
			if( isDefined(el.attr(attrName)) ) { return; }
			el.attr(attrName, '');
			setActiveGroupItem( attr.edAttrToggleGroup, attrName, el, attr.edAttrToggleId );
		}
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
		var attrName = attr.edAttrRemove;
		if( !attrName ) { return; }
		element.on('click', function () {
			var el = getElement( element, attr );
			removeActiveGroupItem ( attr.edAttrToggleGroup, attrName, el );
		});
	}


})();
