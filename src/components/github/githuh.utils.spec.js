describe('[github/utils]', function () {
	var utils;

	beforeEach(module('ed.github'));
	beforeEach( inject( function ( _GithubUtils_ ) {
		utils = _GithubUtils_;
	}));


	// Request Helper
	// -------------------------
	describe('Request Helper', function () {
		it('should expose a `request` namespace', function() {
			expect(utils.request).toEqual( jasmine.any(Object) );
		});

		it('should expose a method to create an auth header', function() {
			expect(utils.request.createAuthHeader).toEqual( jasmine.any(Function) );
		});

		it('should be possible to create an auth header', function() {
			expect(utils.request.createAuthHeader('123')).toEqual({
				headers: { 'Authorization': 'token 123'	}
			});
		});

		it('should return an empty object if no token was passed', function() {
			expect(utils.request.createAuthHeader()).toEqual({});
		});

		it('should expose a method to create HTTP configuration', function() {
			expect(utils.request.createHttpConfig).toEqual( jasmine.any(Function) );
		});

		it('should be possible to create HTTP configuration', function() {
			var conf;

			conf = utils.request.createHttpConfig( null );
			expect(conf).toEqual({ params : {} });

			conf = utils.request.createHttpConfig( '123' );
			expect(conf).toEqual({ headers : { Authorization : 'token 123' }, params : {} });

			conf = utils.request.createHttpConfig( null, { foo: 'bar' } );
			expect(conf).toEqual({ params : { foo: 'bar' } });

			conf = utils.request.createHttpConfig( '123', { foo: 'bar' } );
			expect(conf).toEqual({ headers : { Authorization : 'token 123' }, params : { foo: 'bar' } });
		});

		it('should throw if passed `filter` is not an object', function() {
			expect(function () {
				utils.request.createHttpConfig( null, 'foo' );
			}).toThrow();
			expect(function () {
				utils.request.createHttpConfig( null, null );
			}).toThrow();
		});
	});


	// Response Helper
	// -------------------------
	describe('Response Helper', function () {
		it('should expose a `response` namespace', function() {
			expect(utils.response).toEqual( jasmine.any(Object) );
		});

		it('should expose a method to unwrap response', function() {
			expect(utils.response.unwrap).toEqual( jasmine.any(Function) );
		});

		it('should unwrap reponse', function() {
			expect(utils.response.unwrap({ data: 'foo' })).toEqual('foo');
			expect(utils.response.unwrap({ data: { title: 'Milestone'} })).toEqual({ title: 'Milestone'});
			expect(utils.response.unwrap({})).toEqual(undefined);
		});

		it('should expose a method to shallow copy an object and clear other fields from the destination', function() {
			expect(utils.response.shallowClearAndCopy).toEqual( jasmine.any(Function) );
		});

		it('should be possible to shallow copy an object and clear other fields from the destination', function() {
			var dst = {
					title: 'My title',
					number: 1,
					description: 'This could be some long text!'
				},
				src = {
					title: 'New title'
				};
			expect(utils.response.shallowClearAndCopy( dst, src )).toEqual(src);
		});

		it('should keep properties prefixed with "_"', function() {
			var dst = {
					_private: 'keep me!',
					_foo: 'me too!',
					title: 'My title',
					number: 1,
					description: 'This could be some long text!'
				},
				src = {
					title: 'New title'
				},
				result = {
					_private: 'keep me!',
					_foo: 'me too!',
					title: 'New title'
				};
			expect(utils.response.shallowClearAndCopy( dst, src )).toEqual(result);
		});

		it('should not overwrite properties prefixed with "_"', function() {
			var dst = {
					_private: 'keep me!',
					_foo: 'me too!',
					title: 'My title',
					number: 1,
					description: 'This could be some long text!'
				},
				src = {
					_private: 'overwrite',
					title: 'New title'
				},
				result = {
					_private: 'keep me!',
					_foo: 'me too!',
					title: 'New title'
				};
			expect(utils.response.shallowClearAndCopy( dst, src )).toEqual(result);
		});

		it('should not throw an errir if destination is `undefined` or `null`', function() {
			var src = {
					title: 'New title'
				};
			expect(utils.response.shallowClearAndCopy( undefined, src )).toEqual(src);
			expect(utils.response.shallowClearAndCopy( null, src )).toEqual(src);
		});
	});

});
