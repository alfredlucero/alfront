/* 
 * Frontend Interview Notes for All Things JS 
 */

/*
 * Scoping, Hoisting, this, var/let/const
 */
// var:
// - variable declarations processed before any code is executed
// -> scope of var is its current execution context which is either enclosing function
// or for those declared outside any function they are global
// -> assigning value to an undeclared variable implicitly creates it as a global variable
// -> declared vars are non-configurable property of execution context function (cannot call delete this.someVar)
// -> defines variable globally or locally to an entire function regardless of block scope
function x() {
  y = 1; // Throws a ReferenceError in strict mode
  var z = 2;
}

x();

console.log(y); // logs "1"
console.log(z); // Throws a ReferenceError: z is not defined outside x
// - hoisting: variable declarations/declarations in general processed before any code is executed so declaring a variable
// anywhere in the code is equivalent to declaring it at the top so this means that a variable can appear to be used before it's declared
// -> appears that the variable declaration is moved to top of function or global code
bla = 2;
var bla;
// is implicitly understood as
var bla;
bla = 2;

function doSomething() {
  console.log(bar); // undefined
  var bar = 111;
  console.log(bar); // 111
}
// -> recommended to always declare variables at top of their scope
// - let statement declares a block scope local variable and optionally initializing it to a value
let x = 1;
if (x === 1) {
  let x = 2;
  console.log(x); // 2
}
console.log(x); // 1
// - const: block-scoped but value of constant cannot change through re-assignment and can't be redeclared
// -> though you can alter object/arrays that const variable refers to through its methods but not reassign

// this: in most cases, the value of this is determined by how a function is called and can't be set by assignment
// during execution and may be different each time function is called
// - bind method to set value of function's this regardless of how it's called
// - arrow functions don't provide their own this binding but retains this value of enclosing lexical context
var test = {
  prop: 42,
  func: function() {
    return this.prop;
  },
};

console.log(test.func());
// expected output: 42
// - in global context (outside of any function), refers to global object whether in strict mode or not
// In web browsers, the window object is also the global object:
console.log(this === window); // true

a = 37;
console.log(window.a); // 37

this.b = "MDN";
console.log(window.b); // "MDN"
console.log(b); // "MDN"
// - can use call (for comma split arguments) or apply (for array of arguments) to set this context
// i.e. An object can be passed as the first argument to call or apply and this will be bound to it.
var obj = { a: "Custom" };

// This property is set on the global object
var a = "Global";

function whatsThis(arg) {
  return this.a; // The value of this is dependent on how the function is called
}

whatsThis(); // 'Global'
whatsThis.call(obj); // 'Custom'
whatsThis.apply(obj); // 'Custom'
// - using bind creates a new function with the same body and scope but this is bound to a different object
function f() {
  return this.a;
}

var g = f.bind({ a: "azerty" });
console.log(g()); // azerty

/*
 * Prototypal Inheritance
 */
// - All objects in JavaScript inherit from at least one other object = prototype and inherited properties can be
// found in prototype object of constructor
// - Classes are still protoype-based and just syntactic sugar
// - only have objects and each has a private property that holds a link to another object called its prototype
// -> prototype has a prototype of its own until an object is reached with null; null has no prototype and acts as final link
// in prototype chain
// - nearly all objects instances of Object which sits on top of prototype chain
// - objects as dynamic bags of properties (own properties), have a link to a prototype object
// -> when trying to access a property of an object, the property will not only be sought on the object but on the prototype of the object,
// the prototype of the prototype, and so on until either a property with a matching name is found or the end of the prototype chain is reached
// -> when an inherited function is executed, the value of this points to the inheriting object, not to the prototype object where the function is an own property
// i.e. someObject.[[Prototype]], can be accessed with Object.getPrototypeOf() and Object.setPrototypeOf() === ___proto___
// i.e. Let's create an object o from function f with its own properties a and b:
let f = function() {
  this.a = 1;
  this.b = 2;
};
let o = new f(); // {a: 1, b: 2}

//add properties in f function's prototype
f.prototype.b = 3;
f.prototype.c = 4;

// do not set the prototype f.prototype = {b:3,c:4}; this will break the prototype chain
// o.[[Prototype]] has properties b and c:
// Finally, o.[[Prototype]].[[Prototype]] is null.
// This is the end of the prototype chain, as null,
// by definition, has no [[Prototype]].
// Thus, the full prototype chain looks like:
// {a: 1, b: 2} ---> {b: 3, c: 4} ---> null

console.log(o.a); // 1
// Is there an 'a' own property on o? Yes, and its value is 1.

console.log(o.b); // 2
// Is there a 'b' own property on o? Yes, and its value is 2.
// The prototype also has a 'b' property, but it's not visited.
// This is called "property shadowing."

console.log(o.c); // 4
// Is there a 'c' own property on o? No, check its prototype.
// Is there a 'c' own property on o.[[Prototype]]? Yes, its value is 4.

console.log(o.d); // undefined
// Is there a 'd' own property on o? No, check its prototype.
// Is there a 'd' own property on o.[[Prototype]]? No, check its prototype.
// o.[[Prototype]].[[Prototype]] is null, stop searching,
// no property found, return undefined.

// Using Object.create
var a = { a: 1 };
// a ---> Object.prototype ---> null

var b = Object.create(a);
// b ---> a ---> Object.prototype ---> null
console.log(b.a); // 1 (inherited)

// Using class keyword and constructor, static, extends, super
class Polygon {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}

class Square extends Polygon {
  constructor(sideLength) {
    super(sideLength, sideLength);
  }
  get area() {
    return this.height * this.width;
  }
  set sideLength(newLength) {
    this.height = newLength;
    this.width = newLength;
  }
}
var square = new Square(2);

