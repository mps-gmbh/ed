(function () {

	angular.module('ed.page')
		.directive('edPageMenuItem', PageMenuItemElement);

	var ATTR_CURRENT = 'is-current';

	function PageMenuItemElement () {
		function templateFn ( element, attr ) {
			return '<a href="#!' + attr.route + '">' +
				element.text() +
			'</a>';
		}

		function linkFn ( scope, element, attr ) {
			var exp = new RegExp('^' + attr.route + '$');
			scope.$on('$routeChangeSuccess', function ( ev, current ) {
				console.log(current.$$route.originalPath);
				if( exp.test(current.$$route.originalPath) ) {
					element.attr(ATTR_CURRENT, '');
				} else {
					element.removeAttr(ATTR_CURRENT);
				}
			});
		}

		// DDP
		return {
			restrict: 'E',
			template: templateFn,
			link: linkFn
		};
	}

})();
