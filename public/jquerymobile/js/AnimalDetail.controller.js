(function() {
	var AnimalDetail = new myFirstJQMApp.Page('animaldetail');

	// before the page is shown, kick off the ajax request
	AnimalDetail.onbeforeshow = function() {
		var id = this.getParams().id;
		if(id) {
			$.ajax('/api/animals/' + id + '.json', {
				dataType: 'text',
				context: AnimalDetail,
				success: AnimalDetail.onfetchsuccess,
				error: AnimalDetail.onfetcherror
			});
		}
	};

	// called when the page is shown; if there's nothing to display, revert back to the list
	// we can't do this while the transition is in progress so this is the earliest opportunity we have
	AnimalDetail.onshow = function() {
		var id = this.getParams().id;
		if(!id) {
			myFirstJQMApp.changePage(myFirstJQMApp.pages.animallist);
		}
	}

	// a mustache template that renders the animal
	AnimalDetail.template = '<img src="{{img}}" /><h2>{{name}}</h2><p>{{description}}</p>';

	// called when we get the data!
	AnimalDetail.onfetchsuccess = function(data) {
		try {
			data = JSON.parse(data);
			var html = Mustache.render(this.template, data);
			$('#animaldetail-content').html(html).trigger('create');
		}
		catch(error) {
			$('#animaldetail-content').html(error.toString());
		}
	};

	// called when we couldn't get the data!
	AnimalDetail.onfetcherror = function(jqXHR, textStatus, errorThrown) {
		$('#animal-content').html(textStatus);
	};

	// clear the page on hide
	AnimalDetail.onhide = function() {
		$('#animal-content').html('');
	}
}());