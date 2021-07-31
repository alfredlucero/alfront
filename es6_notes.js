/***** Array Helper Methods *****/

/*
	forEach: 
	Loops through each of the elements in arr and returns values like arr[i]
	in callback iterator function
	i.e. looping through all emails to delete and calling function to delete each

	arr.forEach(function(arrElement) { ... });
*/
// Log all the colors in an array
var colors = [ 'red', 'blue', 'green'];

colors.forEach(function(color) {
	console.log(color);
});

// vs. old way traditional for loop
for (var i = 0; i < colors.length; i++) {
	console.log(colors[i]);
}

// Sum up numbers in an array
var numbers = [ 1, 2, 3, 4, 5 ];
var sum = 0;

function adder(number) {
	sum += number;
}

numbers.forEach(adder);

/*
	map:
	Loops through each of the elements in arr to alter in callback function
	and return new array as result (doesn't alter original arr)
	i.e. transforming posts array json and mapping to HTML posts

	arr.map(function(arrElement) { ... });
*/
var numbers = [ 1, 2, 3 ];
var doubledNumbers = [];

// Old way to double numbers and place in new array
for (var i = 0; i < numbers.length; i++) { 
	doubledNumbers.push(numbers[i] * 2);
}

var doubled = numbers.map(function(number) { 
	return number * 2;
});

// Get the prices from cars array (plucking properties from objects in array)
var cars = [
	{ model: 'Lexus', price: 'expensive' },
	{ model: 'Mercedes', price: 'cheap' }
];

var prices = cars.map(function(car) {
	return car.prices;
});

// Plucking out property value from each object in a new array
function pluck(array, property) {
	return array.map(function(arrayElement) {
		return arrayElement[property];
	});
}


/*
	filter: 
	Loop through each element in array to filter out based on certain criteria in callback
	Returns a new array with filtered elements that pass conditions (iterator callback returns boolean)
	i.e. returning list of all comments associated with a post

	arr.filter(function(arrElem) { ... });
*/
// Filtering products the old way for fruit types
var products = [
	{ name: 'cucumber', type: 'vegetable', quantity: 0, price: 1 },
	{ name: 'banana', type: 'fruit', quantity: 10, price: 15 },
	{ name: 'celery', type: 'vegetable', quantity: 30, price: 13 },
	{ name: 'orange', type: 'fruit', quantity: 3, price: 5 }
];
var filteredProducts = [];

for (var i = 0; i < products.length; i++) {
	if (products[i].type === 'fruit') {
		filteredProducts.push(products[i]);
	}
}

// New filter way for fruit types
products.filter(function(product) {
	return product.type === 'fruit';
});

// Filtering out vegetables, quantity > 0, price < 10
products.filter(function(product) {
	return product.type === 'vegetable' 
		&& product.quantity > 0
		&& product.price < 10;
});

/*
	find:
	Loop through each element in array to find one specific element and break out
	Returns first element that matches (iterator function must return a boolean)
	i.e. finding a specific post from url like forum.com/posts/45

	arr.find(function(arrElem) { ... });
*/
// Old way for finding a user with a certain name
var users = [
	{ name: 'Jill' },
	{ name: 'Alex' },
	{ name: 'Bill' }
];
var user;

for (var i = 0; i < users.length; i++) {
	if (users[i].name === 'Alex') {
		user = users[i];
		break;
	}
}

// New way using find
users.find(function(user) {
	return user.name === 'Alex';
});

/*
	every/some:
	Loops through each element in array and checks if everything follows a boolean condition
	or only some elements pass a boolean condition in the iterator callback function
	every is like ANDing all elements for passing/failing conditions
	some is like ORing all elements for passing/failing conditions
	i.e. login form validation, some pending requests, checking all elements passing condition

	arr.every(function(arrElem) { ... });
	arr.some(function(arrElem) { ... });
*/
var computers = [
	{ name: 'Apple', ram: 24 },
	{ name: 'Compaq', ram: 4 },
	{ name: 'Acer', ram: 32 }
];

var allComputersCanRunProgram = true;
var onlySomeComputersCanRunProgram = false;

