Backbone: lightweight library for MVC/MV* kind of framework
- backbonejs.org, uses Underscore.js for utility functions
- Views are like controllers in MVC, so more like MV*
- Routers for SPA, works with building rich-client app over set of REST APIs

Backbone components:
- events: to add an object the ability to pub/sub events
- models: application data
- collections: set of models
- views: to render models and listen for DOM/model events
- routers: to create SPA

Models:
- containers for application data

// Sample Backbone model
var Song = Backbone.Model.extend({
	initialize: function() {
		console.log('A new song has been created.');
	}
});

var song = new Song();
// Has attributes such as changed, attributes, cid, etc.

var Song = Backbone.Model.extend();
var song = new Song();

// Setting attributes object properties
song.set('title', 'Hello darkness');
song.set({
	artist: 'Pogs',
	publishYear: 2017
});
// can convert it to JSON representation by doing song.toJSON();

var newSong = new Song({ title: 'Alala' });
// To get an attribute value
newSong.get('title');

// To remove an attribute
song.unset('title');

// To clear all attributes
song.clear();

// To see if it has a given attribute
song.has('title');

// Setting default properties in model
var Song = Backbone.Model.extend({
	defaults: {
		genre: 'Jazz'
	}
});

/* Working with attributes: set, get, has, unset, clear */

// Validation
var Song = Backbone.Model.extend({
	validate: function(attrs) {
		if (!attrs.title) { return "Title is required"; }

	}
});

var song = new Song();

// Checks if attributes are validated 
song.isValid();

// Gives validation error message
var lastError = song.validationError;

/* Inheritance */
var Animal = Backbone.Model.extend({
	walk: function() {
		console.log("Animal walking...");
	}
});

var Dog = Animal.extend({
	walk: function() {
		// To call the super walk function
		Animal.prototype.walk.apply(this);

		console.log("Dog walking...");
	}
});

var dog = new Dog();
dog.walk();

/* Connecting to the server */
Persistent operations such as fetch() - GET
save() - POST/PUT
destroy() - DELETE

i.e. gotta set the urlRoot: '/api/songs' before updating
var Song = Backbone.Model.extend({
	idAttribute: 'songId'
});
var song = new Song({ songId: 1 });

// Or destroy
song.fetch({
	success: function() {},
	error: function() {}
});

// First arg is hash of attributes to set and save
song.save({}, {
	success: function() {},
	error: function() {}
});

// Updating a model, PUT /api/songs/1
var song = newn Song({ id: 1 });
song.fetch();
...
song.set('title', 'newTitle');
song.save();

// Inserting a model POST /api/songs
var song = new Song();
song.set('title', 'newTitle');
song.save();

// Deleting a model DELETE /api/songs/1
var song = new Song({ id: 1 });
song.destroy();


Collections: ordered set of models, have length and models property array

// Example of setting up a collection
var Song = Backbone.Model.extend();
var Songs = Backbone.Collection.extend({
	model: Song
});

var songs = new Songs([
	new Song({ title: 'Song 1' }),
	new Song({ title: 'Song 2' })
]); 

// Provided by underscore for these methods
songs.add(new Song({ title: 'Song 3'}));
songs.at(0); // cid of c1, client id to keep track of objects
songs.get("c1");
songs.remove(songs.at(0));
songs.length;

// Can specify index where you want to insert model
songs.add(new Song({ title: 'Song 4'}), { at: 0 });

// Adding to the end
songs.push(new Song({ title: 'Song 5' }));

// Removing from the end
song.pop();

// Returns an array of those matching attributes, equality comparison
var thirdSong = songs.where({ title: 'Song 3' });

// Returns first instance matching attributes
songs.findWhere({ title: 'Song 2' });

// Custom filtering with predicate function
var topDownloads = songs.filter(function(song) {
	return song.get('downloads') > 100;
});

// To loop through each of the items in collection
songs.each(function(song) {
	console.log(song);
});

/* Connecting to the server with collections */
// GET /api/songs
var Songs = Backbone.Collection.extend({
	model: Song,
	url: '/api/songs'
});

var songs = new Songs();
// GET /api/songs?page=2
songs.fetch({
	data: {
		page: 2
	},
	success: function() {},
	error: function() {}
});


Views: responsible for rendering the content, handling model and DOM events
- more like controllers, have a DOM element
/* Creating Views */
var SongView = Backbone.View.extend({
	render: function() {
		this.$el.html("Hello world");

		return this;
	}
});

var songView = new SongView({ el: '#container' });
songView.render();

// $('#container').html(songView.$el); by default an empty div
// Can specify your own tag, class, attributes, etc.
var SongView = Backbone.View.extend({
	tagName: 'span',
	className: 'song',
	id: '1234',
	attributes: {
		'data-genre': 'Jazz'
	},
	render: function() {
		this.$el.html('Hello world');

		return this;
	}
});

var songView = new SongView();
songView.render();
// $('#container').html(songView.render().$el);

/* Passing data to views */

// Passing a model to a view
var Song = Backbone.Model.extend();

// Passing a collection to a view
var Songs = Backbone.Collection.extend({
	model: Song
});

var SongView = Backbone.View.extend({
	render: function() {
		this.$el.html(this.model.get('title'));

		return this;
	}
});

var SongsView = Backbone.View.extend({
	render: function() {
		var self = this;

		this.model.each(function(song) {
			var songView = new SongView({ model: song });
			self.$el.append(songView.render().$el);
		});
	}
});

var song = new Song({ title: 'Blue in Green' });

var songs = new Songs([
	new Song({ title: 'Blue in Green' }),
	new Song({ title: 'So what' }),
	new Song({ title: 'All Blues' })
]);

var songView = new SongView({ el: '#container', model: song });
songView.render();

var songsView = new SongsView({ el: '#container', model: songs });
songsView.render();

/* Handling DOM events */
var Song = Backbone.Model.extend();

var SongView = Backbone.View.extend({
	events: {
		'click': 'onClick',
		'click .bookmark': 'onClickBookmark'
	},

	onClick: function() {
		console.log('Listen clicked');
	},

	onClickBookmark: function() {
		e.stopPropagation();

		console.log('Bookmark clicked');
	},

	render: function() {
		this.$el.html(this.model.get('title') + ' <button>Listen</button> <button class="bookmark">Bookmark</button>');

		return this;
	}
});

var song = new Song({ title: 'Blue in Green' });
var songView = new SongBiew({ el: '#container', model: song });
songView.render();

/* Handling model events */
Real-time notifications:
- polling (client keeps asking the server, costly as app grows)
- pushing (server tells the client)

var Song = Backbone.Model.extend({
	defaults: {
		listeners: 0
	}
});

var SongView = Backbone.View.extend({
	initialize: function() {
		// All models publish change event when one of attributes change
		// say when you use .set() on model, third parameter sets the context
		this.model.on('change', this.onModelChange, this);
	},

	onModelChange: function() {	
		this.$el.addClass('someClass');
	},

	render: function() {
		this.$el.html(this.model.get('title') + ' - Listeners: ' + this.model.get('listeners'));

		return this;
	}
});

var song = new Song({ title: 'Blue in Green' });

var songView = new SongView({ el: '#container', model: song });
songView.render();

song.set('listeners', 1);

/* Handling collection events */
var Song = Backbone.Model.extend();

var Songs = Backbone.Collection.extend({
	model: Song
});

var SongView = Backbone.View.extend({
	tagName: 'li',

	render: function() {
		this.$el.html(this.model.get('title'));
		this.$el.attr('id', this.model.id);

		return this;
	}
});

var SongsView = Backbone.View.extend({
	tagname: 'ul',

	initialize: function() {
		// Adding song to songs collection
		this.model.on('add', this.onSongAdded, this);
		// Removing song from songs collection
		this.model.on('remove', this.onSongRemoved, this);s
	},

	onSongAdded: function(song) {
		var songView = new SongView({ model: song });

		this.$el.append(songView.render().$el);
	},

	onSongRemoved: function(song) {
		// this.$el.find('li#'+ song.id).remove();
		this.$('li#' + song.id).remove();
	},

	render: function() {
		var self = this;

		this.model.each(function(song) {
			var songView = new SongView({ model: song });
			self.$el.append(songView.render().$el);
		});
	}
});

var songs = new Songs([
	new Song({ id: 1, title:  'Song 1'}),
	new Song({ id: 2, title: 'Song 2' })
]);

var songsView = new SongsView({ el: '#songs', model: songs });
songsView.render();

/* Templating like with UnderscoreJS/MustacheJS/HandlebarsJS */
var Song = Backbone.Model.extend();

var SongView = Backbone.View.extend({
	render: function() {
		var template = _.template($('#songTemplate').html());
		var html = template(this.model.toJSON());
		this.$el.html(html);

		return this;
	}
});

var song = new Song({ title: 'Blue in Green', plays: 101 });

var songView = new SongView({ el: '#container', model: song });
songView.render();

// UnderscoreJS templating support, compiles markup with template function and passing in model data, give id to look up templates
// <script id="songTemplate" type="text/html">
//	<%= title %>
//	<button>Listen</button>
// 	<% if (plays > 1000) { %>
		<span class="popular">Popular</span>
//  <% } %>
// </script


Events:
/* Binding and triggering custom events */

var person = {
	name: 'Mosh',

	walk: function() {
		// Trigger to publish events
		this.trigger('walking', {
			speed: 1,
			startTime: '08:00'
		});
	}
};

