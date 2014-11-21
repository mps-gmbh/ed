/* global moment */
describe('[issue/attr]', function () {
	var $rootScope, $compile, $timeout,
		scope, element;

	beforeEach(module('ed.time'));
	beforeEach(module('ed.template.components'));
	beforeEach( inject( function ( _$rootScope_, _$compile_, _$timeout_ ) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;
		$timeout = _$timeout_;

		scope = $rootScope.$new();
	}));


	// Helper
	// -------------------------
	function compileTimeElement ( dt ) {
		element = angular.element('<time date-time="'+dt+'" is-relative></time>');
		$compile( element )( scope );
		$rootScope.$digest();
	}


	// Initialization
	// -------------------------
	describe('Initialization', function () {
		beforeEach(function() {
			element = angular.element('<time date-time="2013-02-04T22:44:30.652Z" is-relative></time>');
			$compile( element )( scope );
		});

		it('should compile custom attribute', function () {
			expect(function () { $rootScope.$digest(); }).not.toThrow();
		});

		it('should init an isolate scope', function() {
			expect(element.isolateScope()).toBeDefined();
		});

		it('should not throw if no [is-relative] was found', function() {
			expect(function () {
				element = angular.element('<time date-time="2013-02-04T22:44:30.652Z"></time>');
				$compile( element )( scope );
				$rootScope.$digest();
			}).not.toThrow();
		});

		it('should throw if [date-time] is missing', function() {
			expect(function () {
				element = angular.element('<time is-relative></time>');
				$compile( element )( scope );
				$rootScope.$digest();
			}).toThrow();
		});

		it('should not throw is [date-time] is empty', function() {
			expect(function () {
				element = angular.element('<time date-time="" is-relative></time>');
				$compile( element )( scope );
				$rootScope.$digest();
			}).not.toThrow();
		});
	});


	// Display
	// -------------------------
	describe('Display', function () {
		var dt;

		it('should display relative time', function() {
			dt = '2013-02-04T22:44:30.652Z';
			compileTimeElement(dt);
			expect(element.text()).toEqual(moment(dt).fromNow());

			dt = moment().format();
			compileTimeElement(dt);
			expect(element.text()).toEqual(moment(dt).fromNow());
		});

		it('should display nothing if [date-time] is invalid or empty', function() {
			compileTimeElement('');
			expect(element.text()).toEqual('');

			compileTimeElement('mfg');
			expect(element.text()).toEqual('');
		});
	});


	// Binding
	// -------------------------
	describe('Binding', function () {
		it('should be possible to bind model', function() {
			scope.dt = '2013-02-04T22:44:30.652Z';
			compileTimeElement('{{ dt }}');
			expect(element.text()).toEqual(moment(scope.dt).fromNow());
		});

		it('should subscribe to model updates', function() {
			var startDt = '2013-02-04T22:44:30.652Z';
			scope.dt = startDt;
			compileTimeElement('{{ dt }}');
			expect(element.text()).toEqual(moment(scope.dt).fromNow());

			scope.dt = moment().add(2, 'M').format();
			scope.$digest();

			expect(element.text()).toEqual(moment(scope.dt).fromNow());
			expect(element.text()).not.toEqual(startDt);
		});
	});


	// Updates
	// -------------------------
	describe('Updates', function () {
		it('should have an updated scheduled if [date-time] is now', function() {
			compileTimeElement(moment().format());
			expect(function () {
				$timeout.flush();
			}).not.toThrow();
		});

		it('should have an updated scheduled if [date-time] is less than 60 minute ago', function() {
			compileTimeElement(moment().subtract(59, 'm').format());
			expect(function () {
				$timeout.flush();
			}).not.toThrow();
		});

		it('should have an updated scheduled if [date-time] is in 60 minute', function() {
			compileTimeElement(moment().add(60, 'm').format());
			expect(function () {
				$timeout.flush();
			}).not.toThrow();
		});

		it('should have an updated scheduled if [date-time] is less than 180 minute ago', function() {
			compileTimeElement(moment().subtract(179, 'm').format());
			expect(function () {
				$timeout.flush();
			}).not.toThrow();
		});

		it('should have an updated scheduled if [date-time] is in 180 minute', function() {
			compileTimeElement(moment().add(180, 'm').format());
			expect(function () {
				$timeout.flush();
			}).not.toThrow();
		});

		it('should have an updated scheduled if [date-time] is less than 30 days ago', function() {
			compileTimeElement(moment().subtract(29, 'd').format());
			expect(function () {
				$timeout.flush();
			}).not.toThrow();

			compileTimeElement(moment().subtract(12, 'd').format());
			expect(function () {
				$timeout.flush();
			}).not.toThrow();
		});

		it('should have an updated scheduled if [date-time] is in 30 days', function() {
			compileTimeElement(moment().add(30, 'd').format());
			expect(function () {
				$timeout.flush();
			}).not.toThrow();

			compileTimeElement(moment().add(16, 'd').format());
			expect(function () {
				$timeout.flush();
			}).not.toThrow();
		});

		it('should not have scheduled an update if [date-time] offset is +/- 30 days', function() {
			var dt;
			spyOn( window, 'moment' ).and.callThrough();

			dt = moment().subtract(31, 'd').format();
			compileTimeElement(dt);
			$timeout.flush();
			expect(window.moment).toHaveBeenCalledWith(dt);

			dt = moment().add(31, 'd').format();
			compileTimeElement(dt);
			$timeout.flush();
			expect(window.moment).toHaveBeenCalledWith(dt);

			// Note: Somehow `$observe` also adds a timer to `$timeout`. Thus
			// `$timeout.verifyNoPendingTasks()` will through an error, even
			// if `$timeout` was never alled inside our directive.
			//
			// The following test is proof that the above works.
			// ... still feels flaky.
			dt = moment().subtract(30, 'd').format();
			compileTimeElement(dt);
			$timeout.flush();
			expect(window.moment).toHaveBeenCalledWith(dt);

			dt = moment().add(30, 'd').format();
			compileTimeElement(dt);
			$timeout.flush();
			expect(window.moment).toHaveBeenCalledWith(dt);
		});
	});
});

describe('[issue/attr]', function () {
	var $rootScope, $compile, $window,
		scope, element;

	beforeEach(module('ed.time'));
	beforeEach(module('ed.template.components'));
	beforeEach( inject( function ( _$rootScope_, _$compile_, _$window_ ) {
		$rootScope = _$rootScope_;
		$compile = _$compile_;
		$window = _$window_;

		$window.moment = undefined;
		scope = $rootScope.$new();
	}));

	// Initialization
	// -------------------------
	describe('Initialization', function () {
		it('should throw an error if `moments` is not loaded', function() {
			expect(function () {
				element = angular.element('<time date-time="2013-02-04T22:44:30.652Z" is-relative></time>');
				$compile( element )( scope );
			}).toThrow();
		});
	});
});