for (var i = 0; i < computers.length; i++) {
	var computer = computers[i];

	if (computer.ram < 16) {
		allComputersCanRunProgram = false;
	} else {
		onlySomeComputersCanRunProgram = true;
	}
}

// New way to check for all computer can run using every
computers.every(function(computer) {
	return computer.ram > 16;
});

// New way to check for some computers can run using some
computers.some(function(computer) {
	return computer.ram > 16;
});

/*
	reduce:
	Lets you condense lists, accumulate elements in the array given an initial value
	First argument in callback is the accumulator/previous, second argument in callback is array element value
	Make sure to return the accumulator/previous in the function

	arr.reduce(function(accumulator, arrElem) { ... }, initialValue);
*/
// Old way to sum up numbers in array
var numbers = [ 10, 20, 30 ];
var sum = 0;

for (var i = 0; i < numbers.length; i++) {
	sum += numbers[i];
}

// New way with reduce
numbers.reduce(function(sum, number) {
	return sum + number;
}, 0);

// Imitate mapping of property values of objects in array
var primaryColors = [
	{ color: 'red' },
	{ color: 'yellow' },
	{ color: 'blue' }
];

primaryColors.reduce(function(previous, primaryColor) {
	previous.push(primaryColor);

	return previous;
}, []);

// Solving the balanced parentheses interview question
// Increment counter for every open paren (
// Decrement counter for every closed paren )
// Returns true if counter is 0 at the end, false otherwise
function balancedParens(str) {
	return !str.split('').reduce(function(previous, character) {
		if (previous < 0) { return previous; } // Handles ")(" case
		if (character === '(') { return ++previous; }
		if (character === ')') { return --previous; }

		return previous;
	}, 0);
}

/***** Variable Declarations *****/
// Old var way, expect value to change, function scope
var color = 'red';

/*
	const:
	Expect the value to never change
*/
const name = 'Alfred';

/*
	let:
	Expect the value to change over time, block scope
*/
let title = 'Software Engineer';
title = 'Senior Software Engineer';

/***** Template Strings *****/
// Old way of string concatenation with a number
function getMessage() {
	const year = new Date().getFullYear();

	return "The year is " + year;
}

/*
	`Template string... ${JS expression}`
*/
function getMessageTemplate() {
	const year = new Date().getFullYear();

	// Can put an expression inside the curly braces
	return `The year is ${year}`;
}

/***** Fat Arrow Functions *****/
// Old way of declaring functions
const add = function(a, b) {
	return a + b;
}

/*
	Binds the value of 'this' to the surrounding context
	(args) => { ... }
*/

// New fat arrow way
const adder = (a, b) => {
	return a + b;
}
// Or if single javascript expression (omit curlies), multiple arguments implicit return
const shortAdder = (a, b) => a + b;
// Or if single argument, single javascript expression (omit curlies), can omit argument parentheses
const doubleNumber = number => 2 * number;

const numbers = [ 1, 2, 3 ];
numbers.map(number => number * 2);

const team = {
	members: ['Jane', 'Bill'],
	teamName: 'Super Squad',
	teamSummary: function() {
		return this.members.map((member) => {
			return `${member} is on team ${this.teamName}`;
		});
	}
};

/***** Enhanced Object Literals *****/
// Old way of returning object literals
function createBookShop(inventory) {
	return {
		inventory: inventory,
		inventoryValue: function() {
			return this.inventory.reduce((total, book) => total + book.price, 0);
		},
		priceForTitle: function(title) {
			return this.inventory.find(book => book.title === title).price;
		}
	};
}

const inventory = [
	{ title: 'Harry Potter', price: 10 },
	{ title: 'Eloquent JavaScript', price: 15 }
];

const bookShop = createBookShop(inventory);

/*
	{
		// Key/value with identical names can be condensed to one name
		sameKeyValueName, 
		// Rather than doing functionName: function() { ... }
		functionName() { ... }
	}
*/

// New way of returning the object literal
function createNewBookShop(inventory) {
	return {
		inventory,
		inventoryValue() {
			return this.inventory.reduce((total, book) => total + book.price, 0);
		},
		priceForTitle(title) {
			return this.inventory.find(book => book.title === title).price;
		}
	};
}