// Backbone events
_.extend(person, Backbone.Events);

// Subscribe to walking events
person.on('walking', function(e) {
	console.log('Person is walking');
	console.log('Event args', e);
});

// To unsubscribe from events
person.off('walking');

person.walk();

/* Creating an event aggregator to coordinate multiple views */
- So not directly coupled, can listen to multiple events for multiple views to communicate

// VenueView doesn't directly know MapView, on click of venue, update MapView by passing model of current VenueView to get title
var Venue = Backbone.Model.extend();
var Venues = Backbone.Collection.extend({
	model: Venue
});

var VenueView = Backbone.View.extend({
	tagName: 'li',

	initialize: function(options) {
		this.bus = options.bus;
	},

	events: {
		'click': 'onClick'
	},

	onClick: function() {
		this.bus.trigger('venueSelected', this.model);
	},

	render: function() {
		this.$el.html(this.model.get('name'));

		return this;
	}
});

var VenuesView = Backbone.View.extend({
		tagName: 'ul',

		id: 'venues',

		// Need a reference to bus to communicate with MapView
		initialize: function(options) {
			this.bus = options.bus;
		},

		render: function() {
			var self = this;

			this.model.each(function(venue) {
				var view = new VenueView({ model: venue, bus: self.bus });
				self.$el.append(view.render().$el);
			});
		}
});

var MapView = Backbone.View.extend({
	el: '#map-container',

	initialize: function(options) {
		this.bus = options.bus;

		this.bus.on('venueSelected', this.onVenueSelected, this);
	},

	onVenueSelected: function(venue) {
		this.model = venue;
		this.render();
	},

	render: function() {
		if (this.model)
			this.$('#venue-name').html(this.model.get('name'));

			return this;
	}
});

var bus = _.extend({}, Backbone.Events);

var venues = new Venues([
	new Venue({ name: 'One Venue' }),
	new Venue({ name: 'Second Venue' }),
	new Venue({ name: 'Third Venue' })
]);

var venuesView = new VenuesView({ model: venues, bus: bus });
$('#venues-container').html(venuesView.render().$el);

var mapView = new MapView({ bus: bus });
mapView.render();


/* Routers */
SPA - routing done on client, no page reload, most resources on client, click on link, change browser's address and present new content

var ArtistsView = Backbone.View.extend({
	render: function() {
		this.$el.html('Artist view');

		return this;
	}
});

var AlbumsView = Backbone.View.extend({
	render: function() {
		this.$el.html('Albums view');

		return this;
	}
});

var GenresView = Backbone.View.extend({
	render: function() {
		this.$el.html('Genre view');

		return this;
	}
});

// Creating a router with routes for different views
var AppRouter = Backbone.Router.extend({
	routers: {
		// If it goes to address/albums, it will load viewAlbums function to render album view
		'albums': 'viewAlbums',
		'albums/:albumId': 'viewAlbumById',
		'artists': 'viewArtists',
		'genres': 'viewGenres',
		// Default for any other route
		'*other': 'defaultRoute'
	},

	viewAlbums: function() {
		var view = new AlbumsView({ el: '#container' });
		view.render();
	},

	viewAlbumById: function(albumId) {

	},

	viewArtists: function() {
		var view = new ArtistsView({ el: '#container' });
		view.render();
	},

	viewGenres: function() {
		var view = new GenresView({ el: '#container' });
		view.render();
	},

	defaultRoute: function() {

	}
});

// Instantiate the router
var router = new AppRouter();
// Listens for changes to browser address
Backbone.history.start();

// In HTML
<nav id="nav">
<ul>
<li data-url="albums">Albums</li>
<li data-url="artists">Artists</li>
<li data-url="genres">Genres</li>
</ul>
</nav>

// Handle clicks on nav URLs
var NavView = Backbone.View.extend({
	events: {
		'click': 'onClick'
	},

	onClick: function(e) {
		var $li = $(e.target);
		router.navigate($li.attr('data-url'), { trigger: true });
	}
});

var navView = new NavView({ el: '#nav' });

/* Modularizing Backbone Applications */
Place all models in models folder
Place all views in views folder
Asynchronous module definition with Require.JS
i.e.
// Model definition
define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	var Song = Backbone.Model.extend();

	return Song;
});

// View definition
define([
	'jquery'
	'underscore',
	'backbone',
	'models/song'
], function($, _, Backbone, Song) {
	var SongView = Backbone.View.extend({
		render: function() {
			this.$el.html(this.model.get('title'));

			return this;
		}
	});

	return SongView;
});

// App Module
define([
	'underscore',
	'backbone',
	'models/song',
	'views/songView'
], function(_, Backbone, Song, SongView) {
	var initialize = function() {

	};

	return {
		initialize: initialize
	};
}); 

// Main Module
require.config({
	paths: {
		jquery: 'lib/jquery-min',
		underscore: 'lib/underscore-min',
		backbone: 'lib/backbone-min'
	}
});

define(['app'], function(App) {
	App.initialize();
});


/* Testing Backbone Applications with Jasmine */
Jasmine - Behavior driven development library
- specs/tests, grouped by suites
- jasmine.js, jasmine-html.js, boot.js
- spec/SpecHelper.js, spec/PlayerSpec.js for src/Player.js
var Calculator = function() {
	var add = function(a, b) {
		if (!a || !b) {
			throw new Error('The add method expects two arguments');
		}

		return a + b;
	}

	return {
		add: add
	};
}

// Suite of tests
describe('Calculator', function() {
	var calculator;

	beforeEach(function() {
		calculator = new Calculator();
	});

	afterEach(function() {

	});
	
	describe('add', function() {
		it('should be able to add 2 numbers', function() {
			var result = calculator.add(2, 3);

			expect(result).toEqual(5);
		});

		it('should throw an error if both arguments are not provided', function() {
			expect(function() {
				calculator.add(1);
			}).toThrow();
		});

		it('should be called with the right arguments', function() {
			// Mocked out function, check if function is called
			// Can simulate return values/errors
			spyOn(calculator, 'add').and.returnValue(7);

			//spyOn(calculator, 'add').and.throwError('someError');
			/*
				expect(function() {
					var result = calculator.add(2, 5);
				}).toThrowError('someError');
			*/
			var result = calculator.add(2, 5);

			// expect(result).toBeUndefined();
			expect(result).toEqual(7);

			expect(calculator.add).toHaveBeenCalled();

			expect(calculator.add).toHaveBeenCalledWith(2, 5);
		});
	});
});

// Testing Models
- Mostly state changes, validation, defaults, url routes, etc.

// SongModel
var Song = Backbone.Model.extend({
	urlRoot: '/api/songs',

	defaults: {
		numberOfPlays: 0
	},

	validate: function(attrs) {
		if (!attrs.title)
			return 'Title is required.';
	},

	play: function() {
		var numberOfPlays = this.get('numberOfPlays');
		this.set('numberOfPlays', numberOfPlays + 1);
	}
});

// SongSpec
describe('Song', function() {
	var song;

	beforeEach(function() {
		song = new Song();
	});

	it('urlRoot should be /api/songs', function() {
		expect(song.urlRoot).toEqual('/api/songs');
	});

	it('numberOfPlays attribute should be 0 by default', function() {
		expect(song.get('numberOfPlays')).toEqual(0);
	});

	it('title is required', function() {
		expect(song.isValid()).toBeFalsy();

		song.set('title', 'Blue in Green');

		expect(song.isValid()).toBeTruthy();
	});

	it('play should increment the numberOfPlays', function() {
		song.play();

		expect(song.get('numberOfPlays')).toEqual(1);
	});
});

/* Testing Backbone Collections */
// AlbumCollection
var Album = Backbone.Collection.extend({
	model: Song,

	url: '/api/songs',

	getPopularSong: function() {
		if (this.length === 0) {
			return undefined;
		}

		var sortedSongs = this.sortBy(function(song) {
			return song.get('numberOfPlays');
		});

		return sortedSongs[sortedSongs.length - 1];
	}
});

// AlbumSpec
describe('Album', function() {
	var album;

	beforeEach(function() {
		album = new Album();
	});

	it('url should be /api/songs', function() {
		expect(album.url).toEqual('/api/songs');
	});

	describe('getPopularSong', function() {
		it('should return undefined if the collection is empty', function() {
			expect(album.getPopularSongs()).toBeUndefined();
		});

		it('should return the song with the highest number of plays if the collection is not empty', function() {
			var song1 = new Song({ title: 'Blue in Green', numberOfPlays: 10 });
			var song2 = new Song({ title: 'So What', numberOfPlays: 5 });

			album.add(song1);
			album.add(song2);

			expect(album.getPopularSong()).toEqual(song1);
		});
	});
});

/* Testing Backbone Views */
- Initial setup for tagName, className, etc.
- Rendering logic, DOM/model events
- use jasmine-jquery
- Put a spy on model's fetch(), save(), or destroy() methods to mock out the server backend functionality, don't spy on jQuery ajax or create a fake server with Sinon.js and inspect URLs and params

