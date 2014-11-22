describe('[string/untag]', function () {
	var $filter, untag;

	beforeEach(module('ed.string'));
	beforeEach( inject( function ( _$filter_, _untagFilter_ ) {
		$filter = _$filter_;
		untag = _untagFilter_;
	}));

	it('should be defined', function() {
		expect(untag).toBeDefined();
		expect(untag).toEqual( jasmine.any(Function) );
	});

	it('should be a filter', function() {
		expect($filter('untag')).toBeDefined();
		expect($filter('untag')).toEqual( jasmine.any(Function) );
	});

	it('shoud remove tags from text', function() {
		expect(untag('[Tag] tag along')).toEqual('tag along');
		expect(untag('[foo]is my name')).toEqual('is my name');

		expect(untag('this is some text w/o a tag')).toEqual('this is some text w/o a tag');
	});

	it('should only remove tags at the start of the text', function() {
		expect(untag('tag [Tag] along')).toEqual('tag [Tag] along');
		expect(untag('[remove] this but not [this]')).toEqual('this but not [this]');
	});
});
