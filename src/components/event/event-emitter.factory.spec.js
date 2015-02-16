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
			expect(ee._listeners).toEqual({});
		});
	});

	// ListenTo
	// -------------------------
	describe('ListenTo', function () {
		var ee;

		beforeEach(function() {
			ee = new EventEmitter();
		});

		it('should expose a registration method', function() {
			expect(ee.listenTo).toEqual(jasmine.any(Function));
		});

		it('should be possible to register for a event', function() {
			var listener = angular.noop;

			ee.listenTo('ev.foo', listener);
			expect(ee._listeners['ev.foo'].length).toEqual(1);
			expect(ee._listeners['ev.foo'][0]).toEqual(listener);
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

		it('should call listenToed listeners with "event" and "data"', function() {
			var listener = jasmine.createSpy('listener'),
				data = { addtitional: 'information' };
			ee.listenTo('ev.foo', listener);

			ee.emit('ev.foo', data);
			expect(listener).toHaveBeenCalledWith('ev.foo', data);
		});
	});
});
