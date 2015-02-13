describe('[page/menu-item]', function() {
    var $rootScope, $compile,
    	scope, element;

    beforeEach(module('ed.page'));
    beforeEach(inject(function ( _$rootScope_, _$compile_ ) {
    	$rootScope = _$rootScope_;
    	$compile = _$compile_;

    	scope = $rootScope.$new();
    	element = angular.element('<ed-page-menu-item route="/route">Link Text</ed-page-menu-item>');
    	$compile( element )( scope );
    	scope.$digest();
    }));

    // Compile
    // -------------------------
    describe('Compile', function () {
    	it('should be a custom element', function() {
    		expect(element[0].tagName).toEqual('ED-PAGE-MENU-ITEM');
    		expect(element.contents().length).toBeGreaterThan(0);
    	});

    	it('set [route] as link href', function() {
    		expect(element.find('a').attr('href')).toMatch(element.attr('route'));
    	});

    	it('should transclude inner text', function() {
    		expect(element.find('a').text()).toEqual('Link Text');
    	});
    });


    // Current
    // -------------------------
    describe('Current', function () {
    	var currRoute;

    	beforeEach(function() {
    		currRoute = {
    			$$route: {
    				originalPath: '/route'
    			}
    		};
    	});

    	it('should set [is-current] when route is active', function() {
    		expect(element[0].hasAttribute('is-current')).toBeFalsy();
    		$rootScope.$broadcast('$routeChangeSuccess', currRoute);
    		expect(element[0].hasAttribute('is-current')).toBeTruthy();
    	});

    	it('should remove [is-current] when no longer active route', function() {
      		$rootScope.$broadcast('$routeChangeSuccess', currRoute);

      		currRoute.$$route.originalPath = '/other/route'
      		$rootScope.$broadcast('$routeChangeSuccess', currRoute);
    		expect(element[0].hasAttribute('is-current')).toBeFalsy();
    	});
    });
});
