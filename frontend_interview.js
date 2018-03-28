/* 
 * Frontend Interview Notes for All Things JS 
 */

/*
 * Objects
 * - can be created in the following ways: function based, object literal, using JavaScript new word
 * - reference type like Object, Array, Function, Date, null, Error (any value other than primitives are reference type)
 * - typeof returns object for null though
 * - can use instanceof operator (value instanceof constructor) to detect an object of specific reference type
 * - object-based inheritance aka prototypal inheritance = one object inherits from another object without invoking a constructor function
 * - type-based inheritance works with constructor function instead of object - calling constructor function of object from which you want to inherit
 * - prevent modification of object in JS through prevent extensions (no new properties or methods added but existing ones can change),
 * seal (prevents existing properties and methods from being deleted in addition to no new properties/methods); 
 * freeze (prevents existing properties from being modified - all properties and methods read only)
 * -> can also mess with object configurable, enumerated, etc. properties
 */
// i.e. Function based
function Employee(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}
var employee1 = new Employee("Alfred", "Lucero");
// i.e. Object literal
var employee = {
  firstName: "Alfred",
  lastName: "Lucero",
};
// i.e. using new keyword
var newEmployee = new Object();
newEmployee.firstName = "Alfred";
newEmployee.lastName = "Lucero";

// using typeof
console.log(typeof []); // object
console.log(typeof null); // object

// using instanceof
if (employee1 instanceof Employee) {
  console.log("employee1 is an instance of Employee");
}

// object-based inheritance with Object.create(), can override same properties/methods on current object
var inheritedEmployee = Object.create(employee);

// type-based inheritance using constructor function of object you want to inherit from
function Person(name, age, salary) {
  this.name = name;
  this.age = age;
  this.salary = salary;
  this.incrementSalary = function(byValue) {
    this.salary = this.salary + byValue;
  };
}
function Employee(company) {
  this.company = company;
}

// Prototypal Inheritance
Employee.prototype = new Person("Nishant", 24, 5000);

var empCompany = new Employee("Google");

console.log(empCompany instanceof Person); // true
console.log(empCompany instanceof Employee); // true

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
// - arrow functions "this" retains the value of the enclosing lexical context's this
var globalObject = this;
var foo = () => this;
console.log(foo() === globalObject); // true
// - as an object method: its this is set to object the method is called on
var o = {
  prop: 37,
  f: function() {
    return this.prop;
  },
};

console.log(o.f()); // 37
// - for methods defined somewhere on object's prototype chain, if the method is on an object's prototype chain,
// this refers to the objet the method was called on as if the method were on the object (same with getter/setter)
// - when a function is used as a constructor with the new keyword, its this is bound to the new object being constructed

function C() {
  this.a = 37;
}

var o = new C();
console.log(o.a); // 37

function C2() {
  this.a = 37; // dead code as the this gets discarded for a:38 object
  return { a: 38 };
}

o = new C2();
console.log(o.a); // 38
// - as a DOM event handler, this is set to the element the event fired from
// When called as a listener, turns the related element blue
function bluify(e) {
  // Always true
  console.log(this === e.currentTarget);
  // true when currentTarget and target are the same object
  console.log(this === e.target);
  this.style.backgroundColor = "#A5D9F3";
}

// Get a list of every element in the document
var elements = document.getElementsByTagName("*");

// Add bluify as a click listener so when the
// element is clicked on, it turns blue
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", bluify, false);
}

/*
 * Prototypal Inheritance
 */
// - All objects in JavaScript inherit from at least one other object = prototype and inherited properties can be
// found in prototype object of constructor
// - Classes are still prototype-based and just syntactic sugar
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
 * JSON
 * - JavaScript Object Notation: syntax for serializing objects, arrays, numbers, strings, booleans, and null
 * - for objects and arrays: property names must be double-quoted strings, trailing commas forbidden
 * - for numbers, leading zeros prohibited, decimal point must be followed by at least one digit
 * - for strings, limited set of characters may be escaped, certain ones prohibited
 * - not supported in older browsers so you need a polyfill
 */
var json = '{"result":true, "count":42}';
obj = JSON.parse(json);

console.log(obj.count); // expected output: 42

console.log(JSON.stringify({ x: 5, y: 6 })); // expected output: "{"x":5,"y":6}"

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

// Another example with xhr
function request(url) {
  const xhr = new XMLHttpRequest();
  xhr.timeout = 2000;
  xhr.onreadystatechange = function(e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // Code here for when server answer is successful
      } else {
        // Code here for when server answer is not successful
      }
    }
  };
  xhr.ontimeout = function() {
    // Well, it took too long to do some code here to handle that
  };
  xhr.open("get", url, true);
  xhr.send();
}

// Using XHR and callbacks
// - can save a reference of a function in a variable and use them as arguments of another function to execute later
// - problem with callbacks = maintenance and readability, callback hell
function request(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.timeout = 2000;
  xhr.onreadystatechange = function(e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // Sending error first as parameter is common practice in Node.js
        callback(null, xhr.response);
      } else {
        callback(xhr.status, null);
      }
    }
  };
  xhr.ontimeout = function() {
    console.log("Timed out");
  };
  xhr.open("get", url, true);
  xhr.send();
}

// Usage with callback, can also wrap with try catch
request(userGet, function handleUsersList(error, users) {
  if (error) {
    throw error;
  }
  const list = JSON.parse(users).items;

  list.forEach(function(user) {
    request(user.repos_url, function handleReposList(err, repos) {
      if (err) {
        throw err;
      }
      // Handle repos list
    });
  });
});

// XHR and Promises
// - Promises to make code more readable and see clear order of execution
// - 3 states: pending, resolved, rejected
const myPromise = new Promise(function(resolve, reject) {
  if (codeIsFine) {
    resolve("fine");
  } else {
    reject("error");
  }
});
myPromise
  .then(function whenOk(response) {
    console.log(response);
    return response;
  })
  .catch(function whenNotOk(err) {
    console.error(err);
  });

function request(url) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 2000;
    xhr.onreadystatechange = function(e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(xhr.status);
        }
      }
    };
    xhr.ontimeout = function() {
      reject("timeout");
    };
    xhr.open("get", url, true);
    xhr.send();
  });
}

// Usage
const myPromise = request(userGet);
myPromise
  .then(function handleUsersList(users) {
    const list = JSON.parse(users).items;
    return Promise.all(
      list.map(function(user) {
        return request(user.repos_url);
      })
    );
  })
  .then(function handleReposList(repos) {
    console.log(repos);
  })
  .catch(function handleErrors(error) {
    console.log(
      "when a reject is executed it will come here ignoring the then statement ",
      error
    );
  });
// Can also separate callbacks like this for readability
// userRequest.then(handleUsersList).then(repoRequest).then(handleReposList).cath(handleErrors);

// XHR and Generators
// - generators allow us to have async code looking like sync
// - yield stops the function execution until a .next() is made for that function and is similar to .then promise
// that only executes when resolved comes back
function* foo() {
  yield 1;
  const args = yield 2;
  console.log(args);
}
var fooIterator = foo();
console.log(fooIterator.next().value); // 1
console.log(fooIterator.next().value); // 2

fooIterator.next("aParam"); // will log the console.log inside generator 'aParam'

// Rather than executing request out of gate, we want a callback to handle the response
function request(url) {
  return function(callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(null, xhr.response);
        } else {
          callback(xhr.status, null);
        }
      }
    };
    xhr.ontimeout = function() {
      console.log("timeout");
    };
    xhr.open("get", url, true);
    xhr.send();
  };
}

// Usage:
function* list() {
  const userGet = "/users";
  const users = yield request(userGet);

  yield;

  for (let i = 0; i <= users.length; i++) {
    yield request(users[i].repos_url);
  }
}

try {
  const iterator = list();
  iterator.next().value(function handleUsersList(err, users) {
    if (err) {
      throw err;
    }
    const list = JSON.parse(users).items;

    // Send list of users for the iterator
    iterator.next(list);

    list.forEach(function(user) {
      iterator.next().value(function userRepos(error, repos) {
        if (error) {
          throw error;
        }
        // Handle each individual user repo here
        console.log(user, JSON.parse(repos));
      });
    });
  });
} catch (e) {
  console.error(e);
}

// XHR and Async/Await
// - like mix of generators with promises, tell code which functions are sync and what part of code will await for
// that promise to finish
// - not supported by older browsers/back-end, need Node 8, can use compiler like babel
async function sumTwentyAfterTwoSeconds(value) {
  const remainder = afterTwoSeconds(20);
  return value + (await remainder);
}

function afterTwoSeconds(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, 2000);
  });
}

sumTwentyAfterTwoSeconds(10).then(result =>
  console.log("After 2 seconds", result)
);

function request(url) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(xhr.status);
        }
      }
    };
    xhr.ontimeout = function() {
      reject("timeout");
    };
    xhr.open("get", url, true);
    xhr.send();
  });
}