var Tweet = Backbone.Model.extend();
...
var TweetView = Backbone.View.extend({
	tagName: 'li',

	className: 'tweet',

	initialize: function() {
		this.model.on('change', this.render, this);
	},

	events: {
		'click #delete': 'onClickDelete',
		'click #expand': 'onClickExpand'
	},

	onClickDelete: function() {
		if (confirm('Are you sure?')) {
			this.model.destroy();
		}
	},

	onClickExpand: function() {
		var self = this;
		this.model.fetch({
			success: function() {
					self.$el.append('<div class="details">' + self.model.get('retweets') + ' retweets</div>');
			},

			error: function() {

			}
		});
	},

	render: function() {
		this.$el.html('<div class="tweet">' + this.model.get('body') + ' <button id="expand"></button><button id="delete"></button>');

		return this;
	}
});

describe('TweetView', function() {
	var view;
	var model;

	beforeEach(function() {
		model = new Tweet();
		view = new TweetView({ model: model });
		view.render();
	});

	it('tagName should be li', function() {
		expect(view.tagName).toEqual('li');
	});

	it('className should be tweet', function() {
		expect(view.className).toEqual('tweet');
	});

	it('should refresh when model state changes', function() {
		model.set('body', 'updated');

		expect(view.$el).toContainText('updated');
	});

	describe('when clicking delete', function() {
		it('should display a confirmation box', function() {
			spyOn(window, 'confirm');

			view.$el.find('#delete').click();

			expect(window.confirm).toHaveBeenCalled();
		});

		it('should destroy the model if the user confirms', function() {
			spyOn(window, 'confirm').and.returnValue(true);

			spyOn(model, 'destroy');

			view.$el.find('#delete').click();

			expect(model.destroy).toHaveBeenCalled();
		});
	});

	describe('when clicking expand', function() {
		it('should load the details if successful', function() {
			spyOn(model, 'fetch').and.callFake(function(options) {
				var tweet = {
					retweets: 10,
					favorites: 5
				};

				model.set(tweet);

				options.success();
			});

			view.$el.find('#expand').click();

			expect(view.$el.find('.details')).toBeDefined();
			expect(view.$el.find('.details')).toContainText('10 retweets');
		});
	});
});



/*
	Learning Marionette.js
	https://marionette.gitbooks.io/marionette-guides/content/en/views/index.html

	Backbone provides minimalist set of Models and Collections as light wrappers around JS objects
	synced over Ajax, lightweight Views associating object with a DOM node and some data, router that
	associates URLs with function, and helpers for managing events

	- Typically render views with your own rendering function/templating system like Underscore templates
	or Handlebars, jQuery manipulation of DOM
	- May run into issues with structuring app, repetition, managing View's lifecycle, memory leaks or 
	"zombie views" if one doesn't unregister events attached to a View, communicating between Views

	What does Marionette give us?
	- Standardized rendering process by taking a template you specify with the View's template property,
	compile with Underscore's templating function and pass it a model or collection (or any other template library)
	- Consistent View lifecycle: initialized, rendered, shown, refreshed, destroyed - each with events/callbacks associated
	- Can define complex layouts with region objects that describe portions of the DOM that can display and swap out Views,
	has utilities to manage child views to have nested View structures
	- Central event bus with semantic events to simplify communication between Views
	- Helpers to write DRY code and avoid "Zombie Views"
	- Central application object to initialize your application for a clear starting point
*/

/*
	Setup with folders for collections, models, routers, templates, views
	
	i.e. Sample hook into starting point
	<div id="app-hook"></div>
	<script src="static/js/app.js"></script>
*/

// Creating our first view
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');

var TodoList = Marionette.LayoutView.extend({
	el: '#app-hook', // Attach view to this element through jQuery selector
	template: require('./templates/layout.html') // Template to display to user
});

var todo = new TodoList({
	model: new Backbone.Model({
		items: [
			{ assignee: 'Alfred', text: 'Hello darkness' },
			{ assignee: 'Regine', text: 'Little bit' }
		]
	})
});;

// Displays our view with template per TodoList item
todo.render();

/*	Sample template for the items
	<ul>
		<% _.each(items, function(item) {
			<li><%- item.text %> &mdash; <%- item.assignee %></li>
		<% }) %>
	</ul>
*/


// Using CollectionView instead to render a list of todo items
var ToDo = Marionette.LayoutView.extend({
	tagName: 'li',
	template: require('./templates/todoitem.html')
});

// Template: <%- text %> &mdash; <%- assignee %>

// Loops through each item in thiscollection and renders an instance of its childView
var TodoList = Marionette.CollectionView.extend({
	el: '#app-hook',
	tagName: 'ul',

  // Attached view for each todo item here
  childView: ToDo
});

var todo = new TodoList({
	// Using set of models/collection
	collection: new Backbone.Collection([
		{ assignee: 'Alfred', text: 'Hello darkness' },
		{ assignee: 'Regine', text: 'Little bit' }
		])
});

todo.render();


// Using CompositeView: CollectionView with its own template, define where the childView items are to be
// attached to the template using childViewContainer and pass in the template 
// i.e. adding a form to add items to the ToDoList

/*
	Sample form template
	<ul></ul>
	<form>
		<label for="id_text">Todo Text</label>
		<input type="text" name="text" id="id_text" value="<%- text %>"/>
		<label for="id_assignee">Assign to</label>
		<input type="text" name="assignee" id="id_assignee" value="<%- assignee %>"/>

		<button id="btn-add">Add Item</button>
	</form>
*/
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var ToDoModel = require('./models/todo');

var ToDo = Marionette.LayoutView.extend({
	tagName: 'li',
	template: require('./templates/todoitem.html')
});

var TodoList = Marionette.CompositeView.extend({
	el: '#app-hook',
	template: require('./templates/todolist.html'),

	childView: ToDo,
	childViewContainer: 'ul',

	// Created a 'ui hash' to our view to create cached jQuery selectors to elements in
	// our view's template
	ui: {
		assignee: '#id_assignee',
		form: 'form',
		text: '#id_text'
	},

	// Created a triggers hash to reference those ui keys and when a jQuery event occurs, we can
	// listen for it and fire a trigger
	triggers: {
		'submit @ui.form': 'add:todo:item'
	},

	// This hash allows us to listen to changes occurring on the attached this.collection attribute
	collectionEvents: {
		add: 'itemAdded'
	},

	// 
	modelEvents: {

	},

	// Triggers are converted to onEventName method and called
	onAddTodoItem: function() {
		this.model.set({
			assignee: this.ui.assignee.val(),
			text: this.ui.text.val()
		});

		if (this.model.isValid()) {
			var items = this.model.pick('assignee', 'text');
			this.collection.add(items);
		}
	},

	// Can reference ui hash inside our view and treat it like a jQuery selector object
	// This method referenced in collectionEvents is called when the event is triggered
	itemAdded: function() {
		this.model.set({
			assignee: '',
			text: ''
		});
	}
});

var todo = new TodoList({
	collection: new Backbone.Collection([
		{ assignee: 'Alfred', text: 'Hello darkness' },
		{ assignee: 'Regine', text: 'Little bit' }
	]),
	model: new ToDoModel()
});
todo.render();


// Sample data validation on ToDo Model
var Backbone = require('backbone');

var ToDo = Backbone.Model.extend({
	defaults: {
		assignee: '',
		text: ''
	},

	validate: function(attrs) {
		var errors = {};
		var hasError = false;
		
		if (!attrs.assignee) {
			errors.assignee = 'assignee must be set';
			hasError = true;
		}

		if (!attrs.text) {
			errors.text = 'text must be set';
			hasError = true;
		}

		if (hasError) {
			return errors;
		}
	}
});


// Sample Application class: sits between pre-rendered page and your app
// - Takes pre-defined data from your page and feed it into your application
// - Renders initial views, starts the Backbone.history and initialize your app's Router
// - Starting point for the application
var Marionette = require('backbone.marionette');
var TodoView = require('./views/layout');
var ToDoModel = require('./models/todo');

var initialData = [
	{ assignee: 'Alfred', text: 'Hello darkness' },
	{ assignee: 'Regine', text: 'Little bit' }
];

var app = new Marionette.Application({
	onStart: function(options) {
		var todo = new TodoView({
			collection: new Backbone.Collection(options.initalData),
			model: new TodoModel()
		});
		todo.render();
		todo.triggerMethod('show');
	}
});

app.start({ initialData: initialData });


// Decomposing the Views into separate layouts for better modularity
// views/layout.js, views/list.js, views/form.js

// views/list.js, handles only rendering of the collection so no longer composite
var Marionette = require('backbone.marionette');

var ToDo = Marionette.LayoutView.extend({
	tagName: 'li',
	template: require('../templates/todoitem.html')
});

var TodoList = Marionette.CollectionView.extend({
	tagName: 'ul',
	childView: ToDo
});


module.exports = TodoList;

// views/form.js, no longer need wrapping form in template
var Marionette = require('backbone.marionette');

var FormView = Marionette.LayoutView.extend({
	tagName: 'form',
	template: require('../templates/form.html'),

	triggers: {
		submit: 'add:todo:item'
	},

	// The list is able to manage individual item changes and render what needs to be rendered
	modelEvents: {
		change: 'render'
	},

	ui: {
		assignee: '#id_assignee',
		text: '#id_text'
	}
});

/*
	<label for="id_text">Todo Text</label>
	<input type="text" name="text" id="id_text" value="<%- text %>"/>
	<label for="id_assignee">Assign to</label>
	<input type="text" name="assignee" id="id_assignee" value="<%- assignee %>"/>
	
	<button id="btn-add">Add Item</button>
*/


module.exports = FormView;

