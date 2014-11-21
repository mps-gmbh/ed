(function () {

	angular.module('ed.time')
		.directive('time', IsRelativeDirective );


	// Helpers
	// -------------------------
	var MinErr = angular.$$minErr('IsRelativeDirective'),
		isUndefined = angular.isUndefined,
		bind = angular.bind;

	// RegEx is a slightly modifierd version from https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime#answer-3143231
	// TODO: create a date utils (or use internal date utils service).
	function isISODate ( dt ) {
		return /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)/.test(dt);
	}


	// Directive
	// -------------------------
	IsRelativeDirective.$inject = ['$window', '$timeout'];
	function IsRelativeDirective ( $window, $timeout ) {
		var moment = $window.moment;
		if( !moment ) {
			throw MinErr('badcfg',
				'Expected "momentjs" to be defined, got {0}.' +
				'Maybe you forgot to load the it!',
				moment );
		}

		// Link
		function IsRelativeLinkFn ( scope, element, attr ) {
			var timer;

			// Since we only want to add logic to `time[is-reative]`
			// elements we check if the attribute is specified.
			// If not, we do nothing.
			if( isUndefined(attr.isRelative) ) { return; }
			if( isUndefined(attr.dateTime) ) {
				throw MinErr('msgargs',
					'Expected [date-time] to be defined, got {0}.\n' +
					'Please set [date-time] in order to use the ' +
					'[is-relative] directive.',
					attr.dateTime );
			}

			// We only want to compile `time[is-reative]`, but
			// binding to `dateTime` when Angular creates the
			// isolated scope will not work if the want to use
			// the `<time>` element without any additional
			// bindings.
			// -> bind the attribute later. Now actually!
			attr.$observe('dateTime', updateDateTime);

			function updateDateTime ( dt ) {
				if(timer) {
					$timeout.cancel(timer);
					timer = null;
				}
				// NOTE: If `datetime` is not a valid ISO date
				// we aren't scheduling any updates. The updates
				// will start again as soon as a valid `datetime`
				// is passed via `$observe`.
				if( !isISODate(dt) ) {
					element.html('');
					return;
				}

				element.html(moment(dt).fromNow());
				var diff = Math.abs(moment().diff(dt, 'm')),
					nextUpdateIn;

				if( diff < 1 ) { nextUpdateIn = 1; }				// less than a minute 	-> 1s
				else if( diff < 60 ) { nextUpdateIn = 30; }			// less than 60min 		-> 30s
				else if( diff < 180 ) { nextUpdateIn = 300; }		// less than 180min 	-> 5min
				else if( diff < 43200 ) { nextUpdateIn = 3600; }	// less than 30days		-> 60min
																	// otherwhise we won't schedule an update
				if( nextUpdateIn ) {
					timer = $timeout(
						bind(null, updateDateTime, dt),
						nextUpdateIn * 1000);
				}
			}
		}

		// DDO
		return {
			restrict: 'E',
			scope: {},
			link: IsRelativeLinkFn
		};
	}

})();