// Usage
async function list() {
  const userGet = "/users";
  const users = await request(userGet);
  const usersList = JSON.parse(users).items;

  usersList.forEach(async function(user) {
    const repos = await request(user.repos_url);

    handleRepoList(user, repos);
  });
}

function handleRepoList(user, repos) {
  const userReposo = JSON.parse(repos);
  console.log(user, userRepos);
}

// Call it this way
list().catch(e => console.error(e));

/*
 * Timers
 * - window.setTimeout and window.setInterval
 * - can clear timers/intervals
 */
function simpleMessage() {
  alert("This is just a simple alert");
}

// set time out
window.setTimeout(simpleMessage, 5000);

// if you wanted to clear the timer.
var timer = window.setTimeout(simpleMessage, 5000);
window.clearTimeout(timer);

// set interval. will repeat every  5000ms
window.setInterval(simpleMessage, 5000);

// if you wanted to clear the intervals.

var intervalHandler = window.setInterval(simpleMessage, 5000);
window.clearInterval(intervalHandle);

/*
 * Closures
 * - function definined inside another function (parent function) and has access to the variable which is declared and defined in parent function scope
 * - has access to variable in three scopes: own scope, parent function scope, global namespace
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
// -> drawback of private methods in general is that they may be memory inefficient because a new copy of method would be
// created for each instance
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
 * Functions
 * - using anonymous functions if no name needed and only used in one place, declared inline and can access variables in parent scope,
 * passing anonymous function as parameter to calling function
 */
var btn = document.getElementById("myBtn");
btn.addEventListener("click", function() {
  alert("button clicked!");
});
function processCallback(callback) {
  if (typeof callback === "function") {
    callback();
  }
}

/*
 * Strings
 * - string literals like '' or use String global object like String(thing), template literals like ``
 * - holding text characters, using indexOf, length, substring()
 * - compare strings with < or >
 * - string literals and strings from String calls in non-constructor context without using new keyword are primitive stirngs
 * though it already converts primitives to String objects to use the object methods (typeof may be "string" or "object")
 * - includes, endsWith, indexOf, lastIndexOf, match(regex), repeat, replace, search, slice, split(into an array of strings),
 * substring(start, upToButNotIncludingEnd), toLowerCase, toString, toUpperCase, trim - whitespace at beginning and end of string
 */
"cat".charAt(1); // returns 'a'
// Using the bracket notation and attempting to delete or assign a value to these properties will not succeed as they are
// neither writable nor configurable
"cat"[1]; // returns 'a'
// Using Unicode value to create stirng
String.fromCharCode(65, 66, 67); // "ABC"
// Getting the UTF-16 code unit value at given index
"a".charCodeAt(0);
// Using substring
const anyString = "Mozilla";
console.log(anyString.substring(0, 1)); // 'M'
console.log(anyString.substring(4)); // 'lla'

/*
 * Arrays
 * - list-like objects, neither length nor types fixed, cannot use strings as element indexes only integers
 * - mutator methods: fill, pop, push, reverse, shift, sort, splice, unshift
 * - accessor methods (don't modify array and return some representation of array): concat, includes, indexOf, join (into string), lastIndexOf,
 * slice, toString
 * - iteration methods: entries, every, filter, find (returns found value in array), findIndex, forEach, keys, map, reduce, reduceRight, values
 */
const fruits = ["apples", "bananas"];
console.log(fruits[0]);
fruits.forEach(function(item, index, array) {
  console.log(item, index);
});
// Add to end
fruits.push("oranges");
// Remove from end
const last = fruits.pop();
// Remove from front of an array
const first = fruits.shift();
// Add to front of an array
const newLength = fruits.unshift("strawberries");
// Finding index of item in array
const pos = fruits.indexOf("bananas");
// Remove an item by index position
const removedItem = fruits.splice(pos, 1);
// Copy an array
const shallowCopy = fruits.slice();
// Using Array.from to convert array-like or iterale object to an array
Array.from("foo"); // ['f', 'o', 'o']
Array.from([1, 2, 3], x => x + x); // [2,4,6]
// using reduce: to apply a function against an accumulator and each element in array from left to right to reduce to single value
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

console.log(array1.reduce(reducer)); // 10
console.log(array1.reduce(reducer, 5)); // 15
// Array.isArray() to tell if an array
Array.isArray([1, 2, 4]); // true

/*
 * Maps
 * - holds key-value pairs, any value (both objects and primitive values) may be used as either a key or value
 * - iterates its elements in insertion order in for...of loop [key,value]
 * - keys of object are strings/symbols but they can be any value for Map, size property, Iterable so easier to iterate than Object in which
 * you need the keys and Object has a prototype
 * - clear, delete(key), entries, forEach, get(key), has(key), keys(), set(key, value), values()
 * - can turn 2D key-value array into map
 */
const myMap = new Map();

myMap.set("someKey", "someValue");
myMap.size; // 1
myMap.get("someKey"); // 'someValue'
myMap.has("someKey"); // true

for (var [key, value] of myMap) {
  console.log(key + " = " + value);
}

myMap.forEach(function(value, key) {
  console.log(key + " = " + value);
});

/*
 * Sets
 * - lets you store unique values of any type whether primitive values or object references
 * - can iterate through elements in insertion order, value in set may only occur once
 * - more like unordered hashset
 * - clear, entries, keys
 */
const mySet = new Set();

mySet.add(1);
mySet.add(5);
mySet.has(1); // true;
mySet.delete(5); // removes 5 from set
mySet.has(5); // false;
mySet.size; // 1

for (let item of mySet) {
  console.log(item);
}

mySet.forEach(function(value) {
  console.log(value);
});

const myArr = Array.from(mySet);

// Intersection
const intersection = new Set([...set1].filter(x => set2.has(x)));

// Difference
const difference = new Set([...set1].filter(x => !set2.has(x)));

// Adding basic set operations
Set.prototype.isSuperset = function(subset) {
  for (var elem of subset) {
    if (!this.has(elem)) {
      return false;
    }
  }
  return true;
};

Set.prototype.union = function(setB) {
  var union = new Set(this);
  for (var elem of setB) {
    union.add(elem);
  }
  return union;
};

Set.prototype.intersection = function(setB) {
  var intersection = new Set();
  for (var elem of setB) {
    if (this.has(elem)) {
      intersection.add(elem);
    }
  }
  return intersection;
};

Set.prototype.difference = function(setB) {
  var difference = new Set(this);
  for (var elem of setB) {
    difference.delete(elem);
  }
  return difference;
};

// Can transform Array into set
const mySet2 = new Set(myArray); // each unique item in array
const mySetStr = new Set(text); // each unique character

/*
 * Symbols
 * - every symbol value returned from Symbol() is unique, may be used as identifier for object properties, primitive data type
 * - typeof symbol = "symbol", toString() = Symbol(arg)
 * - not enumerable in for...in iterations, Object.getOwnPropertyNames will not return symbol object properties, ignored by JSON.stringify
 * - Symbol.iterator = method returning default iterator for an object used by for...of
 */
const sym1 = Symbol("foo");
const sym2 = Symbol("foo");

sym1 === sym2; // false

/*
 * Generators
 * - function* declaration
 * - generators are functions which can be exited and later re-entered; context bindings saved across re-entrances
 * - helps with async programming when combined with Promises (yield a promise)
 * - calling generator function doesn't execute body immediately; iterator object for function is returned instead
 * -> call iterator's next() method, function body executed until first yield expression which specifies value to be returned from iterator
 * or with yield* delegates to another generator function
 * - next() returns object with value property containing yielded value and done property to indicate whether generator has yielded its last value as boolean
 * -> calling next() with argument will resume generator function execution, replacing yield expression where executionw as paused with the argument from next()
 * -> return statement in generator when executed will make generator finished with done:true; or error thrown
 * -> subsequent next calls after finishing will just return object {value: undefined, done: true}
 */
function* idMaker() {
  var index = 0;
  while (index < index + 1) {
    yield index++;
  }
}

var gen = idMaker();
console.log(gen.next().value); // 0
console.log(gen.next().value); // 1

/*
 * Promises
 * - callbacks deprive us of return/throw and program's entire flow based on side effects (one function calling another one), deprive us of stack
 * - avoid promise pyramid of doom, just like callback hell -> better to compose promises and each function only called when previous promise resolved and called with that
 * promise's output
 * - avoid forEach/for/while loop but rather use Promise.all() - rejected when any sub-promises rejected, otherwise returns array of results
 * - remember to add a .catch() to capture any thrown errors
 * - avoid deferred = object representing work that is not yet done for async code and a promise is an object representing a value that is not yet know
 * - Promise object represents eventual completion or failure of an asynchronous operation and its resulting value, returned object to which
 * you attach callbacks instead of passing callbacks into a function
 * - callbacks added with .then even after success or failure of async operations will be called, callbacks won't be called before completion of current run of JS event loop,
 * can chain them, functions passed to then will never be called synchronously even with already-resolved promise (put on microtask queue which means it will reunt
 * layer when queue is emptied at end of current run of JS event loop)
 * - proxy for value not necessarily known when promise is created, associate handlers with an asynchronous action's eventual success value or failure reason
 * - in one of these states: pending (neither fulfilled nor rejected), fulfilled (successfully), rejected (failed)
 * -> when rejected or fulfilled, asssociated handlers queued up by promise's then method are called
 * - Promise.resolve() and Promise.reject() = shortcuts to manually create already resolved or rejected promise respectively
 * - Promise.all() and Promise.race() to run async operations in parallel
 */
