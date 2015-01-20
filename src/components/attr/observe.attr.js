(function () {

	angular.module('ed.attr.observe')
		.directive('edAttrObserve', AttrObserveDirective);


	// Helpers
	// -------------------------
	var MinErr = angular.$$minErr('AttrObserveDirective'),
		isFunction = angular.isFunction,
		isUndefined = angular.isUndefined,
		isObject = angular.isObject,
		forEach = angular.forEach;

	function getMutationAction ( newValue, oldValue ) {
		if( oldValue === null ) {
			return 'addedAttribute';
		}
		if( isUndefined(newValue) ) {
			return 'removedAttribute';
		}
		return 'updatedAttributed';
	}


	// Attribute Observer
	// -------------------------
	AttrObserveDirective.$inject = [ '$log' ];
	function AttrObserveDirective ( $log ) {

		// Link
		function AttrObserveLink ( scope, element, attr ) {
			if( !isFunction(MutationObserver) ) {
				$log.debug(
					'The `ed-attr-observe` directive uses MutationObserver.\n' +
					'Your browser seems not to support them :('
				);
				return;
			}
			if( isUndefined(attr.edAttrObserve) ) {
				throw MinErr( 'badcfg',
					'Expected a map of attributes to observe, got {0}.',
					attr.edAttrObserve );
			}

			var callbacks = scope.$eval(attr.edAttrObserve),
				observer = new MutationObserver(observerCallback),
				options = {
					subtree: false,
					childList: false,
					attributes: true,
					attributeOldValue: true
				};

			if( !isObject(callbacks) ) {
				throw MinErr('badargs',
					'Expected `ed-attr-observe` attribute value to be a map with ' +
					'attribute names as keys and callback functions as values, got {0}.',
					attr.edAttrObserve );
			}

			// Observe + Callback
			options.attributeFilter = Object.keys(callbacks);
			observer.observe( element[0], options );
			function observerCallback ( mutations ) {
				forEach( mutations, function ( mutant ) {
					var cb = callbacks[mutant.attributeName];
					if( !isFunction(cb) ) {
						throw MinErr('badargs',
							'Expected callback to be a function, got {0}.\n' +
							'Please make sure that the map specified in `ed-attr-observe` attribute ' +
							'has functions as values.',
							typeof cb );
					}
					cb( mutant.attributeName,
						element.attr(mutant.attributeName),
						element,
						getMutationAction(element.attr(mutant.attributeName), mutant.oldValue)
					);
				});
			}
		}

		// DOO
		return {
			restrict: 'A',
			link: AttrObserveLink
		};
	}

})();