// Performance considerations for properties high up on prototype chain
// -> trying to access nonexistent properties will always traverse full prototype chain
// -> when iterating over properties of an object, every enumerable property that is on prototype
// chain will be enumerated
// -> to check whether an object has a property defined on itself and not somewhere in prototype chain,
// it is necessary to use the hasOwnProperty method which all objects inherit from Object.prototype
// that does not traverse the prototype chain (not enough to just check undefined as property might exist with that value)
console.log(square.hasOwnProperty("height")); // false
// -> bad practice to monkey patch, break encapsulation and extend the Object.prototype or one of the other built-in prototypes
// -> should only extend built-in prototype to backport features of newer JS engines like Array.forEach

/*
 * XHR Requests and HTTP headers
 */
// XMLHttpRequest (XHR): objects to interact with servers
// - can retrieve data from URL without having to do full page refresh, used heavily in Ajax
// - can retrieve any type of data not just XML and supports protocols other than HTTP like file and ftp
// - onreadystatechange event handler, etc.
// - request can fetch data async or sync (optional async argument)
// - can handle responses through onload function
const oReq = new XMLHttpRequest();
oReq.onload = function(e) {
  const response = oReq.response;
};
oReq.open("GET", "/some/endpoint");
oReq.responseType = "arraybuffer";
oReq.send();

// HTTP Headers:

/*
 * Closures
 */
// Closures: combination of a function and lexical environment within which that function was declared
// - inner functions have access to variables of outer functions
// - lexical scoping uses the location where a variable is declared within the source code to determine whether
// that variable is available; describes how parser resolves variable names when funtions are nested
// -> in other languages, local variables within a function exist only for the duration of that function's execution
// -> environment consists of any local variables that were in-scope at the time closure was created
function init() {
  var name = "Mozilla"; // name is a local variable created by init
  function displayName() {
    // displayName() is the inner function, a closure
    alert(name); // use variable declared in the parent function
  }
  return displayName();
}
const displayName = init();
displayName();

// i.e. making a function factory: creates functions which can add a specific value to their argument
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

var add5 = makeAdder(5);
console.log(add5(2)); // 7

// - lets you associate some data (lexical environment) with a function that operates on that data
// -> can use closure anywhere that you might normally use an object with a single method
function makeSizer(size) {
  return function() {
    document.body.style.fontSize = size + "px";
  };
}
var size12 = makeSizer(12);

// - can emulate private methods: can only be called by other methods in same class in languages like Java
// -> private methods to manage global namespace and not clutter up public interface of code
// i.e. using the module pattern: defining public functions that can access private functions and variables
var counter = (function() {
  var privateCounter = 0;
  function changeBy(val) {
    privateCounter += val;
  }

  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    },
  };
})();
// shared lexical environment created in body of anonymous function which is executed as soon as it has been defined (IIFE)
// -> privateCounter and changeBy cannot be accessed outside anonymous function but accessed by public functions
// -> great for data hiding and encapsulation
console.log(counter.value()); // 0
counter.increment();
console.log(counter.value()); // 1
// -> can also have separate counters by doing var makeCounter = function() {...} and then doing counter1 = makeCounter();

// Common looping mistake prior to the introduction of let
function showHelp(help) {
  document.getElementById("help").innerHTML = help;
}

// - only age hint will appear because three closures created by the loop but each one shares same single
// lexical environment which has a variable with changing values item.help (item pointing to last entry in helpText list)
function setupHelp() {
  var helpText = [
    { id: "email", help: "Your e-mail address" },
    { id: "name", help: "Your full name" },
    { id: "age", help: "Your age (you must be over 16)" },
  ];

  for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
    document.getElementById(item.id).onfocus = function() {
      showHelp(item.help);
    };
  }
}

setupHelp();
// - can solve via function factory
function showHelp(help) {
  document.getElementById("help").innerHTML = help;
}
// rather than the callbacks all sharing a single lexical environment, the makeHelpCallback
// creates a new lexical environment for each callback in which help refers to corresponding string from helpText array
function makeHelpCallback(help) {
  return function() {
    showHelp(help);
  };
}

function setupHelp() {
  var helpText = [
    { id: "email", help: "Your e-mail address" },
    { id: "name", help: "Your full name" },
    { id: "age", help: "Your age (you must be over 16)" },
  ];

  for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
    document.getElementById(item.id).onfocus = makeHelpCallback(item.help);
  }
}

setupHelp();
// - can solve via anonymous closures (IIFE)
function showHelp(help) {
  document.getElementById("help").innerHTML = help;
}

function setupHelp() {
  var helpText = [
    { id: "email", help: "Your e-mail address" },
    { id: "name", help: "Your full name" },
    { id: "age", help: "Your age (you must be over 16)" },
  ];

  for (var i = 0; i < helpText.length; i++) {
    (function() {
      var item = helpText[i];
      document.getElementById(item.id).onfocus = function() {
        showHelp(item.help);
      };
    })(); // Immediate event listener attachment with the current value of item (preserved until iteration).
  }
}

setupHelp();
// - can solve via let - every closure binds block-scoped variable so no additional closures required
function showHelp(help) {
  document.getElementById("help").innerHTML = help;
}

function setupHelp() {
  var helpText = [
    { id: "email", help: "Your e-mail address" },
    { id: "name", help: "Your full name" },
    { id: "age", help: "Your age (you must be over 16)" },
  ];

  for (var i = 0; i < helpText.length; i++) {
    let item = helpText[i];
    document.getElementById(item.id).onfocus = function() {
      showHelp(item.help);
    };
  }
}

setupHelp();
// - performance considerations: processing speed and memory consumption
// -> when creating a new object/class, methods should normally be associated to the object's prototype rather than defined
// into the object constructor as whenever the constructor is called, the methods would get reassigned for every object creation
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
}
MyObject.prototype = {
  getName: function() {
    return this.name;
  },
  getMessage: function() {
    return this.message;
  },
};
// -> however redefining the prototype is not recommend but rather appending to existing prototype
// -> inherited prototype shared by all objects and method definitions need not occur at every object creation
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
}
MyObject.prototype.getName = function() {
  return this.name;
};
MyObject.prototype.getMessage = function() {
  return this.message;
};

/*
 * Objects
 */