/***** Default Function Arguments *****/
// Old way to make a request with default arguments
// i.e. called like makeAjaxRequest('google.com');
function makeAjaxRequest(url, method) {
	if (!method) {
		method = 'GET';
	}

	// Logic to make the request
}

/*
	function sampleFunc(args, argDefault = 'defaultValue')
	undefined also gets assigned to default value, null doesn't
*/
// New way to make a request using default arguments
function makeAjaxRequestWithDefault(url, method = 'GET') {
	return method;
}

function User(id) {
	this.id = id;
}

function generateId() {
	return Math.random() * 9999999;
}

function createAdminUser(user = new User(generateId())) {
	user.admin = true;

	return user;
}

createAdminUser();

/***** Rest and Spread Operators *****/
// Old way to add numbers given an array
function addNumbers(numbers) {
	return numbers.reduce((sum, number) => {
		return sum + number;
	}, 0);
}

// How about addNumbers(1,2,3,4,5) rather than addNumbers([1,2,3])?

/*
	Rest operator:
	Useful for when you have unknown number of arguments and want to put in
	single array, to capture a list of variables, good for passing in arguments into functions

	function(...args)
*/
function addNumbers(...numbers) {
	return numbers.reduce((sum, number) => sum + number, 0);
}

const MathLibrary = {
	calculateProduct(...rest) {
		console.log('Please use the multiply method instead');
		return this.multiply(...rest);
	},
	multiply(a, b) {
		return a * b;
	}
}; 

/*
	Spread operator:
	To flatten or spread out the array, joining elements together from different arrays
	
	[ 'arrayElement', ...args, ...args2 ]
*/
const defaultColors = ['red', 'green'];
const userFavoriteColors = ['orange', 'yellow'];

defaultColors.concat(userFavoriteColors);

// New way using spread operator
[ 'blue', ...defaultColors, ...userFavoriteColors ];

function validateShoppingList(...items) {
	if (items.indexOf('milk') < 0) {
		return [ 'milk', ...items ];
	} 

	return items;
}


/***** Destructuring *****/
// Old way of getting property values from object
var expense = {
	type: 'Business',
	amount: '$45 USD'
};

var type = expense.type;
var amount = expense.amount;

// New destructing way, name of variable must be same name as property
const { type, amount } = expense;

// Old way of accessing function argument object
var savedFile = {
	extension: 'jpg',
	name: 'repost',
	size: 14040
};

function fileSummary(file) {
	return `The file ${file.name}.${file.extension} is of size ${file.size}`;
}

// New destructuring way to gain access to argument object properties
function newFileSummary({ name, extension, size }) {
	return `The file ${name}.${extension} is of size ${size}`;
}

// Destructuring arrays, order of elements matter
const companies = [ 'Google', 'Facebook', 'Uber' ];

// Old way of getting first element
const firstCompany = companies[0];

// New way of getting elements
const [ google, fb, uber ] = companies;

// Can also use spread operator with destructuring
// This separates out first element and puts the rest of the elements in another array
const [ name, ...rest ] = companies;

// Old way of getting object properties from array of objects
const companies = [
	{ name: 'Google', location: 'Mountain View' },
	{ name: 'Facebook', location: 'Menlo Park' },
	{ name: 'Uber', location: 'San Francisco' }
];

var location = companies[0].location;

// Destructuring arrays and objects at the same time, works outside in
// gives back first element in array and takes out location property from that first object
const [{ location }] = companies;

const Google = {
	locations: ['Mountain View', 'New York', 'London']
};

// Extract first object property then taking out first element in property value array
const { locations: [ mtnView ] } = Google;
// This extracts the whole locations array
const { locations: locations } = Google;

// Example application, helps us to avoid order of multiple function arguments
// can just destructure all the properties we want from object function argument
const user = {
	username: 'myname',
	password: 'mypassword',
	email: 'myemail',
	dateOfBirth: '1/17/1995',
	city: 'New York'
};

signup(user);

