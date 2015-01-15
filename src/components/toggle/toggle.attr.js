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
		var attrName = attr.edToggleAttr;
		if( !attrName ) { return; }
		if ( wasActive( attr.edToggleAttrGroup, attrName, attr.edToggleAttrId ) ) {
			toggleAttribute();
		}
		element.on('click', toggleAttribute );

		function toggleAttribute () {
			var el = getElement( element, attr ),
				added = toggle( el, attrName );
			if( added ) {
				setActiveGroupItem( attr.edToggleAttrGroup, attrName, el, attr.edToggleAttrId );
			} else {
				removeActiveGroupItem ( attr.edToggleAttrGroup, attrName, el );
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
		var attrName = attr.edAddAttr;
		if( !attrName ) { return; }
		if ( wasActive( attr.edToggleAttrGroup, attrName, attr.edToggleAttrId ) ) {
			addAttribute();
		}
		element.on('click', addAttribute);

		function addAttribute () {
			var el = getElement( element, attr );
			if( isDefined(el.attr(attrName)) ) { return; }
			el.attr(attrName, '');
			setActiveGroupItem( attr.edToggleAttrGroup, attrName, el, attr.edToggleAttrId );
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
		var attrName = attr.edRemoveAttr;
		if( !attrName ) { return; }
		element.on('click', function () {
			var el = getElement( element, attr );
			removeActiveGroupItem ( attr.edToggleAttrGroup, attrName, el );
		});
	}


})();