// views/layout.js now handles management of the two views
// The individual views don't directly interact with each other and instead interacts with the model
// and let the view event handlers recognize when they need to do something
var Marionette = require('backbone.marionette');
var FormView = require('./form');
var ListView = require('./list');

var Layout = Marionette.LayoutView.extend({
	el: '#app-hook',

	template: require('../templates/layout.html'),

	// Creates two divs with class form and list to hold the two child views
	regions: {
		form: '.form',
		list: '.list'
	},

	collectionEvents: {
		add: 'itemAdded'
	},

	// Renders views into the jQuery selectors referenced by the regions hash
	onShow: function() {
		var formView = new FormView({ model: this.model });
		var listView = new ListView({ collection: this.collection });

		this.showChildView('form', formView);
		this.showChildView('list', listView);
	},

	// LayoutView can see events occurring on its children by prepending its event handler with Childview
	// like onChildviewEventName, these triggers always send a copy of their view as the first argument,
	// allowing us to access the ui object
	onChildviewAddTodoItem: function(child) {
		this.model.set({
			assignee: child.ui.assignee.val(),
			text: child.ui.text.val()
		}, { validate: true });

		var items = this.model.pick('assignee', 'text');
		this.collection.add(items);
	},

	// Form will be re-rendered when data changes
	itemAdded: function() {
		this.model.set({
			assignee: '',
			text: ''
		});
	}
});

module.exports = layout;


/*
	Marionette Views: each takes a template it can render and display
*/
// Sample LayoutView with events
// The events object maps a combination of DOM event (e.g. click, keyup) with
// a jQuery selector to a method to call on the view
var Marionette = require('backbone.marionette');

var MyView = Marionette.LayoutView.extend({
	template: require('mytemplate.html'),

	events: {
		'click .mybutton': 'alertBox'
	},

	alertBox: function() {
		alert('Button clicked');
	}
});

// Contents of div will change after modifying input
var SecondView = Marionette.LayoutView.extend({
	template: require('secondtemplate.html'),

	events: {
		'keyup .myinput': 'changeDiv'
	},

	changeDiv: function() {
		var text = this.$el.find('.myinput').val();
		this.$el.find('.mytext').text(text);
	}
});

// Views can contain a hash bject called ui that lets us name jQuery selectors
// They get stored as references and jQuery will only search the DOM once
var UiView = Marionette.LayoutView.extend({
	template: require('uitemplate.html'),

	ui: {
		content: '.mytext',
		input: '.myinput',
		save: '.mybutton'
	},

	events: {
		'click @ui.save': 'changeDiv'
	},

	changeDiv: function() {
		var text = this.ui.input.val();
		this.ui.content.text(text);
	}
});


// Binding views to models, can now access it from this.model and listen to events on the model
var MyView = require('./myview');

var view = new MyView({
	model: new Backbone.Model();
});

// Sample changing views based on model changes
// output.html: <div class="mytext"><%- mytext %></div>
var Marionette = require('backbone.marionette');

var Output = Marionette.LayoutView.extend({
	template: require('./output.html'),

	// mytext in div re-renders on model change
	modelEvents: {
		'change:mytext': 'render'
	}
});

module.exports = Output;

// input.html: <input class="myinput"/><button class="mybutton">Click me</button>
var Marionette = require('backbone.marionette');

var Input = Marionette.LayoutView.extend({
	template: require('./input.html'),

	ui: {
		input: '.myinput',
		button: '.mybutton'
	},

	events: {
		'click @ui.button': 'updateModel'
	},

	updateModel: function() {
		var text = this.ui.input.val();
		this.model.update({
			mytext: text
		});
	}
});

module.exports = Input;

// Listening to Model events by binding it in the modelEvents object
var MyView = Marionette.LayoutView.extend({
	template: require('sample.html'),

	modelEvents: {
		'change': 'changeAnything',
		'change:myField': 'changeSpecificField'
	},

	changeAnything: function(model, options) {
		alert('Triggered on any field change');
	},

	changeSpecificField: function(model, value, options) {
		alert('Triggered because myField changed - ' + value);
	}
});

// Listening to custom events by setting and triggering custom events such as for save or fetch
// (Backbone.Model) only defines a sync event but not special event to tell us what triggered the sync
var MyView = Marionette.LayoutView.extend({
	template: require('mytemplate.html'),

	modelEvents: {
		save: 'afterSave'
	},

	// We can now listen for the model save event and act on it to change whichever views are bound to model
	afterSave: function(model, options) {
		alert('Model was saved');
	},

	onButtonClicked: function() {
		var model = this.model;
		model.save({
			success: function() {
				model.trigger('save', model, {});
			}
		});
	}
});



// CollectionView and CompositeView handle lists of data and binds to the Backbone.Collection
// When you bind a collection to your collection view, it will iterate over each item in the list, rendering
// a new view for each one

// Sample CollectionView: item.html -> <a href="<%- url %"><%- text %></a>
// CollectionView does not define its own template, which makes it unsuitable for complex layouts such as tables
var Item = Marionette.LayoutView.extend({
	tagName: 'li',
	template: require('./item.html')
});

var ItemList = Marionette.CollectionView.extend({
	tagName: 'ul',
	childView: Item
});

module.exports = ItemList;

// Can also bind collectionEvents to our views such as add and remove
var List = Marionette.CollectionView.extend({
	tagName: 'ul',
	childView: Item,

	collectionEvents: {
		add: 'itemAdded'
	},

	itemAdded: function() {
		alert('Item added to list');
	}
});


// CompositeView lets us assign a template to be rendered
// Takes in two extra required attributes: template and childViewContainer, a jQuery selecter to the 
// element in our template to attach the childView elements; usage is identical to CollectionView
// It can also take an additional model argument and render based on the contents of the model
// and we can bind both model and collection
// It can also listen to both collectionEvents and modelEvents at the same time

// i.e. Creating a table where row.html -> <td><%- name %></td><td><%- nationality %></td><td><%- gender %></td>
// table.html: thead -> tr -> th, th, th -> tbody
var Row = Backbone.LayoutView.extend({
	tagName: 'tr',
	template: require('./row.html')
});

var Table = Backbone.CompositeView.extend({
	tagName: 'table',
	template: './table.html',

	childView: Row,
	childViewContainer: 'tbody'
});

// Using events for CompositeViews
var Table = Marionette.CompositeView.extend({
	tagName: 'table',
	template: require('./table.html'),

	childView: Row,
	childViewContainer: 'tbody',

	// On a model change (saving, destroying, creating), re-render it and it will bubble up to the collection
	modelEvents: {
		sync: 'render'
	},

	// When collection is modified, run checkStatus
	collectionEvents: {
		update: 'checkStatus'
	},

	checkStatus: function(collection) {
		collection.each(function(model) {
			// Do some stuff
		});
	}
});



// Using regions that maps our keys to jQuery selector strings in the template to structure our layout
// layout.html: <div class="summary"></div><div class="table"></div>
var Summary = require('./summary');
var Table = require('./table');

// Parent region, show trigger fired that creates the summary and table
var MyLayout = Marionette.LayoutView.extend({
	template: require('./layout.html'),

	regions: {
		summary: '.summary',
		table: '.table'
	},

	onShow: function() {
		// Instantiate the two views
		var summary = new Summary({ model: new Backbone.Model() });
		var table = new Table({ collection: new Backbone.Collection() });

		// Show the children by firing their show triggers
		// If they contain LayoutViews, we could keep listening to this trigger and show more views down tree
		this.showChildView('summary', summary);
		this.showChildView('table', table);
	}
});

module.exports = MyLayout;


// LayoutView is a great medium for transferring messages between one view and another, especially if on same level
// Every time a trigger is fired on a view, any parent views can see it as well through childview: ,so we
// can access say a form's save:model trigger -> onChildviewEventName: function(child, model) { ... }
// Each child view can continue operating independently and manage its own state -> can look up view hierarchy
// when and how the state gets shared between views
var Layout = Marionette.LayoutView.extend({
	template: require('./layout.html'),

	regions: {
		list: '.list',
		form: '.form'
	},

	onShow: function() {
		this.showChildView('form', new FormView({ model: new Backbone.Model() }));
		this.showChildView('list', new ListView({ collection: new Backbone.Collection() }));
	},

	onChildviewSaveModel: function(child, model) {
		var list = this.getChildview('list');
		var newModel = model.clone();
		list.collection.add(newModel);
		model.clear();
	}
});



// Marionette builds a triggering framework on top of Backbone's event handlers
// With triggers we can decouple the firing of an event from its handler, many fire by default
// - events object to listen to activity in our view's template and respond to it with a specific method
// - triggers provid more generic behavior and we must provide listeners/special method name that will be called
// typically named using the : as word separators
var MyView = Marionette.LayoutView.extend({
	template: require('./view.html'),

	ui: {
		title: '.title',
		save: '.save'
	},

	triggers: {
		'keyup @ui.title': 'set:title',
		'blur @ui.title': 'set:title',
		'click @ui.save': 'save:form'
	},

	onSetTitle: function(domEvent) {
		this.model.set({
			title: this.ui.title.val()
		});
	},

	onSaveForm: function(domEvent) {
		this.model.save();
	}
});

// We can also manually fire triggers
// Can use before: trigger to alert listeners that an action is about to be performed
// such as before:render, before:show, before:model:save
// Call this.triggerMethod('before:model:save'); most triggers have before:action and action
var MyView = Marionette.LayoutView.extend({
	template: require('./events.html'),

	// this.triggerMethod('before:render');
	onBeforeRender: function() {
		alert('This view is about to be rendered');
	},

	onRender: function() {
		alert('This view was rendered');
	}
});