// - has properties associated with it, key-values
var myCar = new Object();
myCar.make = "Toyota";
myCar["model"] = "Mustang";
// - enumerate the properties of an object with for...in loops, Object.keys(o),
// and Object.getOwnPropertyNames(o) - returns array containing all own properties' names (enumerable or not) of object o
// - using constructor function and creating instance of object with new
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}
var myCar = new Car("Corvette", "FX", "1990");
// - Object.create to choose the prototype object for the object you want to create without having to define a constructor function
var Animal = {
  type: "Vertebrate",
  displayType: function() {
    console.log(this.type);
  },
};

var animal1 = Object.create(Animal);
animal1.displayType();
// -> can define getters and setters and use Object.defineProperty
// -> can delete non-inherited properties by using delete operator
// - objects are a reference type so two distinct objects are never equal even if they have same properties
// and only comparing same object reference with itself yields true

/*
 * Strings
 */

/*
 * Arrays
 */

/*
 * Maps
 */

/*
 * Sets
 */

/*
 * Symbols
 */

/*
 * Generators
 */

/*
 * Promises
 */

/*
 * fetch and async + await
 */
// Fetch API: JS interface for accessing and manipulating parts of HTTP pipeline like requests and responses
// - fetch resources asyncrhonously across network, can be used by Service Workers
// - differs from jQuery.ajax() in two ways: the Promise returned from fetch() won't reject on HTTP error status even if
// something like HTTP 404 or 500, resolves normally with ok status set to false
// - by default, fetch won't send or receive any cookies from server, resulting in unauthenticated requests if site relies on maintaining
// user session -> to send cookies, the credentials init option must be set
// - controlled by connect-src directive of Content Security Policy
// - can provide init object for settings like { method: "POST" }
// - rejects with TypeError when network error encountered or CORS misconfigured on server side
// - Requests and Headers interface, Response object with status, statusText, ok
fetch("some/endpoint")
  .then(function(response) {
    if (response.ok) {
      // Handle success data
      response.json().then(data => {
        console.log(data);
      });
    } else {
      // Handle error
      throw new Error(
        `Status: ${response.status}; Status Text: ${response.statusText}`
      );
    }
  })
  .catch(function(error) {
    console.log(error);
  });

function postData(url, data) {
  // Default options are marked with *
  return fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *omit
    headers: {
      "user-agent": "Mozilla/4.0 MDN Example",
      "content-type": "application/json",
    },
    method: "POST", // *GET, PUT, DELETE, etc.
    mode: "cors", // no-cors, *same-origin
    redirect: "follow", // *manual, error
    referrer: "no-referrer", // *client
  }).then(response => response.json()); // parses response to JSON
}

// ServiceWorker responding to fetch
addEventListener("fetch", function(event) {
  // ServiceWorker intercepting a fetch
  event.respondWith(
    new Response(myBody, {
      headers: { "Content-Type": "text/plain" },
    })
  );
});

// Feature detection
if (self.fetch) {
  // run fetch request here
} else {
  // do something with XMLHttpRequest
}
// Can also use Fetch Polyfill to recreate functionality for unsupported browsers

// Async function
// - defines an asynchronous function with returns AsyncFunction object
// - returns a Promise that will be resolved with return value or rejected with thrown value
// - await expression pauses execution of async function and waits for Promise's resolution and resumes
// async function's execution and returns resolved value
// - purpose: simplify behavior of using promises synchronously to perform some behavior on group of Promises
// -> similar to combining generators and promises
// - if you wish to await two or more promises in parallel, you must still use Promise.all
function resolveAfter2Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("Resolved");
    }, 2000);
  });
}

async function asyncCall() {
  console.log("Calling");
  const result = await resolveAfter2Seconds();
  console.log(result); // "Resolved"
}

asyncCall();

function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

async function add1(x) {
  const a = await resolveAfter2Seconds(20);
  const b = await resolveAfter2Seconds(30);
  return x + a + b;
}

add1(10).then(v => {
  console.log(v); // prints 60 after 4 seconds.
});

async function add2(x) {
  const p_a = resolveAfter2Seconds(20);
  const p_b = resolveAfter2Seconds(30);
  return x + (await p_a) + (await p_b);
}

add2(10).then(v => {
  console.log(v); // prints 60 after 2 seconds.
});

// Can help rewrite Promise chains
function getProcessedData(url) {
  return downloadData(url) // returns a promise
    .catch(e => {
      return downloadFallbackData(url); // returns a promise
    })
    .then(v => {
      return processDataInWorker(v); // returns a promise
    });
}
// vs. async await way
async function getProcessedData(url) {
  let v;
  try {
    v = await downloadData(url);
  } catch (e) {
    v = await downloadFallbackData(url);
  }
  return processDataInWorker(v);
}

/*
 * Classes
 * - syntactic sugar over JS's prototype-based inheritance
 * - function declarations are hoised but class declarations are 
 * - static keyword: without instantiating their class and cannot be called through a class instance,
 * used to create utility functions
 * - can use extends keyword in class declarations/expressions to create a class as a child of another class
 */
class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.hypot(dx, dy);
  }
}

const p1 = new Point(5, 5);
const p2 = new Point(10, 10);

console.log(Point.distance(p1, p2));

class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(this.name + " makes a noise.");
  }
}

class Dog extends Animal {
  speak() {
    console.log(this.name + " barks.");
  }
}

var d = new Dog("Mitzie");
d.speak(); // Mitzie barks.

// - to extend from a regular object you can do this
Object.setPrototypeOf(Dog.prototype, Animal);

// - abstract subclasses or mix-ins are templates for classes, ES6 class can only have a single
// superclass so multiple inheritance form tooling classes is not possible
// -> functionality must be provided by superclass
// -> function with superclass as input and a subclass extending that superclass as output can be used to
// implement mix-ins in ES6
const calculatorMixin = Base =>
  class extends Base {
    calc() {}
  };

const randomizerMixin = Base =>
  class extends Base {
    randomize() {}
  };

class Foo {}
class Bar extends calculatorMixin(randomizerMixin(Foo)) {}

