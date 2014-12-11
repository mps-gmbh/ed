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
