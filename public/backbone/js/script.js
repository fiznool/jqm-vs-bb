(function() {

  // Setup mustache-style templating
  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
  };

  // Animal Details page is a self-contained module
  var AnimalDetail = (function() {

    var Model = Backbone.Model.extend({
      url: function() {
        return '/api/animals/' + this.get('id') + '.json';
      }
    });

    return Backbone.View.extend({

      className: 'detail',

      template: _.template(
        '<img src="{{ img }}" />' +
        '<h1>{{ name }}</h1>' +
        '<p>{{ description }}</p>'),

      initialize: function(options) {
        this.model = new Model({ id: options.id });
        this.bindTo(this.model, 'change', this.render);
        this.model.fetch();
      },

      render: function() {
        this.$el.html(this.template(this.model.toJSON()));
      }

    });

  })();

  // Animals List page is a self-contained module
  // It consists of two parts: a master view (ul)
  // and individual subview items (li)
  var AnimalList = (function() {

    var Item = (function() {

      var Model = Backbone.Model.extend({});

      return Backbone.View.extend({

        tagName: 'li',

        template: _.template('<a href="#!/animals/{{ id }}">{{ name }}</a>'),

        initialize: function(options) {
          this.model = new Model(options.data);
        },

        render: function() {
          this.$el.html(this.template(this.model.toJSON()));
          return this;
        }

      });

    })();

    var List = (function() {

      var Model = Backbone.Model.extend({});

      var Collection = Backbone.Collection.extend({
        model: Model,
        url: '/api/animals.json'
      });

      return Backbone.View.extend({

        tagName: 'ul',

        collection: new Collection(),

        initialize: function(options) {
          this.bindTo(this.collection, 'reset', this.render);
          this.collection.fetch();
        },

        render: function() {
          this.collection.each(this.addOne, this);
        },

        addOne: function(model) {
          var item = new Item({ data: model });
          item.render();
          this.$el.append(item.el);
          this.addChild(item);
        }

      });

    })();

    return List;

  })();

  // Route the list and detail views
  var Router = Backbone.Router.extend({

    routes: {
      "!/animals": "showAnimalsList",
      "!/animals/:id": "showAnimalDetails",
      "*actions": "showAnimalsList"
    },

    initialize: function(options) {
      // Set a base container view
      // Router will use this as wrapper for
      // all views
      this.$container = options.$container;
    },

    showAnimalsList: function() {
      this.changeView(
        new AnimalList());
    },

    showAnimalDetails: function(id) {
      this.changeView(
        new AnimalDetail({ id: id }));
    },

    changeView: function(view) {
      // Clean up an existing view by calling dispose().
      // This frees up memory by unbinding any events
      // which were previously bound with boundTo().
      // See backbone-zombienation.js
      if (this.currentView) {
        this.currentView.dispose();
      }

      // Switch out DOM element on container
      this.$container.html(view.el);

      // Store current view so we can dispose it later
      this.currentView = view;
    }

  });

  // Most stuff can happen before DOM is ready
  $(function() {
    var router = new Router({
      $container: $('#main')
    });

    Backbone.history.start();

  });

})();