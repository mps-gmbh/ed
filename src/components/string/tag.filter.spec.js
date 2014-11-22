describe('[string/tag]', function () {
	var $filter, tag;

	beforeEach(module('ed.string'));
	beforeEach( inject( function ( _$filter_, _tagFilter_ ) {
		$filter = _$filter_;
		tag = _tagFilter_;
	}));

	it('should be defined', function() {
		expect(tag).toBeDefined();
		expect(tag).toEqual( jasmine.any(Function) );
	});

	it('should be a filter', function() {
		expect($filter('tag')).toBeDefined();
		expect($filter('tag')).toEqual( jasmine.any(Function) );
	});

	it('shoud add tags to text', function() {
		expect(tag('tag along', 'Tag')).toEqual('[Tag] tag along');
		expect(tag('is my name', 'foo')).toEqual('[foo] is my name');
	});

	it('should return tag from text', function() {
		expect(tag('[Tag] tag along')).toEqual('Tag');
		expect(tag('[foo]is my name')).toEqual('foo');
	});

	it('should return "null" if text has no tag', function() {
		expect(tag('tag along')).toEqual(null);
	});
});