function signup({ username, password, email, dateOfBirth, city }) {
	console.log(`Username: ${username} Password: ${username} ${email} ${dateOfBirth} ${city}`);
}

// Convert these to x, y coordinate objects
const points = [
	[4, 5],
	[10, 1],
	[0, 40]
];
// Old way
points.map(pair => {
	const x = pair[0];
	const y = pair[1];
});

// New way
points.map(([ x, y ]) => {
	return { x, y };
});

// Double numbers recursively
const numbers = [1, 2, 3];

function double(numbers) {
    const [ number, ...rest ] = numbers;
    if (!number) {
        return numbers;
    } else {
        return numbers = [ number * 2, ...double(rest) ];
    }
}

/***** Introduction to Classes *****/
// Old way of dealing with prototypal inheritance, objects linked to other objects
function Car(options) {
	this.title = options.title;
}

Car.prototype.drive = function() {
	return 'vroom';
}

const car = new Car({ title: 'Lexus' });
car.drive();

function Toyota(options) {
	Car.call(this, options);
	this.color = options.color;
}

Toyota.prototype = Object.create(Car.prototype);
Toyota.prototype.constructor = Toyota;
Toyota.prototype.honk = function() {
	return 'beep';
}

const toyota = new Toyota({ color: 'red', title: 'Daily Driver' });
toyota.drive();
toyota.honk();

// Refactoring prototypal inheritance with classes, syntactic sugar
class Car {
	constructor({ title }) {
		this.title = title;
	}

	drive() {
		return 'vroom';
	}
}

// Set Car as its prototype by using extends
class Toyota extends Car {
	constructor(options) {
		// Need to call Car's constructor method too
		super(options); // Car.constructor(), can work with any other method with same name in superclass as well
		this.color = options.color;
	}

	honk() {
		return 'beep';
	}
}

const toyota = new Toyota({ color: 'red', title: 'Toyota' });

/***** for...of *****/
// Iterating through arrays of data
const colors = ['red', 'green', 'blue'];

for (let color of colors) {
	console.log(color);
}

const numbers = [1,2,3,4];
let total = 0;
for (let number of numbers) {
	total += number;
}

/***** Generators *****/
// Can run some code, return a value, and go back into the function at same place you left it
// Can enter and exit the function many times
function* numbers() {
	yield;
}

const gen = numbers();
gen.next(); // {"done": false}, goes through numbers function up to yield
gen.next(); // {"done": true}, goes through rest of function and finishes

function* shopping() {
	// Stuff on the sidewalk

	// Walking down the sidewalk

	// Go into the store with cash
	const stuffFromStore = yield 'cash';

	// Walking to laundry place
	const cleanClothes = yield 'laundry';

	// Walking back home 
	return [stuffFromStore, cleanClothes];
}

// Stuff in the store
const gen = shopping(); // Doesn't invoke any code whatsoever
gen.next(); // Leaving our house, going on sidewalk, goes into store from yield
// value = cash, done = false

// Walked into the store
// Walking up and down the aisles
// Purchase our stuff

gen.next('groceries'); // Leaving the store with groceries, back to generator sidewalk on yield
// stuffFromStore = 'groceries', value = laundry, done = true

// Pass back clean clothes from laundry
gen.next('clean clothes');
// value: 'groceries', 'clean clothes' done: true

function* colors() {
	yield 'red';
	yield 'blue';
	yield 'green';
}

const gen = colors();
gen.next(); // executes everything up to first yield
gen.next(); // executes everything up second yield
gen.next(); // executes everything up to third yield
gen.next(); // "done": "true"

/*
	Generators:
	Allows you to pause between different functions, works with for...of
	for n yields, need n+1 next, iterate through any data structure we want

	function* gener() { ... yield ''; ... }
	const gen = gener();
	gen.next();
	gen.next();
*/

const myColors = [];
// For every yielded value, places in color, don't have to worry about done true/false
for (let color of colors()) {
	myColors.push(color);
}


// Use generators to iterate through object's employees, iterate through certain properties you want
const engineeringTeam = {
	testingTeam,
	size: 3,
	department: 'Engineering',
	lead: 'Jill',
	manager: 'Alex',
	engineer: 'Dave'
};