// Calculate fibonacci with memoization, recursion, top-down dynamic programming
class Fibonacci {
  constructor() {
    this.memo = {};
  }

  // 1 1 2 3 5 8 ...
  // Recursive function, top-down memoization, dynamic programming
  computeFibonacci(n) {
    if (n < 0) {
      throw new Error("Number cannot be negative");
    }

    if (n === 0 || n === 1) {
      return n;
    }

    if (this.memo.hasOwnProperty(n)) {
      return this.memo[n];
    }

    const result = this.computeFibonacci(n - 1) + this.computeFibonacci(n - 2);
    this.memo[n] = result;
    return result;
  }
}

const fibo = new Fibonacci();
console.log(fibo.computeFibonacci(6)); // 8

// vs. using ES5 function.Prototype syntax
function Fibber() {
  this.memo = {};
}

Fibber.prototype.computeFibo = function(n) {
  if (n < 0) {
    throw new Error("Number cannot be negative");
  }

  if (n === 0 || n === 1) {
    return n;
  }

  if (this.memo.hasOwnProperty(n)) {
    return this.memo[n];
  }

  const result = this.computeFibo(n - 1) + this.computeFibo(n - 2);
  this.memo[n] = result;
  return result;
};

const fibbers = new Fibber();
console.log(fibbers.computeFibo(6));

/*
 * Regular Expressions
 * - patterns used to match character combinations in strings, also objects in JS
 * -> patterns used with exec and test methods of RegExp and with match, replace, search, and split methods
 * of String
 * - backslash (\) before special character interpreted literally like \*, backslash before non-special character makes next one special
 * like \t or \b or \d
 * - ^ : matches beginning of input i.e. /^A/ matches "An E"
 * - $ : matches the end of input i.e. /t$/ matches eat
 * - * : matches expression 0 or more times i.e. /bo*x/ matches bx
 * - + : matches expressions 1 or more times i.e. matches all a's in "caaaandy"
 * - ? : matches preceding expression 0 or 1 time i.e. /\d+?/ matches "1" in "123abc"
 * - . : matches any single character except the newline character i.e. /.n/ matches 'an'
 * - x|y : matches 'x' or 'y' (if no match for 'x')
 * - {n} : matches exactly n occurrences of preceding expression /a{2}/ matches all of a's in "caandy"
 * - {n,} : matches at least n occurrences of preceding expression i.e. /a{2,}/ matches "aaaa", "aa"
 * - {n,m} : matches at least n and at most m occurrences of preceding expression
 * - [xyz] : character set, matches any one of the characters in brackets including escape sequences i.e. [a-d] matches 'b' in "brisket"
 * - [^xyz] : negated or complemented character set; matches anything not enclosed in brackets i.e. [^abc] matches 'd' in "dbc"
 * - [\b] (backspace), \b word boundary, \B non-word boundary
 * - \cX : where X is a character ranging from A to Z, matches control character in string
 * - \d: digit character === [0-9]
 * - \D: non-digit character ===[^0-9]
 * - \n (line feed), \r (carriage return), \s (single white space character like space, tab, form feed, line feed)
 * - \S (matches single character other than whitespace); \t (matches tab)
 * - \w : matches any alphanumeric character including the underscore === [A-Za-z0-9_]
 * - \W: any non-word character
 * - exec: RegExp method, executes search for a match in a string, returns array of information or null on mismatc
 * - test: RegExp method, tests for match in a string, returns true or false
 * - match: String method, search for a match in string, returns array of information or null on mismatch
 * - search: String method, returns index of match or -1 if search fails
 * - replace: String method, executes search for match in a string and replaces matched substring with replacement substring
 * - split: String method uses regular expression or fixed string to break a string into an array of substrings
 * - settings: /g (global search: hits all occurrences) /i (case-insensitive) /m (multi-line search) /u (unicode) /y ("sticky" search)
 * - to know whether a pattern is found in a string use the test (RegExp method) or the search (String method);
 * exec or match methods are slower but give more information
 */
const re = /ab+c/; // or re = new RegExp('ab+c');

const myRe = /d(b+)d/g;
const myArray = myRe.exec("cdbbdbsbz"); // outputs ["dbbd"]

const nameRe = /(\w+)\s(\w+)/;
const name = "Alfred Lucero";
const flippedName = name.replace(nameRe, "$2, $1");
console.log(flippedName); // "Lucero, Alfred"

const sampleStr = "hey Alfred";
const failStr = "abc";
const reSample = /[A-Z]/g;
console.log(str.search(reSample)); // returns 4;
console.log(str.search(failStr)); // returns -1;

/*
 * Currying: reducing functions of more than one argument to functions of one argument
 * - partial application: pre-applied a function partially regarding to any of its arguments
 */
multiply = (n, m) => n * m;
curryedMultiply = n => m => multiply(n, m);
triple = curryedMultiply(3);
triple(4) === 12;
// Partial application
triple = m => multiply(3, m);
triple(4) === 12;
// JS Bind does currying
add = (a, b) => a + b;
increment = add.bind(undefined, 1);
increment(4) === 5;
// Event handling to reuse for multiple fields
const handleChange = fieldName => event => {
  saveField(fieldName, event.target.value);
};
// <input type="text" onChange={handleChange('email')} />
// Rendering similar HTML tags
renderHtmlTag = tagName => content => `<${tagName}>${content}</${tagName}>`;
// curry and uncurry are inverses
add = (a, b) => a + b;
curryedAdd = a => b => a + b;

add(5, 6) === 11;
curryedAdd(5)(6) === 11;