// Listening for triggers, we can attach a handler to our view
// View triggers such as add:child and before:add:child that fire when a child view gets rendered
// and attached to the CollectionView, get an argument referencing child just added
// - attach, before:attach: fires once Collection/Composite view gets attached to actual DOM,
// safe point to know that the view is finished and active for the user
// - destroy, before:destroy: fired by region manager to perform any extra cleanup on the view after destroyed
// - dom:refresh: fired when view is re-rendered, doesn't get fired on first render
// - render, before:render: fires when the view's HTML template has been rendered (string has been built), 
// but before it gets attached to the browser DOM, operate on HTML before user can see it like to add/remove classes
// or check for data on view's element every time it gets rendered
// - render:collection: fired after collection has been rendered and attached to view, if collection is not empty
// - render:empty, render:template: when wrapper template for a CompositeView is rendered but before the collection items
// have started rendering (childViewContainer will be empty)
// - reorder: when we reorder the underlying connection attached to a view
// - remove:child: when a collection item is removed, typically when this.collection.remove(id) is called, fires
// after view has been removed from DOM
// - show: when region.show(view) or layoutView.showChildView(view) is complete, to build our nested layout hierarchy and show
// a layout's sub-views
// before-add:child -> before:render -> render -> before:show -> before:attach -> attach -> show -> add:child
view.listenTo('render', function() {
	console.log('View was rendered');
});


/*
	Templates for our Views: displays on show or render, can change it based on model data we pass into view
	can use Underscore's basic templating engine or any other (escaped or unescaped output)
	- escaped is <%- name %>, unescaped is <%= name %>, logic with <% logic %> such as _.each(data, function(item) { ... })
*/
// Sample syntax given template like this: <h1>Hello, <%- name%></h1>
var MyLayout = Marionette.LayoutView.extend({
	template: require('./hello.html');
})

var myModel = new Backbone.Model({
	name: 'Alfred'
});

var layout = new MyLayout({ model: myModel });
layout.render();

// Can use templateHelpers attribute on our view to assign an object or function returning an object whose keys will be available
// in the template for reusability in cases such as validation, counting up values, etc.


/*
	Creating an application: Marionette.Application base class is the root of the application
	- Application used to transfer any data from surrounding page into your application
	- Initialize regions and views
	- Start your router which starts rendering your initial views
*/
//	Constructing view hierarchy and populate initial data from surrounding screen in onStart handler
var Marionette = require('backbone.marionette');
var Layout = require('./views/layout');

var app = new Marionette.Application({
	onStart: function() {
		var layout = new Layout(options);
		layout.render();

	}
});

// Can pass initial data from server in argument of app.start
app.start();

// Loading initial data for push state with routers
var app = new Marionette.Application({
	onStart: function(options) {
		var router = new Router({
			pushState: true,
			initialData: options.initialData
		});
	}
});

app.start({ initialData: window.initalData });

// Can have multiple application starters especially when integrating with an existing web service that mixes JS
// with web pages and forms -> must use initializers and addInitializer function
// For example, using browserify
var Marionette = require('backbone.marionette');
var includes = require('./includes');

var initializerFunction = includes[window.initializer];

var application = new Marionette.Application();
application.addInitializer(initializerFunction);
application.start({ initialData: window.initialData });


/*
	History of Routers: using window.location.hashCode ('#/fragment') and mapping it to code we want to execute and render
	- Marionette AppRouter to abstract over this and provide URL routing engine
	- Two aspects:
	- 1. Set the fragment for state to restore later
	- 2. Render the view matching the fragment on page load
	- To remember the state that we want to come back to later - Backbone.history.navigate('route/to/restore'); to update the fragment
	- (controller's methods will not be caled but will only set the fragment to hash URL)
	- Routing splits into a router and a controller; router takes a map of URL fragments to listen for and maps
	- them to method names on an attached controller to call; controller is a simple object with matching methods to be called by router
*/
// Simply attach an appRoutes object to map the routes to methods
var Router = Marionette.AppRouter.extend({
	// Methods in appRoutes must exist on an attached controller
	appRoutes: {
		'blog/': 'blogList', // http://example.com#blog/ calls blogList function
		'blog/:entry': 'blogEntry',
		'blog/:entry/comments/:comment': 'blogComment'
	}	
});


// Attaching a controller to activate the routes
// Parent layout can listen to its children, renders its main region and calls Backbone.history.navigate to let
// us know the URL change occurred, router then at page load attempts to match fragment and triggers main layout to render proper view
var LayoutView = require('./blog');

var Controller = Marionette.Object.extend({
	initialize: function() {
		var layout = new LayoutView();
		layout.render();
		this.options.layout = layout;
	},

	blogList: function() {
		var layout = this.getOption('layout');
		layout.triggerMethod('show:blog:list');
	},

	blogEntry: function(entry) {
		var layout = this.getOption('layout');
		layout.triggerMethod('show:blog:entry', entry);
	}
});

var Router = Marionette.AppRouter.extend({
	controller: new Controller(),
	appRoutes: {
		'blog/': 'blogList',
		'blog/:entry': 'blogEntry'
	}
});

// Need to start routing framework through Backbone.history.start({ pushState: true });

module.exports = Router;


/*
	Sharing common view Behavior such as displaying modals, handling form validation, custom form fields
	Behavior is an object attached to a view that is able to listen and respond to events/triggers on the view
	with access to the view object
	- Can listen to modelEvents and collectionEvents hashes with their own custom behavior
	- Used commonly for forms data manipulation to listen for before:form:save and form:save; modal behaviors; tooltips
*/
var FormBehavior = Marionette.Behavior.extend({
	// Can add defaults options for Behaviors here too

	ui: {
		save: '.save-button'
	},

	events: {
		'click @ui.save': 'saveForm'
	},

	saveForm: function() {
		this.view.model.save({});
	}
});

var PersonForm = Marionette.LayoutView.extend({
	// Maps behaviors to views
	behaviors: {
		// Arbitrary name of form key
		form: {
			behaviorClass: FormBehavior
			// Can also add other options with Behaviors here 
		}
	}
});



/*
	Dealing with complex persisted data with models and collections
	- Models: represent a single object/resource/record with attributes that can be synchronized with a server
	- Collections: list of Models with extra helper methods that can be synchronized with server
	- Simply list a Colletion, change the individual Model instances and have those changes propagate across app
*/
// Models with .get, .set, defaults, .save, .fetch
// They can fire change:modelAttribute events and we need to attach listeners that act when the event is fired
var Note = Backbone.Model.extend({
	urlRoot: 'http://example.com/note/'
});

var note = new Note({
	id: 1
});

note.fetch({
	success: function(response, model) {
		// Handle returned note model
	}
});

// Listening to events through .on or through modelEvents
// sync covers a successful save and successful data pull
// So we can bind custom events instead
var titleUpdated = function(model, value) {
	console.log('Title is now ' + value);
};

note.on('change:title', titleUpdated);
note.set('title', 'Changed Title');

var NoteView = Marionette.LayoutView.extend({
	modelEvents: {
		'change:title': 'updateTitle'
	},

	updateTitle: function(model, value, options) {
		console.log('title for NoteView is now ' + value);
	}
});

// Using collections to hold lists of models/data
var NoteCollection = Backbone.Collection.extend({
	// Will render each item with Note model template
	model: Note
});

var noteList = new NoteCollection({
	{ title: 'Note1', content: 'Content1' },
	{ title: 'Note2', content: 'Content2' }
});

noteList.add({ title: 'Note3', content: 'Content3' });

// Syncing data with server to pull from
var NoteCollection = Backbone.Collection.extend({
	url: '/note/',
	model: Note
});

var noteList = new NoteCollection();
noteList.fetch();



/* 
	Backbone Documentation Notes 
	- Models with key-value binding and custom events -> "change" events (manages internal table of data attributes,
	- Collections with rich API of enumerable functions -> group of related models, proxy all of events that occur to
	models within them
	- Views with declarative event handling - manages the rendering and user interaction within its own DOM element
	- RESTful JSON interface, API integration with url of your resource endpoint
	- DB (sync) <-> Model <-data  emits change to render-> View <- input
	- Router to update the browser URL whenever the user reaches a new "place" in your app they might want to bookmark or share
	- Events - module that can be mixed in to any object, giving the object the ability to bind and trigger custom named events
*/
// API Integration
// Collections automatically populate itself with data formatted as an array -> [{ "id": 1 }]
// Model automatically populate itself with data formatted as an object -> { "id": 1 }
// GET /books/ -> collection.fetch();
// POST /books/ -> collection.create();
// GET /books/1 -> model.fetch();
// PUT /books/1 -> model.save();
// DEL /books/1 -> model.destroy();
var Books = Backbone.Collection.extend({
	url: '/books'
});

// Can reconcile different API data formats by using a parse method like to get { ... "books": [...] } and use the books array
var Books = Backbone.Collection.extend({
	url: '/books',
	parse: function(data) {
		return data.books;
	}
});