// Sample Promise: in executor function, resolve called when async task completes successfully and returns results of task as value
const myPromise = new Promise((resolve, reject) => {
  // do something async which calls either:
  // resolve(someValue); - fulfilled
  // reject(new Error('some reason')); - rejected
});
// To provide function with promise functionality, simply have it return a promise
function myAsyncFunction(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}
// Another timeout promise, setTimeout to simulate async code
let timeoutPromise = new Promise((resolve, reject) => {
  setTimeout(function() {
    resolve("Success!");
  }, 250);
});
// Gets success passed in resolve function
timeoutPromise.then(successMessage => {
  console.log("Yay! " + successMessage);
});
// Returning results so callbacks catch result of previous promise
doSomething()
  .then(result => doSomethingElse(result))
  .then(newResult => doThirdThing(newResult))
  .then(finalResult => {
    console.log(`Got the final result: ${finalResult}`);
  })
  .catch(failureCallback);
// Wrapping problematic functions at lowest level and never call them directly
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
wait(10000)
  .then(() => saySomething("10 seconds"))
  .catch(failureCallback);
// Revealing constructor pattern
new Promise(function(resolve, reject) {
  fs.readFile("myfile.txt", function(err, file) {
    if (err) {
      return reject(err);
    }
    resolve(file);
  });
}).then(/* ... */);
// Composing Promises
remotedb
  .addDocs(docs)
  .then(function(resultOfAllDocs) {
    return localdb.put("");
  })
  .then(function(resultOfPut) {
    return localdb.get("");
  })
  .then(function(resultOfGet) {
    return localdb.put("");
  })
  .catch(function(err) {
    console.log(err);
  });

// Once in here you can return another promise, return a synchronous value or undefined, throw a synchronous error
somePromise().then(function() {
  // I'm inside a then() function!
});

// Promises to wrap synchronous code as asynchronous code
new Promise(function(resolve, reject) {
  resolve(someSynchronousValue);
}).then(/* ... */);
// vs.
Promise.resolve(someSynchronousValue).then(/* ... */);
// i.e. wrapping promise-returning API methods
function somePromiseAPI() {
  return Promise.resolve()
    .then(function() {
      doSomethingThatMayThrow();
      return "foo";
    })
    .then(/* ... */);
}
// Promise.reject()
Promise.reject(new Error("some awful error"));
// Promise.catch() is actually just sugar for this
somePromise().then(null, function(err) {
  // ...
});

// Executing promises sequentially after the other with promise factories
function executeSequentially(promiseFactories) {
  var result = Promise.resolve();
  promiseFactories.forEach(function(promiseFactory) {
    result = result.then(promiseFactory);
  });
  return result;
}
// Promise factory is function that returns a promise
function myPromiseFactory() {
  return somethingThatCreatesAPromise();
}

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
 * - function declarations are hoisted but class declarations aren't
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
 * LocalStorage
 * - window.localStorage, stores data across browser sessions, no expiration time for data
 */
const myLocalStorage = window.localStorage;

myLocalStorage.setItem("myDoge", "Juno");
const junoDoge = myLocalStorage.getItem("myDoge");

myLocalStorage.removeItem("myDoge");

/*
 * SessionStorage
 * - window.sessionStorage, stores data but gets cleared when page session ends
 * - page session lasts as long as browser is open and survives over page reloads and restores
 * - opening page in a new tab or window will cause a new session to be initiated
 */
const mySessionStorage = window.sessionStorage;

mySessionStorage.setItem("myDoge", "Juno");
const junoDoge = mySessionStorage.getItem("myDoge");

mySessionStorage.removeItem("key");
mySessionStorage.clear();

/*
 * Cookies
 * - can get and set cookies associated with current document
 * - for user privacy, one should invalidate cookie data after a certain timeout and won't rely on browser clearing session cookies
 * - ;expires;secure;max-age
 * - use encodeURIComponent() to ensure string doesn't have any commas, semicolons, or white space
 * - Path attribute does not protect against unauthorized reading of cookie from a different path, can be bypassed using DOM with hidden iframe element with
 * path of cookie and accessing iframe's contentDocument.cookie
 * -> must use different domain/subdomain due to same origin policy
 */
