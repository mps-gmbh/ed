(function () {

	angular.module('ed.event')
		.factory('EventEmitter', EventEmitterFactory);

	var forEach = angular.forEach;

	// Factory
	// -------------------------
	function EventEmitterFactory () {

		function EventEmitter () {
			this._listeners = [];
		}

		EventEmitter.prototype.register = function ( listener ) {
			this._listeners.push(listener);
		};

		EventEmitter.prototype.emit = function ( event, data ) {
			forEach( this._listeners, function ( listener ) {
				listener( event, data );
			});
		};

		return EventEmitter;
	}

})();