// Backbone.Events //
// Can trigger your own events but here are the default ones provided by Events
// "add": (model, collection, options) - when a model is added to a collection
// "remove": (model, collection, options) - when a model is removed from a collection
// "update": (collection, options) - single event triggered after any number of models added/removed from collection
// "reset": (collection, options) - collection's entire contents have been reset
// "sort": (collection, options) - collection has been re-sorted
// "change": (model, options) - when model's attributes have changed
// "change:[attribute]": (model, options) - specific attribute updated
// "destroy": (model, collection, options) - when a model is destroyed
// "request": (model or collection, xhr, options) - when model or collection has started a request to the server
// "sync": (model or collection, response, options) - when a model or collection has been successfully synced with server
// "error": (model or collection, response, options) - when a model's or collection's request to the server has failed
// "invalid": (model, error, options) - when a model's validation fails on the client
// "route:[name]": (route, paramts) - fired by the router when a specific route is matched
// "route": (route, params) - fired by the router/history when any route has been matched
// "all": triggered for any event, passing the event name as the first argument followed by all trigger arguments
// generally when doing model.set or collection.add... one can prevent event from being triggered by doing
// {silent: true} as an option
var object = {};

_.extend(object, Backbone.Events);

object.on('alert', function(msg) {
	alert('Triggered ' + msg);
});

object.trigger('alert', 'An alert event');

// on -> object.on(event, callback, [context])
// binds a callback function to an object that is invoked whenever the event is fired
// bound to "all" will be triggered when any event occurs
// may be a space-delimited list of several events
proxy.on('all', function(eventName) {
	object.trigger(eventName);
});

// event map syntax
// can also supply a context value for this for callbacks by calling like this:
// i.e. model.on('change', this.render, this)
book.on({
	'change:author': authorPane.update,
	'change:title change:subtitle': titleView.update,
	'destroy': bookView.remove
});

// off -> object.off([event], [callback], [context])
// Removes a previously-bound callback function from an object
// such as the onChange callback
object.off("change", onChange);
// Removes all callbacks on object
object.off();

// trigger -> object.trigger(event,[*args])
// trigger callbacks with given event
object.trigger('change');

// once -> fires only once before being removed
object.once('change', handleChangeOnce);

// listenTo -> object.listenTo(other, event, callback)
// tells an object to listen to a particular event on another object
// allows another object to keep track of the events and can be removed all at once later on
view.listenTo(model, 'change', view.render);

// stopListening -> object.stopListening([other], [event], [callback])
// tells an object to stop listening to events
view.stopListening(); // removes all registered callbacks

// listenToOnce -> fired only once before being removed from object


// Backbone.Model //
// conversions, validations, computed properties, access controll, extend Backbone.Model with
// domain-specific methods, manage changes
var Sidebar = Backbone.Model.extend({
	promptColor: function() {
		var cssColor = prompt("Please enter a CSS color:");
		this.set({color: cssColor})
	}
});

window.sidebar = new Sidebar;

sidebar.on('change:color', function(model, color) {
	$('#sidebar').css({background: color});
});

sidebar.set({color: 'white'});
sidebar.promptColor();

// extend -> Backbone.Model.extend(properties, [classProperties])
// sets up prototype chain to have a Model class of your own
var Note = Backbone.Model.extend({
	// ...
});

// constructor / initialize -> new Model([attributes], [options])
// pass in initial values of attributes which will be set on model
// if define initialize function it will be invoked when the model is created
// if pass {parse:true} is passed as an option, the attributes will first be converted by parse before being set on model
new Book({
	title: "Sample Book",
	author: "Darkness"
});

// get -> model.get(attribute)
note.get("title");

// set -> model.set(attributes, [options])
// "change" event triggered upon set
book.set("title", "new title");

// escape -> model.escape(attribute)
// returns HTML-escaped version of a model's attribute to prevent XSS attacks
var hacker = new Backbone.Model({
	name: "<script>alert('xss)</script>"
});

alert(hacker.escape('name'));

// has -> model.has(attribute)
// returns true if attribute is set to a non-null or non-undefined value
if (note.has("title")) console.log("has title attribute");

// unset -> model.unset(attribute, [options])
// deletes attribute from internal attributes hash, fires a "change" unless silent passed as an option

// clear -> model.clear([options])
// removes all attributes from the model, including the id attribute. fires a "change" unless silent is passed as an option

// id -> model.id
// arbitrary string, models can be retrieved by id from collections and id used to generate model URLs by default

// idAttribute -> model.idAttribute
// model's unique identifier stored under id attribute, can map from database id to model's id
var Meal = Backbone.extend({
	idAttribute: "_id"
});

var cake = new Meal({ _id: 1, name: "Cake" });
alert("Cake id: " + cake.id);

// cid -> model.cid
// client id assigned to all models when first created, handy when model not saved on server and doesn't have eventual id

// attributes -> model.attributes
// internal hash containing model's state

// changed -> model.changed
// hash containing all attributes that have changed since its last set, copy can be acquired from changedAttributes

// defaults -> model.defaults, model.defaults()
// specify default attributes for model
var Meal = Backbone.Model.extend({
	defaults: {
		"appetizer": "default appetizer"
	}
});

// toJSON -> model.toJSON([options])
// returns a shallow copy of the model's attributes for JSON stringification

// sync -> model.sync(method, model, [options])
// to persist state of a model to the server, can be overridden for custom behavior

// fetch -> model.fetch([options])
// merges the model's state with attributes fetched from the server by delegating to Backbone.sync
// returns a jqXHR, useful if model never have been populated with data, triggers "change" if server's state differs
// from current attributes, accepts success and error callbacks in options hash which are both passed
// (model, response, options)

// save -> model.save([attributes], [options])
// save a mdoel to your database by delegating to Backbone.sync, returns jqXHR if validation successful and false otherwise
// may pass individual keys and values instead of a hash, must pass validate method if exists
// if model isNew, the save will be a "create" (HTTP POST); if already exists will be an "update" (HTTP PUT)
// can also do {patch: true} to only have changed attributes to be sent to the server, triggers "change"/"request"/"sync"
// pass {wait: true} if like to wait for the server before setting the new attributes on model
book.save("author", "new update", { error: function() { }});

// destroy -> model.destroy([options])
// destroys the model on the server by delegating an HTTP DELETE request to Backbone.sync, triggers "destroy"
book.destroy({ success: function(model, repsonse) { }});

// validate -> model.validate(attributes, options)
// by default save checks validate before setting any attributes and may tell set to validate new attributes
// by passing {validate: true} as an option; if attributes valid, don't return anything; failed validations trigger "invalid"
// and set validationError property on the model
var Chapter = Backbone.Model.extend({
	validate: function(attrs, options) {
		if (attrs.end < attrs.start) {
			return "Cannot end before it start";
		}
	}
});

// validationError -> model.validationError
// value returned by validate during the last failed validation

// isValid -> model.isValid()
// runs validate to check the model state

// url -> model.url()
// returns relative URL where the model's resource would be located on the server
// generate urls of the form "[collection.url]/[id]"

// urlRoot -> model.urlRoot or model.urlRoot()
// specify a urlRoot if using a model outside of a collection, "[urlRoot]/id"

// parse -> model.parse(response, options)
// whenever a model's data is returned by the server in fetch and save, should return attributes hash to be set on the model

// clone -> model.clone()
// returns a new instance of the model with identical attributes

// isNew -> model.isNew()
// if model doesn't have an id, it is considered new and not saved to the server yet

// hasChanged -> model.hasChanged([attribute])
// has model changed since last set
// changedAttributes -> model.changedAttributes([attributes])

// previous -> model.previous(attribute)
// during "change" event, gets previous value of changed attribute
// previousAttributes -> model.previousAttributes()
bill.on("change:name", function(model, name) {
	alert("Changed from " + bill.previous("name") + " to " + name);
});


// Backbone.Collection //
// collections are ordered sets of models, can bind "change" events to be notified when any model in collection
// modified, listen for "add" and "remove" events, fetch collection from server
// any event triggered on model in a collection will also be triggered on the collection directly
// extend -> Backbone.Collection.extend(properties, [classProperties])
// model -> collection.model([attrs], [options])
// override this to specify the model class that the collection contains
var Library = Backbone.Collection.extend({
	model: Book
});

// modelId -> collection.modelId(attrs)
// return the value the collection will use to identify a model given its attributes
// useful for combining models from multiple tables with different idAttribute values into a single collection
var Library = Backbone.Collection.extend({
	modelId: function(attrs) {
		return attrs.type + attrs.id;
	}
});

// constructor/initialize -> new Backbone.Collection([models], [options])
// can pass in array of models, passing false for comparator will prevent sorting
// models -> collection.models; raw access to the JS array of models inside collection
// collection.toJSON([options]) -> array containing attributes hash of each model 
// sync -> collection.sync(method, collection, [options]); persist the state of a collection to the server
// add -> collection.add(models, [options])
// add model or array of models to collection, firing an "add" event for each model and "update" event afterwards
// {at: index} to splice the model into the collection at specific index, {merge:true} -> change
ships.add([
	{name: "Regine"}
]);

// remove -> collection.remove(models, [options])
// remove model or arary of models from collection and return them, fires "remove" for each model and single "update"

// reset -> collection.reset([models], [options])
// replaces a collection with a new list of models or attribute hashes, triggering "reset" event 

// set -> collection.set(models, [options])
// "smart" update of collection with passed list of models, can customize

// get -> collection.get(id)
// at -> collection.at(index)
// get a model from a collection specified by index