/*
 * DOM API/DOM-CSS/CSSOM
 * - major object types like document.styleSheets, styleSheets[i].cssRules, cssRules[i].cssText (selector and style),
 * cssRules[i].selectorText, elem.style, elem.style.cssText (just style), elem.className, elem.classList
 * - important methods like CSSStyleSheet.insertRule and CSSStyleSheet.deleteRule
 * - DOM (Document Object Model): programming interface for HTML and XML documents, represents page as nodes and objects
 * -> displayed in browser window or as HTML source; W3C DOM WHATWG DOM standards; accessed and manipulated via JS
 * - key data types: nodes as elements, arrays of nodes as nodeLists(elements) and attribute nodes as attributes
 * -> document (root object); element implements DOM Element interface and Node interface; nodeList: array of elements like kind
 * returned by document.getElementsByTagName(), items accessed by index like list.item(1) or list[1];
 * attribute: returned by createAttribute(), nodes in the DOM just like elements; namedNodeMap: like an array but items accessed by name or index
 * and has an item() method and can add/remove items from namedNodeMap
 * - many objects borrow from different interfaces
 * -> HTML Table Element Interface which includes methods like createCaption, insertRow and also implements Element interface
 * - window represents the browser, document object is root of document itself
 * - Element inherits from generic Node interfaces
 * - DOM models HTML, SVG or XML documents as objects; represents document with logical tree
 * -> each branch of tree ends in a node and each node contains objects; can change structure, styles, content of tree
 * -> nodes can have event handlers attached and once event is triggered, event handlers get executed
 * - common APIs in web
 * -> document.getElementById(id)
 * -> document.getElementsByTagName(name)
 * -> document.createElement(name)
 * -> parentNode.appendChild(node)
 * -> element.innerHTML
 * -> element.style.left
 * -> element.setAttribute()
 * -> element.getAttribute()
 * -> element.addEventListener()
 * -> window.content
 * -> window.onload
 * -> window.dump()
 * -> window.scrollTo()
 */
// i.e. Dealing with tables
let table = document.getElementById("table");
let tableAttrs = table.attributes; // Node/Element interface
for (let i = 0; i < tableAttrs.length; i++) {
  // HTMLTableElement interface: border attribute
  if (tableAttrs[i].nodeName.toLowerCase() === "border") {
    table.border = "1";
  }
}
// HTMLTableElement interface: summary attribute
table.summary = "note: increased border";

// DOM Event Model
// - 3 ways to register event listeners
// 1. EventTarget.addEventListener ( IE6-8 didn't support this but used EventTarget.attachEvent API )
myButton.addEventListener(
  "click",
  function() {
    alert("Hello world!");
  },
  false
);
// 2. HTML attributes, passed Event object via event parameter; should be avoided and less readable, no separation of concerns
<button onclick="alert('Hello world!')" />;
// 3. DOM element properties, only one handler can be set per element and per event
myButton.onclick = function(event) {
  alert("Hello world!");
};
// - Event handlers may be attached to DOM elements, document, window object
// -> event object is created and passed to event listeners when event occurs
// -> Event interface accessible from within handler function via event object as first argument
// - Event bubbling: when an event happens on an element, it first runs the handlers on it, then on its parent, then all the way up
// on other ancestors; almost all events bubble except ones like focus
// - A handler on a parent element can always get details about where event happened with event.targe
// -> most deeply nested element that caused the event is called a target element, accessible as event.target
// -> this = event.currentTarget, the one that has the currently running handler on it
// -> can prevent bubbling with event.stopPropagation() to stop move upward but on current element all other handlers will run
// - 3 phases of event propagation
// 1. Capturing phase: event goes down to the element
// -> rarely used and handlers using on<event> property or HTML attributes or using addEventListener(event, handler)
// don't know anything about capturing and only run 2nd and 3rd phases
// -> to catch event on capturing phase, set 3rd argument of addEventListener to true; if false, set on bubbling false
// 2. Target phase: event reached target element (event.target is deepest element that originated event)
// -> event.currentTarget = this = current element that handles event
// -> event.eventPhase: current phase (capturing = 1, bubbling = 3)
// 3. Bubbling phase: event bubbles up from the element
// - Event Delegation: if we have a lot of elements handled in similar way, instead of assigning a handler to each of them we put a single handler
// on their common ancestor
// -> in handler we use event.target to see where event actually happend and handle it
// -> algorithm: put single handler on container; in handler check source element event.target; if event happened inside element that interests us, handle event
// -> simplifies initialization and saves memory (less handlers), less code (no need to add/remove handlers when removing elements)
// -> great for DOM modifications as we can add/remove elements with innerHTML
// -> cons: event must be bubbling and some low-level handlers should not use event.stopPropagation(); delegation may add CPU load because container-level handler
// reacts on any events in any place of the container but load is usually negligible
function foo(event) {
  alert(event);
}
table_el.onclick = foo;

// Capturing outputs: HTML -> BODY -> FORM -> DIV -> P
// Bubbling outputs: P -> DIV -> FORM -> BODY -> HTML
for (let elem of document.querySelectorAll("*")) {
  elem.addEventListener(
    "click",
    e => alert(`Capturing: ${elem.tagName}`),
    true
  );
  elem.addEventListener("click", e => alert(`Bubbling: ${elem.tagName}`));
}

// i.e. Using event delegation on <table> ancestor element to highlight a <td> element on click
let selectedTd;

// v1: this doesn't account if say <td> has further nested elements
table.onclick = function(event) {
  let target = event.target;
  if (target.tagName !== "TD") return;

  highlight(target);
};
// v2: checking whether click was inside <td> or not
table.onclick = function(event) {
  // Returns nearest ancestor that matches selector
  let td = event.target.closest("td");

  // event.target is not inside of any <td>, returns null
  if (!td) return;

  // in case of nested tables, event.target may be a <td> lying outside of current table
  // so we check if it's actually in our table's <td>
  if (!table.contains(td)) return;

  highlight(td);
};

function highlight(td) {
  // Remove existing highlight if any
  if (selectedTd) {
    selectedTd.classList.remove("highlight");
  }
  selectedTd = td;
  selectedTd.classList.add("highlight");
}

// i.e. Event Delegation for a menu with different buttons like "Save", "Load", "Search"
// - rather than separate handler per button, set data-action attributes for method to call
class Menu {
  constructor(elem) {
    this._elem = elem;
    elem.onclick = this.onClick.bind(this);
  }

  save() {
    alert("saving");
  }