const testingTeam = {
	lead: 'Amanda',
	tester: 'Bill'
};

function* TeamIterator(team) {
	yield team.lead;
	yield team.manager;
	yield team.engineer;

	// Delegating of generator to testing team one
	const testingTeamGenerator = TestingTeamIterator(team.testingTeam);
	// Can yield the rest of the testing team generator in the same for of loop
	yield* testingTeamGenerator;
}

function* TestingTeamIterator(team) {
	yield team.lead;
	yield team.tester;
}

const names = [];
// Helps you iterate through two generators together to get all the team members
for (let name of TeamIterator(engineeringTeam)) {
	names.push(name);
}

// New way using Symbol.iterator to clean it up more and look better in for...of
// Don't need to make more separate generator functions
const testingTeam = {
	lead: 'Alfred',
	tester: 'Regine',
	[Symbol.iterator]: function* () {
		yield this.lead;
		yield this.tester;
	}
};

// If the object has a [Symbol.iterator] key, it will use that way to iterate
// through in for...of
const engineeringTeam = {
	testingTeam,
	lead: 'Rob',
	manager: 'Ryan',
	engineer: 'Lolo',
	size: 3,
	department: 'CS',
	[Symbol.iterator]: function* () {
		yield team.lead;
		yield team.manager;
		yield team.engineer;
		// Iterates through this object the way that [Symbol.iterator] generator defined it
		// Goes through another generator, generator delegation to walk through that object
		yield* this.testingTeam;
	}
};

const names = [];
for (let name of engineeringTeam) {
	names.push(name);
}

// Example generators with recursion, nested comments with children (comment trees in reddit)
// Iterate through tree structures
class Comment {
	constructor(content, children) {
		this.content = content;
		this.children = children;
	}

	*[Symbol.iterator]() {
		yield this.content;
		// Yield through every child iterable
		for (let child of this.children) {
			yield* child;
		}
	}
}

const children = [
	new Comment('good comment', []),
	new Comment('bad comment', []),
	new Comment('meh', [])
];
const tree = new Comment('Great post!', children);

const values = [];
for (let value of tree) {
	values.push(value);
}

/***** Promises and Fetch *****/
// Code execution, want asynchronous requests to complete first before continuing on with something
// 3 States of Promises
// Unresolved: waiting for something to finish
// Resolved: something finished and it all went okay
// Rejected: something finished and something went bad
// Promise -> 'resolved' -> then callback
// Promise -> 'rejected' -> catch callbacks
promise = new Promise((resolve, reject) => {
	var request = new new XHTMLRequest();

	// async request
	request.onload = () => {
		resolve();
	};
});

promise
	.then(() => console.log('Finally finished with promise'))
	.then(() => console.log('I was also ran!'))
	.catch(() => console.log('Rejected here'));

// AJAX requests with Fetch helper that returns a Promise
// Response does not contain data immediately, contains response from server with headers/status
// Need to call method on it .json to get 


/*
	Service workers: Method that enables applications to take advantage of persistent background processing including hooks
	to enable bootstrapping of web apps while offline
	Offline Strategy with Service Workers
	- Register a service worker
	- Install a service worker
	- Versioning setup for a service worker
	- Cache population setup for a service worker
	- Activate a service worker
	- Managing cache for a service worker
	- Intercepting requests with a service worker

	- fetch fired every time browser is going to request a file
	- for HTML requests, try network first. If it fails, try to fetch cache.
		If all fails, show the offline page
	- for file requests, try to fetch files from cache first. If it fails make a network request.
		If it fails, use fallback.
	- Service workers require a secure connection (HTTPS) and based on ES6 Promises
	- Cache API is completely separate from HTTP cache. Response is a stream; to cache it, you need to copy it first.
	- Service worker can have multiple caches and can be registered many times; the browser will figure it out.
	- If a service worker is broken, browsers will skip the code and fall back to the network.
	- Service workers use only asynchronous APIs e.g. they can't work with localStorage (synchronous)
*/
