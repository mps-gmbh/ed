(function () {

	angular.module('ed.event')
		.factory('EventEmitter', EventEmitterFactory);

	var forEach = angular.forEach;

	// Factory
	// -------------------------
	function EventEmitterFactory () {

		function EventEmitter () {
			this._listeners = {};
		}

		EventEmitter.prototype.listenTo = function ( event, listener ) {
			if( !this._listeners[event] ) {
				this._listeners[event] = [];
			}
			this._listeners[event].push(listener);
		};

		EventEmitter.prototype.emit = function ( event, data ) {
			if( this._listeners[event] ) {
				forEach( this._listeners[event], function ( listener ) {
					listener( event, data );
				});
			}
		};

		return EventEmitter;
	}

})();