  load() {
    alert("loading");
  }

  search() {
    alert("searching");
  }

  onClick(event) {
    let action = event.target.dataset.action;
    if (action) {
      this[action]();
    }
  }
}
new Menu(menu);

// i.e. Using event delegation to implement "behavior" pattern to add behaviors to elements declaratively
// with special attributes and classes
// 1. add a special attribute to an element
// 2. document-wide handler tracks events and if an event happens on an attributed element it performs the action
// i.e. Counter <input type="button" value="1" data-counter>
// -> using document.onclick will be overwritten by new handlers
document.addEventListener("click", function(event) {
  if (event.target.dataset.counter !== undefined) {
    event.target.value++;
  }
});
// i.e. Toggler
// <button data-toggle-id="subscribe-mail"></button>
// <form id="subscribe-mail" hidden>Your mail: <input type="email"></form>
document.addEventListener("click", function(event) {
  let id = event.target.dataset.toggleId;
  if (!id) return;

  let elem = document.getElementById(id);

  elem.hidden = !elem.hidden;
});

// i.e. Dealing with image dimensions
function setBorderWidth(width) {
  document.getElementById("img1").style.borderWidth = width + "px";
}
<input
  type="button"
  value="Make border 20px wide"
  onclick="setBorderWidth(20);"
/>;

var arrImages = new Array(3);

arrImages[0] = document.getElementById("image1");
arrImages[1] = document.getElementById("image2");
arrImages[2] = document.getElementById("image3");

var objOutput = document.getElementById("output");
var strHtml = "<ul>";

for (var i = 0; i < arrImages.length; i++) {
  strHtml +=
    "<li>image" +
    (i + 1) +
    ": height=" +
    arrImages[i].height +
    ", width=" +
    arrImages[i].width +
    ", style.height=" +
    arrImages[i].style.height +
    ", style.width=" +
    arrImages[i].style.width +
    "</li>";
}

strHtml += "</ul>";

objOutput.innerHTML = strHtml;

// i.e. Manipulating styles by accessing style object on element
function changeText() {
  const p = document.getElementById("pid");
  p.style.color = "blue";
  p.style.fontSize = "16px";
}

// i.e. Using styleSheets property on document object to see list of stylesheets loaded on document
const ss = document.styleSheets;

for (let i = 0; i < ss.length; i++) {
  for (let j = 0; j < ss[i].cssRules.length; j++) {
    console.log(ss[i].cssRules[j].selectorText + "\n");
  }
}
/*
  body { background-color: darkblue } => body \n p \n #lumpy
  p { ... }
  #lumpy { ... }
*/

// i.e. Event Propagation
// - calling event.stopPropagation to keep event from bubbling any further up into the DOM
function stopEvent(event) {
  c2 = document.getElementById("c2");
  c2.innerHTML = "hello";

  // Prevents ancestor from getting click
  event.stopPropagation();
  alert("Event propagation halted");
}

// i.e. using window.getComputedStyle method to get styles of an element that are not set using style attribute
// or with JS (i.e. elt.style.backgroundColor="#fff")
// - returns ComputedCSSStyleDeclaration object whose individual style properties can be referenced with object's getPropertyValue()
function cStyles() {
  var RefDiv = document.getElementById("d1");
  var txtHeight = document.getElementById("t1");
  var h_style = document.defaultView
    .getComputedStyle(RefDiv, null)
    .getPropertyValue("height");

  txtHeight.value = h_style;

  var txtWidth = document.getElementById("t2");
  var w_style = document.defaultView
    .getComputedStyle(RefDiv, null)
    .getPropertyValue("width");

  txtWidth.value = w_style;

  var txtBackgroundColor = document.getElementById("t3");
  var b_style = document.defaultView
    .getComputedStyle(RefDiv, null)
    .getPropertyValue("background-color");

  txtBackgroundColor.value = b_style;
}

// i.e. Displaying event object properties
function showEventProperties(e) {
  function addCell(row, text) {
    var cell = row.insertCell(-1);
    cell.appendChild(document.createTextNode(text));
  }

  var e = e || window.event;
  document.getElementById("eventType").innerHTML = e.type;

  var table = document.createElement("table");
  var thead = table.createTHead();
  var row = thead.insertRow(-1);
  var lableList = ["#", "Property", "Value"];
  var len = lableList.length;

  for (var i = 0; i < len; i++) {
    addCell(row, lableList[i]);
  }

  var tbody = document.createElement("tbody");
  table.appendChild(tbody);

  for (var p in e) {
    row = tbody.insertRow(-1);
    row.className = row.rowIndex % 2 ? "odd" : "even";
    addCell(row, row.rowIndex);
    addCell(row, p);
    addCell(row, e[p]);
  }

  document.body.appendChild(table);
}

window.onload = function(event) {
  showEventProperties(event);
};

// i.e. Using DOM Table interface
// - frequently used methods are HTMLTableElement.insertRow and tableRow.insertCell
const table = document.getElementById("table0");
const row = table.insertRow(-1);
let cell, text;
for (let i = 0; i < 2; i++) {
  cell = row.insertCell(-1);
  text = "Row " + row.rowIndex + " Cell " + i;
  cell.appendChild(document.createTextNode(text));
}

// Creating a DOM tree
const doc = document.implementation.createDocument("", "", null);
const divElem = doc.createElement("div");

const paragraphElem = doc.createElement("p");
paragraphElem.setAttribute("role", "copy");
paragraphElem.appendChild(doc.createTextNode("Some p text"));
divElem.appendChild(paragraphElem);

