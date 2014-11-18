(function () {

	angular.module('ed.icon')
		.directive('edIcon', IconDirective );

	function IconDirective () {
		return {
			restrict: 'E',
			templateUrl: getTemplate
		};
	}

	function getTemplate ( element, attr ) {
		var MinErr = angular.$$minErr('Icon'),
			urlBase = 'icon/icon-:name.svg';
		if( !attr.name ) {
			throw MinErr( 'missingattr',
				'Expected attribute "name" to be defined, got {0}.',
				attr.name );
		}
		return urlBase.replace(':name', attr.name);
	}

})();