// push -> collection.push(model, [options])
// add a model at end of collection
// pop -> collection.pop([options])
// unshift -> collection.unshift(model, [options])
// shift -> collection.shift([options])
// collection.length
// collection.comparator
// collection.sort([options])
// collection.pluck(attribute); pluck an attribute from each model in the collection (mapping and returning single attribute)
// collection.where(attributes); returns an array of all the models in a collection that match the passed attributes (filter)
// collection.findWhere(attributes); returns only first model in collection that matches the passed attributes
// collection.url or collection.url(); references its location on the server
// parse -> collection.parse(response, options); called whenever a collection's models returned by server in fetch
// collection.clone()
// collection.fetch([options]); shouldn't be used to populate collections on page load, should already be bootstrapped into place
// it's for lazily loading models for interfaces that are not needed immediately
// collection.create(attributes, [options]); creates a new instance of a model within a collection


// Backbone.Router //
// provides methods for routing client-side pages and connecting them to actions and events, History API
// during page load after application finished creating all of its routers, must call
// Backbone.history.start() or Backbone.history.start({pushState: true}) to route the initial URL
// Backbone.Router.extend(properties, [classProperties])
// define action functions that are triggered when certain URL fragments are matched and provide a routes hash
// that pairs routes to actions
var Workspace = Backbone.Router.extend({
	routes: {
		"help": "help",
		"search/:query": "search"
	},

	help: function() {
		// ...
	},

	search: function(query, page) {
		// ...
	}
});

// routes -> router.routes
// hash maps URLs with parameters to functions on your router, can contain :param parameter parts
// i.e. search/:query/p:page, file/*path, docs/:section(/:subsection)
// docs and docs/ will fire different callbacks so can do "docs(/)" to capture both cases instead
// new Router([ooptions])
// route -> router.route(route, name, [callbacks]); triggered as route:name event
// navigate -> router.navigate(fragment, [options]);
// updates the URL and set trigger option to be true to call the route function; to update the URL without creating
// an entry in the browser's history, set the replace option to true
openPage: function(pageNumber) {
	this.document.pages.at(pageNumber).open();
	this.navigate("page/" + pageNumber);
}

// execute -> router.execute(callback, args, name)
// override to perform custom parsing or wrapping of your routes like parsing query strings before handing them to route callback
var Router = Backbone.Router.extend({
	execute: function(callback, args, name) {
		if (!loggedIn) {
			goToLogin();
			return false;
		}
		args.push(parseQueryString(args.pop()));
		if (callback) callback.apply(this, args);
	}
});


// Backbone.history //
// global router per frame to handle hashchange events or pushState, match the appropriate route, and trigger callbacks
// pushState support exists opt-in basis
// Backbone.history.start([options])
// when all Routers created and all routes set up, start it up to begin monitoring hashchange events and dispatch routes
// root: "root URL", {hashChange: false}, call after DOM is ready

// Backbone.Sync //
// calls every time it attempts to read or save a model to the server
// default uses jQuery.ajax to make a RESTful JSON request and returns a jqXHR
// sync(method, model, [options]): method - CRUD, model to be saved or collection to be read, options (success/error callbacks)
// create - POST, read - GET, update - PUT, patch - PATCH, delete - DELETE
// Backbone.ajax = function(request) { ... }
// Backbone.emulateHTTP = true; Backbone.emulateJSON = true to work with legacy web server

// Backbone.View //
// can be used with any JS templating library, can bind render function to "change" event
// Backbone.View.extend(properties, [classProperties])
var DocumentRow = Backbone.View.extend({
	tagName: "li", 
	className: "document-row",
	events: {
		"click .icon": "open",
		"click .button.edit": "openEditDialog",
		"click .button.delete": "destroy"
	},
	initialize: function() {
		this.listenTo(this.model, "change", this.render);
	},
	render: function() {
		// ...
	}
});
// new View([options])
// view.el; all views have a DOM element at all times, views can be rendered at any time and inserted into the DOM all at once
// default an empty di
var ItemView = Backbone.View.extend({
	tagName: 'li'
});
var BodyView = Backbone.View.extend({
	el: 'body'
});
// view.$el; cached jQuery object for the view's element
view.$el.show();
listView.$el.append(itemView.el);
// view.setElement(element); to apply a Backbone view to a different DOM element
// view.attributes; hash of attributes that will be set as HTML DOM element attributes on view's el or function that returns hash
// view.$(selector); runs queries scoped within the view's element; view.$el.find(selector)
// view.template([data])
var LibraryView = Backbone.View.extend({
	template: _.template(...)
});
// view.render(); renders view template from model data, return this at the end of render to enable chaiend calls
var BookMark = Backbone.View.extend({
	template: _.template(...),
	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	}
});
// view.remove(); removes a view and its el from the DOM and calls stopListening to remove any bound events that the view has listenTo'd
// view.events or view.events(); see the events hash to specify a set of DOM events that will be bound to methods on your View through delegateEvents
// delegateEvents([events]); uses jQuery's on to provide declarative callbacks for DOM events within a view
// {"event selector": "callback"}
// undelegateEvents(); removes all of the view's delegated events

// Utility //
// Backbone.noConflict(); returns Backbone object back to its original value and can use return value of it to keep a local reference
// to Backbone, useful for embedding Backbone on third-party websites
var localBackbone = Backbone.noConflict();
var model = localBackbone.model.extend(...);
// Backbone.$ = $; if have multiple copies of jQuery on the page or simply want to tell Backbone to use a particular object as its DOM/Ajax library
Backbone.$ = require('jquery');


/* Marionette Documentation Notes (2.4.7) */
// Common concepts: class-based inheritance using _.extend, value attributes passed in class, functions returning values,
// function context assign instance of new class as this, binding attributes on instantiation, setting options to override
// class-based attributes when you need to, getOption, mergeOptions (matching keys will be merged onto class instance)

// Marionette.View //
// exists as a base view for other view classes to be extended from and to provide common location for behaviors that are shared
// across all views (not intended to e used directly)
// extends Backbone.View, recommended to use listenTo method to bind model, collection, or other events from Backbone and Marionette objects
var MyView = Marionette.ItemView.extend({
	initialize: function() {
		// this automatically set to the view
		this.listenTo(this.model, "change:foo", this.modelChanged);
		this.listenTo(this.collection, "add", this.modelAdded);
	},

	modelChanged: function(model, value) {},

	modelAdded: function(model) {}
});

// "show"/onShow event
// called on the view instance when the view has been rendered and displayed
// event can be used to react to when a view has been shown via a region
Marionette.ItemView.extend({
	onShow: function() {
		// React to when a view has been shown
	}
});
// Add children views
var LayoutView = Marionette.LayoutView.extend({
	regions: {
		Header: 'header',
		Section: 'section'
	},
	onShow: function() {
		this.showChildView('Header', new Header());
		this.showChildView('Section', new Section());
	}
});

// destroy
// called by region managers automatically, calls an onBeforeDestroy event on view, onDestroy
// unbinds all custom view events, unbinds all DOM events, removes this.el from DOM, unbind all listenTo events, returns view
// onBeforeDestroy before view destroys
var MyView = Marionette.ItemView.extend({
	onDestroy: function(arg1, arg2) {
		// Custom cleanup or destroying code here
	}
});

// "attach"/onAttach event
// triggered anytime that showing the view in a Region causes it to be attached to the document, great for jQuery plugins/other logic
// only fired when view becomes a child of the document, propagates down the view tree like from CollectionView to children views
// before:attach/onBeforeAttach

// "dom:refresh"/onDomRefresh event
// Triggered after the view has been rendered, has been shown in the DOM via a Marionette Region and has been re-rendered
// useful for DOM-dependent UI plugins
Marionette.ItemView.extend({
	onDomRefresh: function() {
		// Manipulate 'el' here that is rendered and full of view's HTML
	}
});

// events
// events and ui hash syntactic sugar
var MyView = Marionette.ItemView.extend({
	ui: {
		"cat": ".dog"
	},

	events: {
		"click @ui.cat": "bark"
	}
});

// triggers
// define as a hash to convert a DOM event into a view.triggerMethod call
// by default all triggers stopped with preventDefault and stopPropagation methods
var MyView = Marionette.ItemView.extend({
	// ...
	triggers: {
		"click .do-something": "something:do:it"
	}
});
var view = new MyView();
view.render();
view.on("something:do:it", function(args) {
	alert("I did it!");
});
view.$('.do-something').trigger('click');
// More syntactic sugar
Marionette.CompositeView.extend({
	ui: {
		'something': '.do-something'
	}
	triggers: {
		"click @ui.something": {
			event: "something:do:it",
			preventDefault: true,
			stopPropagation: false
		}
	}
});
// trigger event handler will receive a single argument that includes the view, model, collection
view.on("some:event", function(args) {
	args.view; // view instance that triggered the event
	args.model; // view.model if set on the view
	args.collection; // view.collection if set on the view
});

// modelEvents and collectionEvents
// more hashes for data, listenTo is memory safe, sets the context of this to be the view
// bound and unbound with Backbone.View delegateEvents and undelegateEvents
// can also have multiple callback functions separated by a space, can be inlined function
// can do event configuration as a function
Marionette.CompositeView.extend({
	modelEvents: {
		"change:name": "nameChanged" // equivalent to view.listenTo(view.model, "change:name", view.nameChanged, view)
	},

	collectionEvents: {
		"add": "itemAdded" // equivalent to view.listenTo(view.collection, "add", view.itemAdded, view)
	},

	// event handler methods
	nameChanged: function() {}
	itemAdded: function() {}
});