// Traversing HTML table with JS and DOM interfaces
// - Technique: create elements from the top down; then attach the children to the parents from
// the bottom up
// i.e. creating HTML table dynamically
function generateTable() {
  // Get reference for body
  const body = document.getElementsByTagName("body")[0];

  // Creates a <table> element and a <tbody element
  const tbl = document.createElement("table");
  const tblBody = document.createElement("tbody");

  // Creating all cells
  for (let i = 0; i < 2; i++) {
    // Creates a table row
    const row = document.createElement("tr");

    for (let j = 0; j < 2; j++) {
      // Create a <td> element and a text node, make the text node the contents of <td>,
      // and put the <td> at the end of table row
      const cell = document.createElement("td");
      const cellText = document.createTextNode(
        "cell in row " + i + ", column " + j
      );
      cell.appendChild(cellText);
      row.appendChild(cell);
    }

    // Add the row to the end of table body
    tblBody.appendChild(row);
  }

  // Put <tbody> in <table>
  tbl.appendChild(tblBody);
  // Appends <table> into <body>
  body.appendChild(tbl);
  tbl.setAttribute("border", "2");
}

// i.e. Setting background color of a paragraph
// - getElementsByTagName(tagNameValue) is method available in any DOM element or root Document elemnt
// -> returns array with all element's descendants matching the tag name
function setBackgroundParagraph() {
  // Get list of all body elements (should only be one)
  const body = document.getElementsByTagName("body")[0];

  // Get all p elements that are descendants of body
  const bodyElements = body.getElementsByTagName("p");

  // Get second item of list of p elements
  const paragraph = bodyElements[1];
  paragraph.style.background = "rgb(255,0,0)";
}

// i.e. Creating TextNodes with document.createTextNode(), type=TEXT_NODE
// - to insert text into HTML page, the text node needs to be a child of some other node element
// - great way to include white space after another text node
// - can use insertBefore to append text node between two text nodes
const textNode = document.createTextNode("Some text node");

// i.e. Inserting elements with appendChild()
const someParagraph = document.getElementsByTagName("p")[0];
const someTextNode = document.createTextNode("some paragraph text");
someParagraph.appendChild(someTextNode);

// i.e. Creating new elements with document object and createElement()
const someDiv = document.createElement("div");

// i.e. Removing nodes with removeChild()
// - text node will still exist and you can attach it to another element if you'd like
someParagraph.removeChild(someTextNode);

// i.e. Manipulating table with DOM and CSS
// - childNodes attribute to get list of child nodes, regardless of name or type
// - getElementsByTagName() returns elements of specified tag name and descendants at any level,
// not just immediate children
// - if object is a text node, can use data attribute and retrieve text content of node
const myBody = document.getElementsByTagName("body")[0];
const myTable = myBody.getElementsByTagName("table")[0];
const myTableBody = myTable.getElementsByTagName("tbody")[0];
const myRow = myTableBody.getElementsByTagName("tr")[1];
const myCell = myRow.getElementsByTagName("td")[1];

// First item element of childNodes list of myCell
const myCellText = myCell.childNodes[0];

// Content of current text is data content of myCellText
const currentText = document.createTextNode(myCellText.data);
mybody.appendChild(currentText);
// i.e. Getting attribute value with getAttribute()
myTable.getAttribute("border");
// - other helpful attributes: for TextNodes - textNode.data for content, ele.parentNode, ele.firstChild,
// ele.previousSibling, ele.nextSibling, ele.lastChild, ele.data

// Locating DOM elements using selectors
// - Selectors API to retrieve Element nodes from DOM
// - NodeLists = collections of nodes such as those returned by properties such as Node.childNodes and document.querySelectorAll()
// -> not an Array but possible to iterate on it using forEach() or use Array.from to convert to array in older browsers
// -> may be a live collection which means changes in DOM are reflected in collection i.e. Node.childNodes are live
// -> great to be careful when iterating over items in NodeList and when caching length of list
// -> NodeList.item(index) returns null in out-of-bounds vs. nodeList[idx] returning undefined
// -> NodeList.entries() returns an iterator to go through all the key/value pairs contained in this object
// -> NodeList.forEach(); NodeList.keys() returns an iterator allowing to go through all keys of key/value pairs contained in this object
// -> NodeList.values() returns iterator allowing to go through all values of key/value pairs
// -> don't use for...in or for each...in since it will enumerate length and item properties of NodeList
// -> for...of loops over NodeList objects correctly
const parent = document.getElementById("parent");
const childNodes = parent.childNodes;
console.log(childNodes.length); // let's say 4
parent.appendChild(document.createElement("div"));
console.log(childNodes.length); // should output 5

const list = document.querySelectorAll("input[type=checkbox]");
for (let item of list) {
  item.checked = true;
}
list.forEach(item => {
  item.checked = true;
});
// -> may be a static collection which means any subsequent changes in DOM do not affect content of collection like in document.querySelectorAll()
// - NodeSelector interface:
// 1. querySelector: returns first matching Element node within node's subtree (that is a descendant of baseElement); returns null if nothing found
// -> hierarchy of entire document is considered when applying selectors so levels outside specified baseElement are still considered when locating matches
// and then it checks if it is a descendant of baseElement
const el = document.body.querySelector(
  "style[type='text/css'], style:not([type])"
);
// 2. querySelectorAll: returns NodeList containing all matching Element nodes within node's subtree (that are descendants of baseElement)
// or an empty NodeList if no matches found
// -> returns static NodeList of all elements descended from element
// -> can use :scope pseudo-class to only match seletors on descendants of baseElement (cannot have selectors outside baseElement)
let matches = document.body.querySelectorAll("p");
// (NodeList returned by querySelectorAll() is not live and is different from other DOM querying methods that return live node lists)
// - selector methods accept one or more comma-separated selectors to determine what element or elements should be returned
// i.e. select all paragraph elements in document whose CSS class is either warning or note
const special = document.querySelectorAll("p.warning, p.note");
// i.e. query by ID
const el = document.querySelector("#main, #basic, #exclamation");

// Whitespace in the DOM
// - in Mozilla, all whitespace in text content of original document represented in the DOM
// -> there will be some text nodes that contain only whitespace and some text nodes will have whitespace at the beginning or end
// -> so editor can preserve formatting of documents
// i.e. whitespace = "\t", "\n", "\r", " "
function isAllWhitespace(node) {
  // Use ECMA-262 Edition 3 String and Regexp features
  return !/[^\t\n\r ]/.test(node.textContent);
}

