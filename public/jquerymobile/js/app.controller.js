window.myFirstJQMApp = (function() {

	// set up a map which will contain all of the pages within the app
	var pages = {};

	// set up a class which all our page controllers will be instances of
	var Page = function(id) {
		pages[id] = this;
		this.id = id;

		// bind the page events
		var $el = $('#' + this.id);
		var that = this;
		$el.live('pagebeforecreate', function(event) {
			that.onbeforecreate(event);
		});
		$el.live('pagecreate', function(event) {
			that.oncreate(event);
		});
		$el.live('pageinit', function(event) {
			that.oninit(event);
		});
		$el.live('pageremove', function(event) {
			that.onremove(event);
		});
		$el.live('pagebeforeshow', function(event) {
			that.onbeforeshow(event);
		});
		$el.live('pageshow', function(event) {
			that.onshow(event);
		});
		$el.live('pagebeforehide', function(event) {
			that.onbeforehide(event);
		});
		$el.live('pagehide', function(event) {
			that.onhide(event);
		});
	};

	// set up some stubs for page events
	Page.prototype.onbeforecreate = function(event){};
	Page.prototype.oncreate = function(event){};
	Page.prototype.oninit = function(event){};
	Page.prototype.onremove = function(event){};
	Page.prototype.onbeforeshow = function(event){};
	Page.prototype.onshow = function(event){};
	Page.prototype.onbeforehide = function(event){};
	Page.prototype.onhide = function(event){};

	// set up some helpers for passing data between our pages
	Page.prototype.setParams = function(params) {
		this.params = params;
	}
	Page.prototype.getParams = function() {
		return this.params || {};
	}

	// set up a proxy for $.mobile.changePage which lets us pass a Page
	var changePage = function(page, options) {
		$.mobile.changePage('#' + page.id, options);
	}

	// expose the things that we just set up
	return {
		changePage: changePage,
		Page: Page,
		pages: pages
	}
}());