// serializeModel
// bindUIElements
// for cases when you need to access ui elements inside the view to retrieve their data or manipulate them
// already taken care of in ItemView and CompositeView in render method for ui hash
// mergeOptions(options object, keys)
var ProfileView = Marionette.ItemView.extend({
	profileViewOptions: ['user', 'age'],
	initialize: function(options) {
		this.mergeOptions(options, this.profileViewOptions);
		console.log('The merged options are: ', this.user, this.age);
	}
});
// getOption to retrieve an object's attribute, or this.options
// bindEntityEvents - bind a backbone "entity" to methods on target object to support modelEvents and collectionEvents
// templateHelpers - can be applied to any View object that renders a template with more logic, when this attribute is
// present its contents will be mixed in to the data object that comes back from the serializeData method
// this is also a good place to add data not returned from serializeData
// can change which template is rendered for a view -> getTemplate: funciton() { ... }
var MyView = Marionette.ItemView.extend({
	template: '#my-template',
	templateHelpers: function() {
		return {
			showMessage: function() {
				return this.name + " is the coolest!";
			},
			percent: this.model.get('decimal') * 100
		};
	}
});
// UI interpolation
var MyView = Marionette.ItemView.extend({
	ui: {
		buyButton: '.buy-button',
		checkoutSection: '.checkout-section'
	},
	events: {
		'click @ui.buyButton': 'onClickBuyButton'
	},
	regions: {
		checkoutSection: '@ui.checkoutSection'
	},
	onShow: function() {
		this.getRegion('checkoutSection').show(new CheckoutSection({
			model: this.checkoutModel
		}));
	}
});


// Marionette.CollectionView //
// loops through all the models in the specified collection, render each of them using a specified childView
// then append the results of the child view's el to the collection view's el
// default maintains a sorted collection's order in the DOM (can be disabled by {sort: false})

// childView
var MyChildView = Marionette.ItemView.extend({});

Marionette.CollectionView.extend({
	childView: MyChildView
});

// getChildView - returns class that will be instantiated when a model needs to be initially rendered
// allows you to customize per Model ChildViews
var MyCollectionView = Marionette.CollectionView.extend({
	getChildView: function(item) {
		// Choose which view class to render, depending on the properties of the item model
		if (item.get('isFoo')) {
			return FooView;
		} else {
			return BarView;
		}
	}
});
var collectionView = new MyCollectionView({
	collection: new Backbone.Collection()
});
var foo = new FooBar({
	isFoo: true
});
var bar = new FooBar({
	isFoo: false
});
collectionView.collection.add(foo);
collectionView.collection.add(bar);

// childViewOptions
// pass data from your parent collection view in to each of the childView instances
var CollectionView = Marionette.CollectionView.extend({
	childViewOptions: function(model, index) {
		// do some calculations based on the model
		return {
			foo: "bar",
			childIndex: index
		};
	}
});

// childViewEventPrefix
// can customize the event prefix for events that are forwarded through the collection view
var CollectionView = Marionette.CollectionView.extend({
	childViewEventPrefix: "some:prefix"
});

// childEvents hash or method permits handling of child views without manually setting bindings
// catches custom events fired by a child view
var MyCollectionView = Marionette.CollectionView.extend({
	childEvents: function() {
		return {
			render: this.onChildRendered
		};
	},
	onChildRendered: function() {
		console.log('A child view has been rendered.');
	}
});

// Child view fires a custom event 'show:message'
var ChildView = Marionette.ItemView.extend({
	// Events hash defines local event handlers that in turn may call 'triggerMethod'
	events: {
		'click .button': 'onClickButton'
	},

	// Triggeres hash converts DOM events directly to view events catchable on parent
	triggers: {
		'submit form': 'submit:form'
	},

	onClickButton: function() {
		// Both 'trigger' and 'triggerMethod' events will be caught by parent
		this.trigger('show:message', 'foo');
		this.triggerMethod('show:message', 'bar');
	}
});

// Parent uses childEvents to catch the child view's custom events
var ParentView = Marionette.CollectionView.extend({
	childView: ChildView,

	childEvents: {
		'show:message': 'onChildShowMessage',
		'submit:form': 'onChildSubmitForm'
	},

	onChildShowMessage: function(childView, message) {
		console.log('A child view fired show:message event with ' + message);
	},

	onChildSubmitForm: function(childView) {
		console.log('A child view fired submit:form');
	}
});

// buildChildView
// when custom view instance needs to be created for the childView
buildChildView: function(child, ChildViewClass, childViewOptions) { ... }
// removeChildView
// remove a specific view instance and destroy it, updates the indices of later views to keep in sync
// addChild
// rendering childViews and adds them to HTML, triggers events per ChildView
// reorderOnSort
// useful if have performance issues, there will be no re-rendering but DOM nodes will be reordered
// emptyView
// when a collection has no children and you need to render a view other than the list of childViews
// getEmptyView
// if you need the emptyView's class chosen dynamically
// isEmpty
// to override when the empty view is rendered
// emptyViewOptions
// defaults to sending in childViewOptions if not specified
// destroyChildren
// destroys only its childViews but keeps data in the collection

// Callback methods
// onBeforeRender
// onRender
// onBeforeReorder
// onReorder
// onBeforeDestroy
// onDestroy
// onBeforeAddChild
// onAddChild
// onBeforeRemoveChild
// onRemoveChild

// CollectionView Events
// each called with the Marionette.triggerMethod function which calls a corresponding "on{EventName}" method on view instance
// "before:render"/:collection" / onBeforeRenderCollection, only emitted if collection is not empty
// "render" / onRenderCollection
// "before:reorder" / "reorder"
// "before:destroy" // onBeforeDestroyCollection
// "destroy" / "destroy:collection"
// "before:add:child" / "add:child"
// "before:remove:child" / "remove:child"
// "childview:*" event bubbling from child views i.e. "childview:do:something" from child's "do:something"
// "before:render:collection"

// render responsible for rendering entire collection, loops through each of the children and renders them individually as
// a childview; after initial render, "add", "remove", and "reset" events of collection specified
// appends the HTML of each ChildView into the element buffer and call jQuery's .append once at the end to move the HTML into
// collection view's el
// resortView, viewComparator, filter to prevent some of the underlying collection's models from being rendered as child views
// uses Backbone.BabySitter to store and manage its child views i.e. cv.children.findByModel(someModel); cv.children.each((view) => { })
// destroy called by region managers automatically that unbinds all listenTo events, custom events, DOM events, child views that were rendered
// removes this.el from DOM, calls an onDestroy event on view and CollectionView is returned

// Marionette.Region //
// provide consistent methods to manage, show, and destroy views in your applications and layouts, use jQuery selector
// to show views in correct place
// add regions to applications by calling addRegions method on app instance
// to access MyApp.mainRegion and MyApp.navigationRegion
MyApp.addRegions({
	mainRegion: '#main-content',
	navigationRegion: '#navigation'
});
// add regions via LayoutViews
var AppLayoutView = Marionette.LayoutView.extend({
	template: '#layout-view-template',

	regions: {
		menu: '#menu',
		content: '#content'
	}
});
var layoutView = new AppLayoutView();
layoutView.render();
layoutView.menu.show(new MenuView());
layoutView.getRegion('menu').show(new MenuView());
layoutView.showChildView('content', new MainContentView());

// Configuration types
// jQuery string selector
App.addRegions({
	mainRegion: '#main'
});
// region class
var MyRegion = Marionette.Region.extend({
	el: '#main-nav'
});
App.addRegions({
	navigationRegion: MyRegion
});
// object literal
// expect a selector or el property or supply a regionClass
var MyRegion = Marionette.Region.extend();
var MyOtherRegion = Marionette.Region.extned();
var MyElRegion = Marionette.Region.extend({ el: '#footer' });

App.addRegions({
	contentRegion: {
		el: '#content',
		regionClass: MyRegion
	},
	navigationRegion: {
		el: '#navigation',
		regionClass: MyOtherRegion
		navigationOption: 42,
		anotherNavigationOption: 'foo'
	},
	footerRegion: {
		regionClass: MyElRegion
	}
});
// mix and match
// initialize a region with an el
// showing a view
// can call its show and empty methods to display and shutdown a view
var myView = new MyView();
MyApp.getRegion('mainRegion').show(myView, options);
// empties the current view
MyApp.getRegion('mainRegion').empty();
// preventDestroy
// show by default destroys the previous view so you can stop that with { preventDestroy: true }
// forceShow
// if you re-call show with the same view nothing will happen by default so you can { forceShow: true }
// onBeforeAttach and onAttach triggered on show - can disable them

// if you wish to check whether the region has a view, you can use hasView function
// reset - destroys any existing view and deletes the cached el, useful when regions re-used across view instances 
// and in unit testing
// override the region's attachHtml method to change how the view is attached to the DOM, can add custom rendering
Marionette.Region.prototype.attachHtml = function(view) {
	this.$el.hide();
	this.$el.html(view.el);
	this.$el.slideDown("fast");
};

// can set currentView on initialization
// call attachView on Region
// events raised on Region during show()
// before:show/onBeforeShow, show/onShow, before:swap/onBeforeSwap, swap/onSwap
// before:swapOut/onBeforeSwapOut, before:empty/onBeforeEmpty, empty/onEmpty