function isIgnorable(node) {
  return (
    node.nodeType === 8 || //
    (node.nodeType === 3 && isAllWhitespace(node))
  ); // TextNode all WS
}

// Version of previousSibling that skips nodes that are entirely whitespace or comments
function nodeBefore(sib) {
  while ((sib = sib.previousSibling)) {
    if (!isIgnorable(sib)) return sib;
  }
  return null;
}

// Version of nextSibling that skips nodes that are entirely whitespace or comments
function nodeAfter(sib) {
  while ((sib = sib.nextSibling)) {
    if (!isIgnorable(sib)) return sib;
  }
  return null;
}

// Version of lastChild that skips nodes entirely whitespace or comments
function lastChild(parent) {
  let res = parent.lastChild;
  while (res) {
    if (!isIgnorable(res)) return res;
    res = res.previousSibling;
  }
  return null;
}

// Version of firstChild that skips nodes entirely whitespace or comments
function firstChild(parent) {
  let res = parent.firstChild;
  while (res) {
    if (!isIgnorable(res)) return res;
    res = res.nextSibling;
  }
  return null;
}

// Version of data that doesn't include whitespace at beginning and end and normalizes all whitespace to a single space
// - normally data is property of text nodes that give the text of the node
function dataOf(txt) {
  let data = txt.textContent;
  // Use ECMA-262 Edition 3 String and RegExp features
  // Replace all whitespaces with single space
  data = data.replace(/[\t\n\r ]+/g, " ");
  // Trim beginning and end whitespace
  if (data.charAt(0) === " ") data = data.substring(1, data.length);
  if (data.charAt(data.length - 1) === " ")
    data = data.substring(0, data.length - 1);
  return data;
}

/*
 * Interview Practice Questions
 */

/*
 * Handling array of async callbacks (vanilla JS without Promises), similar to $.whenAll
 */
function asyncTimeout(duration) {
  return callback => {
    setTimeout(() => {
      callback(duration);
    }, duration);
  };
}

function asyncError(error) {
  return callback => {
    setTimeout(() => {
      callback(new Error(error));
    }, 100);
  };
}

// Returns an array of results if all successful async callbacks
// If any of the async callback errors out, we throw an Error
function whenAll(asyncCallbacks, handleResultsCallback) {
  if (asyncCallbacks.length === 0) {
    return handleResultsCallback([]);
  }

  let numFinishedCallbacks = 0;
  const asyncResults = new Array(asyncCallbacks.length);
  asyncCallbacks.forEach((asyncCallback, index) => {
    asyncCallback(results => {
      if (results instanceof Error) {
        throw results;
      }
      asyncResults[index] = results;
      numFinishedCallbacks++;
      if (numFinishedCallbacks === asyncCallbacks.length) {
        handleResultsCallback(asyncResults);
      }
    });
  });
}

whenAll([asyncTimeout(100), asyncTimeout(200)], console.log);

whenAll([asyncTimeout(50), asyncError("Throwing a random error")], console.log);

/* 
 * Implementing Promise.all to handle an array of asynchronous requests
 */
function all(promises) {
  return new Promise((resolve, reject) => {
    const resolvedPromises = new Array(promises.length);
    if (promises.length === 0) {
      resolve(resolvedPromises);
    }
    const pendingPromisesCount = promises.length;
    promises.forEach((promise, index) => {
      promise.then(
        result => {
          resolvedPromises[index] = result;
          pendingPromisesCount -= 1;
          if (pendingPromisesCount === 0) {
            resolve(resolvedPromises);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  });
}

function asyncTimeout(duration) {
  return new Promise(resolve => {
    setTimeout(() => resolve(duration), duration);
  });
}

function asyncError(error) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(error), 100);
  });
}

// Testing
all([asyncTimeout(100), asyncTimeout(200)]).then(resolvedPromises => {
  console.log("This should be [100, 200]: ", resolvedPromises);
});

all([asyncTimeout(100), asyncError("Error in async promise")]).catch(error => {
  console.log(error);
});

/*
 * Debouncing
 */

/*
 * Deep merging objects (arrays and normal objects)
 */

/*
 * Search autocompletion/suggestions on typing
 */

/*
 * Creating an NxN dimensional array helper function
 */

/*
 * Implementing a Trie for O(KeyLength) inserts and searches
 * and O(AlphabetSize * KeyLength * NumKeys) space complexity
 */
function TrieNode() {
  this.children = new Array(26).fill(null);
  this.isEndOfWord = false;
}

/**
 * Initialize your data structure here.
 */
var Trie = function() {
  this.root = new TrieNode();
};

/**
 * Inserts a word into the trie.
 * @param {string} word
 * @return {void}
 */
Trie.prototype.insert = function(word) {
  let root = this.root;
  for (let i = 0; i < word.length; i++) {
    const index = word[i].charCodeAt(0) - "a".charCodeAt(0);
    if (!root.children[index]) {
      root.children[index] = new TrieNode();
    }
    root = root.children[index];
  }
  root.isEndOfWord = true;
};

/**
 * Returns if the word is in the trie.
 * @param {string} word
 * @return {boolean}
 */
Trie.prototype.search = function(word) {
  let root = this.root;
  for (let i = 0; i < word.length; i++) {
    const index = word[i].charCodeAt(0) - "a".charCodeAt(0);
    if (!root.children[index]) {
      return false;
    }
    root = root.children[index];
  }
  return root && root.isEndOfWord;
};

/**
 * Returns if there is any word in the trie that starts with the given prefix.
 * @param {string} prefix
 * @return {boolean}
 */
Trie.prototype.startsWith = function(prefix) {
  let root = this.root;
  for (let i = 0; i < prefix.length; i++) {
    const index = prefix[i].charCodeAt(0) - "a".charCodeAt(0);
    if (!root.children[index]) {
      return false;
    }
    root = root.children[index];
  }

  return !!root;
};

/*
 * Depth-First Search (LIFO - stacks) and Breadth First Search (FIFO - queues)
 */