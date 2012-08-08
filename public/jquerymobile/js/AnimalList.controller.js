(function() {
	var AnimalList = new myFirstJQMApp.Page('animallist');

	// before the page is even created, kick off the ajax request
	AnimalList.onbeforecreate = function() {
		$.ajax('/api/animals.json', {
			dataType: 'text',
			context: AnimalList,
			success: AnimalList.onfetchsuccess,
			error: AnimalList.onfetcherror
		});
	};

	// a mustache template that renders the list of animals
	AnimalList.template = '<ul data-role="listview">{{#animals}}<li class="animals-li"><a href="#" id="animal-{{id}}"><img src="{{thumb}}" /><h3>{{name}}</h3></a></li>{{/animals}}</ul>';

	// called when we get the data!
	AnimalList.onfetchsuccess = function(data) {
		try {
			data = JSON.parse(data);
			var html = Mustache.render(this.template, { animals: data });
			$('#animallist-content').html(html).trigger('create');
			$('#animallist-content .animals-li a').on('click', function() {
				AnimalList.onclick(this.id.split('-')[1]);
			});
		}
		catch(error) {
			$('#animallist-content').html(error.toString());
		}
	};

	// called when we couldn't get the data!
	AnimalList.onfetcherror = function(jqXHR, textStatus, errorThrown) {
		$('#animallist-content').html(textStatus);
	};

	// called when the user clicks on an animal!
	AnimalList.onclick = function(id) {
		var detailPage = myFirstJQMApp.pages.animaldetail;
		detailPage.setParams({ "id": id });
		myFirstJQMApp.changePage(detailPage);
	};
}());