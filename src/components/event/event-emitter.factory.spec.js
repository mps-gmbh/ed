describe('[event/emitter]', function() {
	var EventEmitter;

	beforeEach(module('ed.event'));
	beforeEach(inject( function ( _EventEmitter_ ) {
		EventEmitter = _EventEmitter_;
   	}));

	it('should be a factory', function() {
		expect(EventEmitter).toEqual(jasmine.any(Function));
	});

	// Instantiate
	// -------------------------
	describe('Instantiate', function () {
		var ee;

		beforeEach(function() {
			ee = new EventEmitter();
		});

		it('should instaniate with empty listeners', function() {
			expect(ee._listeners).toEqual([]);
		});
	});

	// Register
	// -------------------------
	describe('Register', function () {
		var ee;

		beforeEach(function() {
			ee = new EventEmitter();
		});

		it('should expose a registration method', function() {
			expect(ee.register).toEqual(jasmine.any(Function));
		});

		it('should be possible to register a new listener', function() {
			var listener = angular.noop;

			ee.register(listener);
			expect(ee._listeners.length).toEqual(1);
			expect(ee._listeners[0]).toEqual(listener);
		});
	});


	// Emit
	// -------------------------
	describe('Emit', function () {
		var ee;

		beforeEach(function() {
			ee = new EventEmitter();
		});

		it('should expose a emit method', function() {
			expect(ee.emit).toEqual(jasmine.any(Function));
		});

		it('should call registered listeners with "event" and "data"', function() {
			var listener = jasmine.createSpy('listener'),
				data = { addtitional: 'information' };
			ee.register(listener);

			ee.emit('eventName', data);
			expect(listener).toHaveBeenCalledWith('eventName', data);
		});
	});
});