// String containing a semicolon-separated list of all cookies i.e. key=value pairs
const allCookies = document.cookie;
// Reset cookie
function resetOnce() {
  document.cookie =
    "doSomethingOnlyOnce=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
// Check a cookie existence
if (document.cookie.split(";").indexOf("reader=") >= 0) {
  console.log('The cookie "reader" exists');
}
// Check a cookie has specific value
if (document.cookie.split(";").indexOf("reader=1") >= 0) {
  console.log('The cookie "reader" has "1" for value');
}

/*
 * IndexedDB
 * - low-level API for client-side storage of significant amounts of structured data, including files/blobs
 * - can work with database-esque object store in browser, can store typed information, define primary keys, indexing, transactions to prevent data integrity issues
 * - for app to run offline, can use IndexedDB along with Cache API (part of Service Workers)
 * - for high-performance searches of data; Web Storage for smaller amounts of data and this is for larger amounts of data
 * - transactional database system like SQL-based RDBMS; JS-based object-oriented database
 * -> need to specify database schema, open connection to database and retrieve/update data within a series of transactions
 * - operations done asynchronously
 * - web data storage space and what to delete when limit is reached differs between 
 * - examples: https://hacks.mozilla.org/2012/02/storing-images-and-files-in-indexeddb/
 */
const IDBOpenDBRequest = indexedDB.open(name);

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

/[\w]+/g.test("word");

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
 * - selecting/finding nodes using document.querySelector and document.getElementsByTagName in older browsers
 * - traversal up and down: Node.parentNode, Node.firstChild, Node.lastChild, Node.childNodes
 * - traversal left and right: Node.previousSibling, Node.nextSibling
 * - each element has read-only properties referencing the family which are live: myElement.children, myElement.firstElementChild,
 * lastElementChild, previousElementSibling, nextElementSibling
 * -> Element interface inherits from Node interface so we also have access to these: childNodes, firstChild, lastChild, previousSibling, nextSibling,
 * parentNode, parentElement -> can be any kind of node like text nodes
 * i.e. can check type of given node like myElement.firstChild.nodeType === 3 for text node
 * or myElement.firstChild.nodeType instanceOf Text
 */
// Accessing DOM elements
// Returns a reference to the element by its ID
// - live
document.getElementById("someid");

// Returns an array-like object of all child elements which have all of the given class names.
// - live
document.getElementsByClassName("someclass");

// Returns an HTMLCollection of elements with the given tag name.
// - live so dynamically updating DOM will affect it
document.getElementsByTagName("LI");

// Returns the first element within the document that matches the specified group of selectors.
// - not live so when we dynamically add an element, the collection won't update
document.querySelector(".someclass");

// Returns a list of the elements within the document (using depth-first pre-order traversal of the document's nodes)
// that match the specified group of selectors.
// - not live, returns a NodeList and not an Array so we must convert to array first
document.querySelectorAll("div.note, div.alert");

// Grab children/parent nodes
// Get child nodes
const stored = document.getElementById("someid");
const children = stored.childNodes;

// Get parent node
const parent = children.parentNode;

// Create new DOM Elements
// Create new elements
var newHeading = document.createElement("h1");
var newParagraph = document.createElement("p");

// Using .getAttribute(), .setAttribute(), .removeAttribute() directly modify HTML attributes as opposed
// to DOM properties of an element and cause a browser redraw
// Get an attribute value
const value = myElement.value;
// Set an attribute as an element property
myElement.value = "foo";

// Create text nodes for new elements
var h1Text = document.createTextNode("This is a nice header text!");
var pText = document.createTextNode("This is a nice paragraph text!");

// Attach new text nodes to new elements
newHeading.appendChild(h1Text);
newParagraph.appendChild(pText);
// Elements are now created and ready to be added to the DOM.

// Add elements to the DOM
// grab element on page you want to add stuff to
var firstHeading = document.getElementById("firstHeading");

// Add both new elements to the page as children to the element we stored in firstHeading.
firstHeading.appendChild(newHeading);
firstHeading.appendChild(newParagraph);

// Can also insert before like so

// Get parent node of firstHeading
var parent = firstHeading.parentNode;

// Insert newHeading before FirstHeading
parent.insertBefore(newHeading, firstHeading);

// Add Elements to the DOM cont.
var box2 = document.getElementById("box2");
box2.insertAdjacentHTML("beforebegin", "<div><p>This gets inserted.</p></div>");

// beforebegin - The HTML would be placed immediately before the element, as a sibling.
// afterbegin - The HTML would be placed inside the element, before its first child.
// beforeend - The HTML would be placed inside the element, after its last child.
// afterend - The HTML would be placed immediately after the element, as a sibling.

// Removing children from a parent element
myParentElement.removeChild(myElement);
// or
myElement.parentNode.removeChild(myElement);

// Create a clone
const myElementClone = myElement.cloneNode(); // if set to true it will do a deep copy of it and its children
myParentElement.appendChild(myElementClone);

// Add/Remove/Toggle/Check Classes
// Grab element on page you want to use
var firstHeading = document.getElementById("firstHeading");

// Will remove foo if it is a class of firstHeading
firstHeading.classList.remove("foo");

// Will add the class 'anotherClass' if one does not already exist
firstHeading.classList.add("anotherclass");

// Add or remove multiple classes
firstHeading.classList.add("foo", "bar");
firstHeading.classList.remove("foo", "bar");

// If visible class is set remove it, otherwise add it
firstHeading.classList.toggle("visible");

// Will return true if it has class of 'foo' or false if it does not
firstHeading.classList.contains("foo");

// Adding CSS styles (camel-cased)
myElement.style.marginLeft = "2em";

// DocumentFragments: virtual node to place children elements on without root and to create structure
// - faster as once tree of DOM nodes ready to hit page, can place fragment into its parent
// - faster than repeated single DOM node injection and allows devs to perform DOM node operations like adding events on new elements
// instead of mass-injection via innerHTML
var frag = document.createDocumentFragment();
// Create numerous list items, add to fragment
for (var x = 0; x < 10; x++) {
  var li = document.createElement("li");
  li.innerHTML = "List item " + x;
  frag.appendChild(li);
}
// Mass-add the fragment nodes to the list
listNode.appendChild(frag);

// Event Listeners
// Better than adding property of element like .onclick cause you cannot add additional listeners and will just be overwritten
// - event.type, event.target (element on which event was triggered)
// - event.preventDefault(): prevent browser's default behavior like following a link or prevent submission of a form if client-side validation fails
// - event.stopPropagation(): prevent event from bubbling up the DOM
const myForm = document.forms[0];
const myInputElements = myForm.querySelectorAll("input");

Array.from(myInputElements).forEach(el => {
  el.addEventListener("change", function(event) {
    console.log(event.target.value);
  });
});
// Event Delegation: having one event listener on parent to react to all children events
// - accounts for dynamically inserted children as well without having to bind new listeners to each child (less memory)
myForm.addEventListener("change", function(event) {
  const target = event.target;
  if (target.matches("input")) {
    console.log(target.value);
  }
});

// window.requestAnimationFrame()
// - schedule all current changes to next browser repaint frame
// - don't use window.setTimeout for desired animation as it forces rapid document reflows and layout thrashing can lead to stuttering
// on mobile devices
const start = window.performance.now();
const duration = 2000;

window.requestAnimationFrame(function fadeIn(now) {
  const progress = now - start;
  myElement.style.opacity = progress / duration;

  if (progress < duration) {
    window.requestAnimationFrame(fadeIn);
  }
});

// jQuery lite helper methods
const $ = function $(selector, context = document) {
  const elements = Array.from(context.querySelectorAll(selector));

  return {
    elements,

    html(newHtml) {
      this.elements.forEach(element => {
        element.innerHTML = newHtml;
      });

      return this;
    },

    css(newCss) {
      this.elements.forEach(element => {
        Object.assign(element.style, newCss);
      });

      return this;
    },

    on(event, handler, options) {
      this.elements.forEach(element => {
        element.addEventListener(event, handler, options);
      });

      return this;
    },

    // etc.
  };
};

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

// Browser/DOM events and Event Handling

/*
 * Event Loop and Concurrency Model
 * - function calls form a stack of frames with its arguments and local variables
 * -> finished function frames are popped out of the stack until it is empty
 * - heap: objects allocated here in large mostly unstructured region of memory
 * - runtime uses a message queue, which is a list of messages to be processed
 * -> each message has an associated function which gets called in order to handle the message
 * -> runtime starts handling messages on queue starting with oldest one, corresponding function is called with message as
 * input parameter which creates a new stack frame for that function's use
 * -> processing of functions continues until stack is empty and then the event loop will process the next message in queue if there is one
 * - each message is processed completely before any other message is processed though it can prevent
 * other events to happen until "Script is taking too long...", "run-to-completion"
 * - messages added anytime an event occurs and there is an event listener attached to it; if no listener, event is lost
 * i.e. setTimeout with message to add to queue and time value (minimum time not guaranteed time)
 * - setTimeout with 0 doesn't mean will fire off after 0ms, execution depends on the number of waiting taks in the queue
 * - web worker or cross-origin iframe has its own stack, heap, and message queue
 * -> two distinct runtimes can communicate through sending messages via postMessage method and it adds a message to the other runtime if the latter listens
 * to message events
 * - never blocks, handling I/O via events and callbacks so when waiting for response from XHR request it can still process input
 * -> though alert or synchronous XHR are blocking
 */
// Event loop is implemented like this
// waits synchronously for a message to arrive if there is none currently
while (queue.waitForMessage()) {
  queue.processNextMessage();
}

/*
 * Memory Management
 * - allocate memory you need, use allocated memory (read/write), release allocated memory when not needed anymore
 * - general problem of automatically finding whether some memory is not needed anymore is undecidable
 * - garbage collection: relies on notion of reference i.e. object with reference to prototype and property values
 * -> naive garbage collection algorithm with reference counting (not needed if 0 references); limitations with cycles like when 
 * two objects created and reference one another and go out of scope, they will never be freed
 * i.e. IE6 and 7 reference-counting garbage collectors for DOM objects, can have memory leaks due to cycle references
 * -> mark-and-sweep algorithm: object is unreachable; assumes knowledge of set of objects called roots (root is global object)
 * garbage collector will start from roots and find all objects that are referenced from these roots, then all objects referenced from these, etc.
 * it will then find all reachable objects and collect all non-reachable objects; "object has zero references" leads to object being unreachable
 * --> cycles not a problem anymore because say after a function call returns, the cycle reference object is not referenced anymore by something reachable
 * from the global object and will be found unreachable by the garbage collection -> used by most browsers
 * --> limitation: objects need to be made explicitly unreachable
 */
var n = 123; // allocates memory for a number
var s = "azerty"; // allocates memory for a string

var o = {
  a: 1,
  b: null,
}; // allocates memory for an object and contained values

// (like object) allocates memory for the array and
// contained values
var a = [1, null, "abra"];

function f(a) {
  return a + 2;
} // allocates a function (which is a callable object)

// function expressions also allocate an object
someElement.addEventListener(
  "click",
  function() {
    someElement.style.backgroundColor = "blue";
  },
  false
);

/*
 * Interview Practice Questions
 */

/*
 * Pass-by-reference or pass-by-value language?
 * - passed by value but when a variable refers to an object (including arrays)
 * the value is a reference to the object
 * - changing value of variable never changes underlying primitive or object, it just points the variable to a new primitive
 * or object
 * - changing a property of an object referenced by a variable does change the underlying object
 */
function changeStuff(a, b, c) {
  a = a * 10;
  b.item = "changed";
  c = { item: "changed" };
}

var num = 10;
var obj1 = { item: "unchanged" };
var obj2 = { item: "unchanged" };

changeStuff(num, obj1, obj2);
console.log(num); // 10
console.log(obj1.item); // changed
console.log(obj2.item); // unchanged

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
 * - browser events can fire many times within short timespan like resizing window or scrolling a page
 * i.e. may fire thousands of times upon scrolling down page if event listener on window scroll event
 * i.e. key pressing, rapid click events
 * - debouncing helps to limit the time that needs to pass by until a function is called again
 * -> group several function calls into one and execute it only once after some time elapsed
 */
// Wrapping this around an event will execute only after a certain amount of time has elapsed
function debounce(fn, delay) {
  // Maintain a timer
  let timer = null;

  // Closure function that has access to timer
  return function() {
    // Get scope and parameters of function via 'this' and 'arguments'
    let context = this;
    let args = arguments;

    // If an event is called, clear the timer and start over
    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
}

// Usage:
function foo() {
  console.log("You are scrolling");
}
// Wrap our function in a debounce to fire once 2 seconds have gone by
let elem = document.getElementById("container");
elem.addEventListener("scroll", debounce(foo, 2000));

// Another sample debounce/throttle
var helpers = {
  /**
   * debouncing, executes the function if there was no new event in $wait milliseconds
   * @param func
   * @param wait
   * @param scope
   * @returns {Function}
   */
  debounce: function(func, wait, scope) {
    var timeout;
    return function() {
      var context = scope || this,
        args = arguments;
      var later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * In case of a "storm of events", this executes once every $threshold
   * @param fn
   * @param threshold
   * @param scope
   * @returns {Function}
   */
  throttle: function(fn, threshold, scope) {
    threshold || (threshold = 250);
    var last, deferTimer;

    return function() {
      var context = scope || this;
      var now = +new Date(),
        args = arguments;

      if (last && now < last + threshold) {
        // Hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function() {
          last = now;
          fn.apply(context, args);
        }, threshold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  },
};

var resizeHandler = function() {
  console.log("do stuff");
};

// Debounce by waiting 0.25s (250ms) with "this" context
window.addEventListener("resize", helpers.debounce(resizeHandler, 250, this));

/*
 * Throttling
 * - instead of waiting for some time to pass by before calling a function, throttling just
 * spreads the function calls across a longer time interval
 * i.e. if event occurs 10 times within 100ms, one can spread out each of function calls to be executed once every 2 seconds instead of all
 * firing within 100ms
 * - limiting the amount a function is executed over a time period
 */
// This throttle allows only one function call within limit and only first function call
// is waiting to be throttled
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    // Function will not be executed until throttle period has passed
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
// How about dealing with last incovation as if it's in limit period it will be ignored?
// - throttle is like a chaining debounce, each time the debounce waiting period is reduced accordingly
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan; // Timestamp of last invocation
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      // Update timeout with last function invocation and run it only after limit has passed
      lastFunc = setTimeout(function() {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

/*
 * Autocomplete onKeyPress calls - debounce calls to server rather than 30 key presses and 30 server calls
 * - closures, setTimeout (get back ID to uniquely reference timeout so you can cancel it whenever with clearTimeout)
 * - need to interrupt timeout and not make call to server until user finishes keypresses
 * - if not relying on the server, one can use a Trie to store all prefixes of words and then return all words with that prefix
 */
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("keypress", function(e) {
  // Clear timeout if user presses key and there is a request waiting to be done
  if (this.timeoutId) {
    window.clearTimeout(this.timeoutId);
  }
  // Debounce the server request to happen after 200ms instead
  this.timeoutId = window.setTimeout(function() {
    // Make XHR request here
  }, 200);
});

/*
  AsyncMap
  - given array of asynchronous functions and callback function to perform an action when all functions of array
  finished executing
  -> results of async functions in proper order, each of functions within input array will take its own callback
  -> simulates a synchronous mapping function even though functions executed asynchronously
  - using IIFE to maintain variable's private state by giving it a new scope while still having access to variables from outer scope
  - asynchronous processing model: processor starts to process instructions' operations and hands those operations an instructions of how to return result when complete;
  then, the processor continues to the next instruction without waiting for the prior instruction's operations to complete
  once operations complete, can use provided instructions to callback to processor with result to avoid getting blocked by costly operations
*/
// Imperative Solution
var asyncMap = function(jobs, cb) {
  var results = [];
  var finished = 0;

  for (var i = 0; i < jobs.length; i++) {
    (function(i) {
      var job = jobs[i];
      // Each job triggers its callback to return the value of its work which is then stored
      // in results
      job(function(val) {
        results[i] = val;
        finished++;
        if (finished === jobs.length) {
          cb(results);
        }
      });
    })(i);
  }
};
// Functional way
var asyncMap = function(jobs, cb) {
  var results = [];
  var finished = jobs.length;

  jobs.forEach(function(job, i) {
    job(function(result) {
      results[i] = result;
      finished--;
      if (finished === 0) {
        cb(results);
      }
    });
  });
};

// Usage
var job1 = function(cb) {
  setTimeout(function() {
    cb("one");
  }, 100);
};

var job2 = function(cb) {
  setTimeout(function() {
    cb("two");
  }, 100);
};

var callback = function(results) {
  console.log(results);
};

asyncMap([job1, job2], callback);

/*
 * Deep merging objects (arrays and normal objects)
 */
// First shallow merge (take two objects and add all own property of second object into first object)
// will overwrite values if they share same properties
function sMerge(toObj, fromObj) {
  return Object.assign(toObj, fromObj);
}
// or without ES6
function sMerge(toObj, fromObj) {
  // Make sure both parameters are objects
  if (typeof toObj === "object" && typeof fromObj === "object") {
    for (var pro in fromObj) {
      // Assign only own properties not inherited properties fromObj to toObj
      if (fromObj.hasOwnProperty(pro)) {
        // Assign property and value
        toObj[pro] = fromObj[pro];
      }
    }
  } else {
    throw new Error("Merge function can apply only on object");
  }
}
// Deep Merge
function isMergeableObject(val) {
  var nonNullObject = val && typeof val === "object";

  return (
    nonNullObject &&
    Object.prototype.toString.call(val) !== "[object RegExp]" &&
    Object.prototype.toString.call(val) !== "[object Date]"
  );
}

function emptyTarget(val) {
  return Array.isArray(val) ? [] : {};
}

function cloneIfNecessary(value, optionsArgument) {
  var clone = optionsArgument && optionsArgument.clone === true;
  return clone && isMergeableObject(value)
    ? deepmerge(emptyTarget(value), value, optionsArgument)
    : value;
}

function defaultArrayMerge(target, source, optionsArgument) {
  var destination = target.slice();
  source.forEach(function(e, i) {
    if (typeof destination[i] === "undefined") {
      destination[i] = cloneIfNecessary(e, optionsArgument);
    } else if (isMergeableObject(e)) {
      destination[i] = deepmerge(target[i], e, optionsArgument);
    } else if (target.indexOf(e) === -1) {
      destination.push(cloneIfNecessary(e, optionsArgument));
    }
  });
  return destination;
}

function mergeObject(target, source, optionsArgument) {
  var destination = {};
  if (isMergeableObject(target)) {
    Object.keys(target).forEach(function(key) {
      destination[key] = cloneIfNecessary(target[key], optionsArgument);
    });
  }
  Object.keys(source).forEach(function(key) {
    if (!isMergeableObject(source[key]) || !target[key]) {
      destination[key] = cloneIfNecessary(source[key], optionsArgument);
    } else {
      destination[key] = deepmerge(target[key], source[key], optionsArgument);
    }
  });
  return destination;
}

function deepmerge(target, source, optionsArgument) {
  var array = Array.isArray(source);
  var options = optionsArgument || { arrayMerge: defaultArrayMerge };
  var arrayMerge = options.arrayMerge || defaultArrayMerge;

  if (array) {
    return Array.isArray(target)
      ? arrayMerge(target, source, optionsArgument)
      : cloneIfNecessary(source, optionsArgument);
  } else {
    return mergeObject(target, source, optionsArgument);
  }
}

deepmerge.all = function deepmergeAll(array, optionsArgument) {
  if (!Array.isArray(array) || array.length < 2) {
    throw new Error(
      "first argument should be an array with at least two elements"
    );
  }

  // we are sure there are at least 2 values, so it is safe to have no initial value
  return array.reduce(function(prev, next) {
    return deepmerge(prev, next, optionsArgument);
  });
};

/*
 * Creating a non-enumerable property with Object.defineProperty();
 */
var person = {
  name: "Alfred",
};
Object.defineProperty(person, "phone", {
  value: "XXX-XXX-XXXX",
  enumerable: false,
});
Object.keys(person);

/*
 * Creating an NxN dimensional array helper function
 */
function createArray(length) {
  var arr = new Array(length || 0),
    i = length;

  if (arguments.length > 1) {
    var args = Array.prototype.slice.call(arguments, 1);
    while (i--) arr[length - 1 - i] = createArray.apply(this, args);
  }

  return arr;
}

/*
 * Implementing a Trie for O(KeyLength) inserts and searches
 * and O(AlphabetSize * KeyLength * NumKeys) space complexity
 */
function TrieNode() {
  this.children = new Array(26).fill(null);
  this.isEndOfWord = false;
}

/**
 * Initialize your Trie
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
 * Currying like mul(2)(3)(4)
 * - function is instance of Object type, can have properties and link back to constructor method
 * - first class object, can be stored as variable, can be passed as parameter to another function
 * - function can be returned from function
 */
const mul = x => y => z => x * y * z;

// Currying = partial invocation of a function; first few arguments of a function is pre-processed and function is returned
// - returning function can add more arguments to curried function
// - creating a closure that returns a function
function addBase(base) {
  return function(num) {
    return base + num;
  };
}
// Adding a curry method to the protoype of Function
Function.prototype.curry = function() {
  if (arguments.length < 1) {
    return this; // Nothing to curry, return the function
  }
  var self = this;
  var args = toArray(arguments);
  return function() {
    return self.apply(this, args.concat(toArray(arguments)));
  };
};
function toArray(args) {
  return Array.prototype.slice.call(args);
}
// Usage
var converter = function(factor, symbol, input) {
  return input * factor + symbol;
};
var milesToKm = converter.curry(1.62, "km");
milesToKm(3);
var kgToLb = converter.curry(2.2, "lb");
kgToLb(3);

/*
 * Supporting either function syntax: sum(2, 3) or sum(2)(3)
 * - JS does not require the number of arguments to match number of arguments in function definition
 * (less arguments leads to undefined in missing arguments)
 */
function sum(x) {
  if (y !== undefined) {
    return x + y;
  } else {
    return function(y) {
      return x + y;
    };
  }
}

/*
 * Common scoping/closure errors
 */
// Will only console log 5 in each button click because shares same lexical environment
for (var i = 0; i < 5; i++) {
  var btn = document.createElement("button");
  btn.appendChild(document.createTextNode("Button " + i));
  btn.addEventListener(
    "click",
    (function(i) {
      return function() {
        console.log(i);
      };
    })(i)
  );
  document.body.appendChild(btn);
}
// To fix it by wrapping in IIFE
for (var i = 0; i < 5; i++) {
  var btn = document.createElement("button");
  btn.appendChild(document.createTextNode("Button " + i));
  (function(i) {
    btn.addEventListener("click", function() {
      console.log(i);
    });
  })(i);
  document.body.appendChild(btn);
}
// Using forEach to have separate lexical environment with different i values
["a", "b", "c", "d", "e"].forEach(function(value, i) {
  var btn = document.createElement("button");
  btn.appendChild(document.createTextNode("Button " + i));
  btn.addEventListener("click", function() {
    console.log(i);
  });
  document.body.appendChild(btn);
});
// Or just do block scoping with let
for (let i = 0; i < 5; i++) {
  var btn = document.createElement("button");
  btn.appendChild(document.createTextNode("Button " + i));
  btn.addEventListener("click", function() {
    console.log(i);
  });
  document.body.appendChild(btn);
}

// Closure = when inner function has access to variables outside of its scope, for privacy and function factories
// Function that will loop through a list of integers and print index of each element after a 3 second delay
const arr = [10, 12, 15, 21];
for (var i = 0; i < arr.length; i++) {
  // Pass in the variable i so that each function has access to the correct index
  setTimeout(
    (function(localI) {
      return function() {
        console.log("The index of this number is: " + localI);
      };
    })(i),
    3000
  );
}
// or with let block scoping
const arr = [10, 12, 15, 21];
for (let i = 0; i < arr.length; i++) {
  // Creates a new binding with let index everytime function is called
  setTimeout(function() {
    console.log("The index of this number is: " + i);
  }, 3000);
}

/*
 * Preventing stack overflow by using setTimeout
 * - timeout function pushed to event queue and function exits right away and leaves call stack clear
 */
var list = readHugeList();

var nextListItem = function() {
  var item = list.pop();

  if (item) {
    // process the list item...
    setTimeout(nextListItem, 0);
  }
};

/*
 * Given a DOM element on the page, visit element itself and all of its descendants (not just immediate children),
 * For each element visited, function should pass that element to a provided callback function
 */
function traverseElementDescendants(ele, callback) {
  callback(ele);
  const list = ele.children;
  // DFS recursive way
  for (let i = 0; i < list.length; i++) {
    traverseElementDescendants(list[i], callback);
  }
}

/*
 * Cloning an object
 */
// Object.assign() only does a shallow copy, not a deep copy; nested objects aren't copied but
// still refer to same nested objects as original
let obj = {
  a: 1,
  b: 2,
  c: {
    age: 30,
  },
};
let objClone = Object.assign({}, obj);
obj.c.age = 45;
console.log(objClone.c.age); // 45 too

// Another shallow copy way
function shallowClone(object) {
  var newObject = {};
  for (var key in object) {
    newObject[key] = object[key];
  }
  return newObject;
}

// Deep cloning an object - simple not totally correct version as it goes through keys in object prototype
// and does not handle different types of objects i.e. Arrays, Dates, RegExp, Function, DOM elements
function deepClone(object) {
  var newObject = {};
  for (var key in object) {
    // Can also do && source[property] !== null since null considered object
    if (typeof object[key] === "object") {
      newObject[key] = deepClone(object[key]);
    } else {
      newObject[key] = object[key];
    }
  }
  return newObject;
}

// Handling most cases of the different objects
// In order to deep clone objects, you need to handle Arrays, Objects, Dates, RegExp, functions, null, etc.
function clone(src, deep) {
  var toString = Object.prototype.toString;
  if (!src && typeof src != "object") {
    // Any non-object (Boolean, String, Number), null, undefined, NaN
    return src;
  }

  // Honor native/custom clone methods
  if (src.clone && toString.call(src.clone) == "[object Function]") {
    return src.clone(deep);
  }

  // DOM elements
  if (src.nodeType && toString.call(src.cloneNode) == "[object Function]") {
    return src.cloneNode(deep);
  }

  // Date
  if (toString.call(src) == "[object Date]") {
    return new Date(src.getTime());
  }

  // RegExp
  if (toString.call(src) == "[object RegExp]") {
    return new RegExp(src);
  }

  // Function
  if (toString.call(src) == "[object Function]") {
    //Wrap in another method to make sure == is not true;
    //Note: Huge performance issue due to closures, comment this :)
    return function() {
      src.apply(this, arguments);
    };
  }

  var ret, index;
  //Array
  if (toString.call(src) == "[object Array]") {
    //[].slice(0) would soft clone
    ret = src.slice();
    if (deep) {
      index = ret.length;
      while (index--) {
        ret[index] = clone(ret[index], true);
      }
    }
  } else {
    //Object
    ret = src.constructor ? new src.constructor() : {};
    for (var prop in src) {
      ret[prop] = deep ? clone(src[prop], true) : src[prop];
    }
  }
  return ret;
}

/*
 * Palindrome String
 */
function isPalindrome(str) {
  str = str.replace(/\s/g, "").toLowerCase();
  return (
    str ===
    str
      .split("")
      .reverse()
      .join("")
  );
}

/*
 * Detecting undefined object property in JavaScript
 */
if (typeof someProperty === "undefined") {
  console.log("Undefined found");
}

/*
 * Seeing if an object is an array
 */
// using native toString() method to produce a standard string in all browsers
function isArray(value) {
  return Object.prototype.toString.call(value) === "[object Array]";
}
// using ES5 Array.isArray
function isArrayV2(value) {
  // ES5 feature detection
  if (typeof Array.isArray === "function") {
    return Array.isArray(value);
  } else {
    return Object.prototype.toString.call(value) === "[object Array]";
  }
}
// Seeing if string literal or object
function isString(str) {
  return typeof str === "string" || str instanceof String;
}

/*
 * Checking whether a key exists in a JavaScript object or not
 */
// To detect own and inherited property (in prototype chain) of object
console.log("name" in personObject);
// To detect own property of object
console.log(personObject.hasOwnProperty("name"));

/*
 * Associate Array - calculating length of it
 */
var counterArray = {
  A: 3,
  B: 4,
};
counterArray["C"] = 1;

Object.keys(counterArray).length; // 3

/*
 * Log function to add prefix message before every console.log
 */
function appLog() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift("Your app name");
  console.log.apply(console, args);
}
console.log(appLog("Some error message")); // Your app name Some error message

/*
  Using arbitrary value of this using bind, call, apply
  - bind lets you borrow a method and set value of this without calling the function
  - shimming bind function in older browser, returns back function with proper this context
*/
Function.prototype.bind =
  Function.prototype.bind ||
  function(context) {
    var self = this;
    return function() {
      return self.apply(context, arguments);
    };
  };

/*
  Function to tell whether 2 is passed as parameter or not
*/
function isTwoPassed() {
  var args = Array.prototype.slice.call(arguments);
  return args.indexOf(2) !== -1;
}

/*
  Using Math.max to find max value in array => use apply
*/
function getMax(arr) {
  Math.max.apply(null, arr);
}

/*
  Cache function execution - memoization, caching calculated value of function
  - when you call function with same argument, cached value will be serve
*/
function cacheFn(fn) {
  var cache = {};

  return function(arg) {
    // Return cached result if passed with same arguments
    if (cache[arg]) {
      return cache[arg];
    } else {
      cache[arg] = fn(arg);
      return cache[arg];
    }
  };
}
// What if passing more than one argument?
// - need to generate key for cache object with all parameters concatenated
function cacheArrFn(fn) {
  var cache = {};
  return function() {
    var args = arguments;
    var key = [].slice.call(args).join("");
    if (cache[key]) {
      return cache[key];
    } else {
      cache[key] = fn.apply(this, args);
      return cache[key];
    }
  };
}

/*
  jQuery Style Chaining - chaining with callback
*/
var obj = {
  first: function() {
    console.log("first");
    return obj;
  },
  second: function() {
    console.log("second");
    return obj;
  },
  third: function() {
    console.log("third");
    return obj;
  },
};
// Usage
obj
  .first()
  .second()
  .third();

/*
  Animation: moveLeft
  - use setInterval to place element to left position by some pixels in every 10ms,
  - setInterval returns a timeId; after reaching desired location, you have to clear time interval so function will not be
  called again and again in every 10ms
*/
function moveLeft(elem, distance) {
  var left = 0;
  var timeId = setInterval(frame, 10);

  function frame() {
    left++;
    elem.style.left = left + "px";

    if (left === distance) {
      clearInterval(timeId);
    }
  }
}

/*
  Event Delegation
  - i.e. simple todo list, want an action to occur when a user clicks one of the list items
  Markup:
  <ul id="todo-app">
    <li class="item">Walk the doge</li>
    <li class="item">Pay le bills</li>
    <li class="item">Make dindin</li>
    <li class="item">Code for dayz</li>
  </ul>
*/
// Attaching event listener to every single item individually, not efficient as it will create 10,000
// event listeners and attach each to DOM for 10,000 items -> want to reduce code duplication, number of elements may be dynamic
// - each carries data about an event listener and its properties that affects memory usage
// - ask for what maximum number of elements is
document.addEventListener("DOMContentLoaded", function() {
  let app = document.getElementById("todo-app");
  let items = app.getElementsByClassName("item");

  // Attach event listener to each item
  for (let item of items) {
    item.addEventListener("click", function() {
      alert("You clicked on item: " + item.innerHTML);
    });
  }
});

// Efficient event delegation: attach one event listener to whole container and then access each item when it's actually clicked
// e.target = target of event, e.currentTarget = target element that event listener is attached to
document.addEventListener("DOMContentLoaded", function() {
  let app = document.getElementById("todo-app");
  // Attach event listener to whole container
  app.addEventListener("click", function(e) {
    if (e.target && e.target.nodeName === "LI") {
      let item = e.target;
      alert("You clicked on item: " + item.innerHTML);
    }
    // Can also stop event propagation up the DOM with e.stopPropagation
  });
});

// Another Event Delegation Sample
// - doesn't matter how many children parent has, one event listener
var theParent = document.querySelector("#theDude");
theParent.addEventListener("click", doSomething, false);

function doSomething(e) {
  if (e.target !== e.currentTarget) {
    var clickedItem = e.target.id;
    alert("Hello " + clickedItem);
  }
  e.stopPropagation();
}

/*
 * Depth-First Search (LIFO - stacks) and Breadth First Search (FIFO - queues)
 */
// DFS Traversal of Tree
function TreeNode() {
  this.val = null;
  this.children = [];
}

function treeDFS(root) {
  if (!root) {
    return;
  }
  const stack = [root];
  while (stack.length > 0) {
    const cur = stack.pop();

    if (cur.children.length === 0) {
      continue;
    }

    // Must add in children in reverse direction to retain LIFO structure
    for (let idx = cur.children.length - 1; idx >= 0; idx--) {
      stack.push(cur.children[idx]);
    }
  }
}

// BFS Traversal of Tree
function treeBFS(root) {
  if (!root) {
    return;
  }
  const queue = [root];
  while (queue.length > 0) {
    const cur = queue.shift();

    if (cur.children.length === 0) {
      continue;
    }

    // We add children from left to right as they should appear first in FIFO
    for (let idx = 0; idx < cur.children.length; idx++) {
      queue.push(cur.children[idx]);
    }
  }
}

/*
 * Factory Pattern
 * - Simple Factory: object which encapsulate creation of another object
 * i.e. constructor being instantiated by "new" like classes
 * - Factory method: defines one method which is overridden by subclasses who decide what to return
 * - Abstract factory: provides interface for creating families of related or dependent objects without specifying their concrete classes
 */
// Sample Factory to create different User subclasses
const Factory = {
  registeredTypes: new Map(),
  register(className, classDef) {
    if (
      !(
        Factory.registeredTypes.has(className) &&
        Class.prototype instanceof User
      )
    ) {
      Factory._registeredTypes.set(className, classDef);
    } else {
      console.log("Already registered class");
    }
  },
  create(className, ...options) {
    if (!Factory.registeredTypes.has(className)) {
      console.error("!!!");
      return null;
    }
    let classDef = this.registeredTypes.get(className);
    let instance = new classDef(...options);
    return instance;
  },
}(
  /*
 * Module Pattern
 * - for keeping pieces of code independent of other components for loose coupling
 * - encapsulation, public/private access levels, should be IIFE to allow for private scopes (closure to protect variables and methods) and return an object
 */
  function() {
    // Declare private variables and/or functions

    return {
      // Declare public variables and/or functions
    };
  }
)();
// Revealing Module Pattern
// - for encapsulation and reveal certain variables and methods returned in object literal
// - unable to reference private methods and public behaviors are non-overridable
var Exposer = (function() {
  var privateVariable = 10;

  var privateMethod = function() {
    console.log("Inside a private method!");
    privateVariable++;
  };

  var methodToExpose = function() {
    console.log("This is a method I want to expose!");
  };

  var otherMethodIWantToExpose = function() {
    privateMethod();
  };

  return {
    first: methodToExpose,
    second: otherMethodIWantToExpose,
  };
})();

/*
 * Prototype Pattern
 * - used for creating objects in performance-intensive situations
 * - objects created are shallow clones of original object that are passed around
 * - constructor must exist to instantiate the first object
 */
// Constructor allows creation of single TeslaModelS object and when creating a new object,
// it will retain states initialized in construtor
var TeslaModelS = function() {
  this.numWheels = 4;
  this.manufacturer = "Tesla";
  this.make = "Model S";
};

TeslaModelS.prototype.go = function() {
  // Rotate wheels
};

TeslaModelS.prototype.stop = function() {
  // Apply brake pads
};
// Revealing Prototype Pattern
// with encapsulation of public and private members since it returns object literal
var TeslaModelS = function() {
  this.numWheels = 4;
  this.manufacturer = "Tesla";
  this.make = "Model S";
};

TeslaModelS.prototype = (function() {
  var go = function() {
    // Rotate wheels
  };

  var stop = function() {
    // Apply brake pads
  };

  return {
    pressBrakePedal: stop,
    pressGasPedal: go,
  };
})();

/*
 * Observer Pattern
 * - when one part of application changes, other parts need to be updated  i.e. AngularJS $scope object updates notify another component
 * - if an object is modified it broadcasts to dependent objects that a change has occurred
 * - model-view-controller architecture: view updates when model changes and one can decouple view from model to reduce dependencies
 * - may have drop in performance as number of observers increase i.e. watchers in AngularJS
 * - can create subjects and observers
 * - publish/subscribe pattern uses topic/event channel that sits between objects wishing to receive notifications (subscribers) and object
 * firing the event (publisher)
 */
var Subject = function() {
  this.observers = [];

  return {
    subscribeObserver: function(observer) {
      this.observers.push(observer);
    },
    unsubscribeObserver: function(observer) {
      var index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    },
    notifyObserver: function(observer) {
      var index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers[index].notify(index);
      }
    },
    notifyAllObservers: function() {
      for (var i = 0; i < this.observers.length; i++) {
        this.observers[i].notify(i);
      }
    },
  };
};

var Observer = function() {
  return {
    notify: function(index) {
      console.log("Observer " + index + " is notified!");
    },
  };
};

var subject = new Subject();

var observer1 = new Observer();
var observer2 = new Observer();
var observer3 = new Observer();
var observer4 = new Observer();

subject.subscribeObserver(observer1);
subject.subscribeObserver(observer2);
subject.subscribeObserver(observer3);
subject.subscribeObserver(observer4);

subject.notifyObserver(observer2); // Observer 2 is notified!

subject.notifyAllObservers();
// Observer 1 is notified!
// Observer 2 is notified!
// Observer 3 is notified!
// Observer 4 is notified!

/*
 * Singleton Pattern
 * - great way to wrap code into a logical unit that can be accessed through a single variable
 * - used when only once instance of an object is needed throughout the lifetime of an application
 * - can be used for namespacing to reduce number of global variables
 * - object that is used to create namespace and group together a related set of methods and attributes (encapsulation)
 * and if we allow to initiate it then it can be initiated only once
 * i.e. object literal
 * - two parts: object itself containing members (methods and attributes) within it and global variable used to access it
 * so it can be accessed anywhere in the page
 * - only allows for single instantiation but many instances of same object, restricts clients from creating multiple objects, after the first object created,
 * it will return instances of itself
 * - susceptible to race conditions in multi-threaded applications
 */
// Namespacing and prevent accidentally overwriting variable with singleton object
var MyNameSpace = {
  findUserName: function(id) {},
};
var findUserName = $("#user_list"); // do not conflict
console.log(MyNameSpace.findUserName());
// Lazy instantiation for singleton pattern
var MyNameSpace = {};
MyNameSpace.Singleton = (function() {
  // Private attribute that holds single instance in closure
  var singletonInstance;

  function constructor() {
    // Private members
    var privateVar1 = "Alfred";
    var privateVar2 = [1, 2, 3];

    function privateMethod1() {}

    return {
      attribute1: "Alfred",
      publicMethod: function() {
        alert("Alfred");
      },
    };
  }

  return {
    // public method (global access point to Singleton object)
    getInstance: function() {
      // If instance already exists then return
      if (!singletonInstance) {
        singletonInstance = constructor();
      }
      return singletonInstance;
    },
  };
})();
// Getting access of publicMethod
console.log(MyNameSpace.Singleton.getInstance().publicMethod());

// Another Singleton example
var printer = (function() {
  var printerInstance;

  function create() {
    function print() {
      // underlying printer mechanics
    }

    function turnOn() {
      // warm up
      // check for paper
    }

    return {
      // public + private states and behaviors
      print: print,
      turnOn: turnOn,
    };
  }

  return {
    getInstance: function() {
      if (!printerInstance) {
        printerInstance = create();
      }
      return printerInstance;
    },
  };

  function Singleton() {
    if (!printerInstance) {
      printerInstance = intialize();
    }
  }
})();

/*
 * Decorator Pattern
 * - to promote code re-use similar to mixins, alternative to object sub-classing
 * - add behavior (properties/methods) to existing classes in system dynamically, extending functionality
 */
// The constructor to decorate
function MacBook() {
  this.cost = function() {
    return 997;
  };
  this.screenSize = function() {
    return 11.6;
  };
}

// Decorator 1
function memory(macbook) {
  var v = macbook.cost();
  macbook.cost = function() {
    return v + 75;
  };
}

// Decorator 2
function engraving(macbook) {
  var v = macbook.cost();
  macbook.cost = function() {
    return v + 200;
  };
}

// Decorator 3
function insurance(macbook) {
  var v = macbook.cost();
  macbook.cost = function() {
    return v + 250;
  };
}

var mb = new MacBook();
memory(mb);
engraving(mb);
insurance(mb);

// Outputs: 1522
console.log(mb.cost());

// Outputs: 11.6
console.log(mb.screenSize());

/*
 * Facade Pattern
 * - higher-level interface to a larger body of code, hiding its true underlying complexity i.e. jQuery
 * - providing limited abstraction of these methods to public for use
 */
$(".some-selector");
$(".some-class").on("click", function(e) {
  // ...
});

/*
 * Iterator Pattern
 * - implementing hasNext() and next() methods given an array
 */
function makeIterator(array) {
  let nextIndex = 0;
  const len = array.length;

  return {
    next() {
      if (nextIndex < len) {
        const nextVal = { value: array[nextIndex] };
        nextIndex++;
      } else {
        return { value: null };
      }
    },
    hasNext() {
      return nextIndex < len;
    },
  };
}
// Usage:
const arrayNums = [1, 2, 3];
const iter = makeIterator(arrayNums);
while (iter.hasNext()) {
  console.log(iter.next().value);
}

// ES6 iterators have done:true/false
function reverseArrayIterator(array) {
  var index = array.length - 1;
  return {
    next: () =>
      index >= 0 ? { value: array[index--], done: false } : { done: true },
  };
}

// Utilizing Symbol.Iterator
function range(start, end) {
  return {
    [Symbol.iterator]() {
      //#A
      return this;
    },
    next() {
      if (start < end) {
        return { value: start++, done: false }; //#B
      }
      return { done: true, value: end }; //#B
    },
  };
}

for (number of range(1, 5)) {
  console.log(number); //-> 1, 2, 3, 4
}

let iter = ["I", "t", "e", "r", "a", "t", "o", "r"][Symbol.iterator]();
iter.next().value; //-> I
iter.next().value; //-> t

/*
 * Permutations of String
 */
function permut(string) {
  if (string.length < 2) return string; // This is our break condition

  var permutations = []; // This array will hold our permutations

  for (var i = 0; i < string.length; i++) {
    var char = string[i];

    // Cause we don't want any duplicates:
    if (string.indexOf(char) != i)
      // if char was used already
      continue; // skip it this time

    var remainingString =
      string.slice(0, i) + string.slice(i + 1, string.length); //Note: you can concat Strings via '+' in JS

    for (var subPermutation of permut(remainingString))
      permutations.push(char + subPermutation);
  }
  return permutations;
}

/*
 * MergeSort Implementation
 * Time Complexity: O(Nlog(N))
 * Space Complexity: O(N)
 * - better for linked lists, for large data sets stored on external devices and faster speed
 */
var mergeSort = function(source) {
  if (source.length < 2) {
    return source;
  }
  var end = source.length;
  var mid = Math.floor(end / 2);
  // Split array into 2 halves.
  var leftHalf = source.splice(0, mid);
  var rightHalf = source;
  // Merge the 2 sorted halves. And in order to sort the respective halves
  // Call the split functionality recusively untill we have 1 element in the array.
  return merge(mergeSort(leftHalf), mergeSort(rightHalf));
};

var merge = function(leftArr, rightArr) {
  var mergerdArr = [];
  var indL = 0,
    indR = 0;
  // start from 0th position for both the array , and whose 1st elemnet is bigger
  // Push that to new array and increase that index .
  while (indL < leftArr.length || indR < rightArr.length) {
    // typeof leftArr[indL] === ‘undefined’ means lArray has ended and item remains in rArray.
    // So just keep pushing.
    if (!leftArr[indL] || leftArr[indL] > rightArr[indR]) {
      mergerdArr.push(rightArr[indR]);
      indR++;
    } else {
      mergerdArr.push(leftArr[indL]);
      indL++;
    }
  }
  return mergerdArr;
};

/*
 * QuickSort Implementation
 * Time Complexity: O(N^2) worst case for sorted arrays, O(Nlog(N)) best/average case
 * Space Complexity: O(1) in-place
 * - better for arrays, can randomize to avoid sorted worst case
 * - need two pointers to work way toward middle and can be expensive with files because files oriented primarily
 * toward reading in one direction, reading backwards expensive
 */
var swap = function(arr, i, j) {};

var partition = function(arr, low, high) {
  // Use last element as pivot element
  const pivot = arr[high];

  // Index of smaller elements than pivot
  let smallerIndex = low - 1;

  // Traverse from low index up to but not including the pivot element
  // and swap elements if current element is smaller than pivot element
  // Smaller/equal elements will be to left to pivot, greater to right
  for (let j = low; j <= high - 1; j++) {
    if (arr[j] <= pivot) {
      smallerIndex++;
      swap(arr, j, smallerIndex);
    }
  }

  // Move pivot to proper sorted spot
  swap(arr, smallerIndex + 1, high);
  return smallerIndex + 1;
};

var quickSort = function(arr, low, high) {
  while (low < high) {
    // pi is the proper partition index in which arr[pi] is in proper sorted place
    const pi = partition(arr, low, high);

    // Partition left
    quickSort(arr, low, pi - 1);
    // Partition right
    quickSort(arr, pi + 1, high);
  }
};

/*
 * Implementing getElementByID
 */
function getById(id, parent, list) {
  parent = parent || document.body;
  list = list || [];

  var l,
    child,
    children = parent.children;
  if (children) {
    l = children.length;
    while (l--) {
      child = children[l];
      if (child.id === id) {
        list.push(child);
      }
      getById(id, child, list);
    }
  }

  return list;
}

/*
 * Finding K-th Max/Min in an array using QuickSelect
 * - similar to quick sort algorithm but only finding kth pivot
 * - O(N^2) solution is easy but we want to find O(Nlog(N)) worst case
 * - given unsorted array
 */
const source = [9, 2, 7, 11, 1, 3, 14, 22];

const swap = function(arr, i, j) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

let kthMax = function(arr, low, high, k) {
  // greaterIndex stores index of elements greater than pivot element
  let greaterIndex = low;
  if (low >= high) {
    return arr[greaterIndex];
  }

  const pivot = arr[high];
  for (let i = low; i < high; i++) {
    // If an element is greater than chosen pivot (i.e. last element)
    // Swap it with greaterIndex element and increment greaterIndex pointer
    // All elements greater than pivot will be to left, all elements smaller than or equal
    // to the pivot element will be on the right
    if (arr[i] > pivot) {
      swap(arr, greaterIndex, i);
      greaterIndex++;
    }
  }

  // We have found the sorted position for pivot element
  // Swap it to that position place
  swap(arr, greaterIndex, high);

  // Only try to sort the part in which kth index lies
  if (k === greaterIndex) {
    return arr[greaterIndex];
  } else if (greaterIndex > k) {
    // Check left side since there are more than k elements greater than pivot
    return kthMax(arr, low, greaterIndex - 1, k);
  } else {
    // Check right side since there are less than k elements greater than pivot
    return kthMax(arr, greaterIndex + 1, high, k);
  }
};

// 2 => 3rd max which is 11
console.log(kthMax(0, source.length - 1, 2));
