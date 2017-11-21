// These are notes for the textbook JavaScript Patterns by Stoyan Stefanov

/* Chapter 1: Introduction */
// - Two types of objects 
// 1. Native - described in the ECMAScript Standard like built-in Array, Date or user-defined
// 2. Host - defined by host environment like window and all DOM objects
// - From Gang of Four: "Prefer object composition to class inheritance." 
// -> Translation: Create objects out of available pieces rather than
// creating long parent-child inheritance chains and classifications (no classes in JS)

/* Chapter 2: Essentials */
// - Maintainable code means that it is
// -> readable, consistent, predictable, looks as if it was written by the same person, and is documented
// - JS uses functions to manage scope, those variables declared outside of any function becomes attached
// to the global object when you use "this" i.e. window
// - avoid globals: naming collisions, shared among all code in JS application or web page, implied globals
// in which any variable you don't declare becomes a property of the global object
// -> avoid chaining assignments as part of a var declaration
// -> globals created with var cannot be deleted vs. implied globals without var can be deleted
// - use single var pattern at top of your functions to provide single place to look for all the local variables
// -> prevents logical errors like when variable is used before defined with hoisting
// -> declare variables and minimize globals, less code
function singleVarPattern() {
  var a = 1,
      b = 2,
      sum = a + b;
  
  // ... function logic below ...
}

// - hoisting: there are two stages of code handling where variables, function declarations, and formal parameters
// are created at the first stage, which is the stage of parsing and entering the context
// -> in the second stage, the stage of runtime code execution, function expressions and unqualified identifiers
// (undeclared variables) are created
// -> lesson: just declare everything at the top/define before using so you don't ever have to worry about it
function hoistingExample() {
  alert(someText); // "undefined"
  var someText = "localText";
  alert(someText); // "localText"
}

// - for loops: caching the length of the array for HTMLCollections like for document.getElementsByName(),
// document.getElementsByClassName(), document.getElementsByTagName() for speedup
// -> problems with collections: live queries against the underlying document; you're querying the live DOM
// each time accessing the length and DOM operations can be expensive
// - for-in loops: to iterate over nonarray objects (enumeration)
// -> important to use hasOwnProperty() when iterating over object properties to filter out properties that come
// down the prototype chain
var obj = {
  propOne: "Sample prop one",
  propTwo: "Sample prop two"
};

for (var prop in obj) {
  if (obj.hasOwnProperty(prop)) {
    console.log(prop, ": ", obj[prop]);
  }
}
// one can also use Object.prototype.hasOwnProperty to avoid naming collisions in case "obj" redefines hasOwnProperty
var hasOwn = Object.prototype.hasOwnProperty;
for (var prop in obj) {
  if (hasOwn.call(obj, prop)) {
    console.log(prop, ": ", obj[prop]);
  }
}
// - avoid eval(), implied typecasting with ==, using ===
// - specify radix parameter with parseInt() to avoid inconsistency and unexpected results
// - beware semicolon insertion mechanism - JS may add a semicolon at end of line like in this case
function semicolonInsertionMechanismExample() {
  // Unexpected return value here, returns undefined; instead
  return
  {
   cannotReachHere: "Not returned" 
  };
}
// - use eslint to catch syntax mistakes/code style issues or prettier for code formatting
// - JSDoc documentation comments
/**
 * Reverse a string
 * 
 * @param {String} input String to reverse
 * @return {String} the reversed string
 */
var reverse = function(input) {
  // ...
  return output;
};
// - minification is the process of eliminating white space, comments, and  other nonessential
// parts of the JavaScript code to decrease the size of the files that need to be transferred
// from server to browser

/* Chapter 3: Literals and Constructors */
// - objects mutable hashes at any time, properties and methods (key-value pairs)
// - object literal notation for on-demand object creation, simplest {} has properties and methods inherited
// from Object.prototype
var objectLiteral = {
  propOne: "Some prop one"
};
// - custom constructor functions undergo the following when invoked with new
// -> empty object created and referenced by this variable, inheriting the prototype of the function
// -> properties and methods added to object referenced by this
// -> newly created object referenced by this is returned at the end implicitly (if no other object returned explicitly)
var Pokemon = function(name) {
  // Creating a new object with Pokemon's protoype inherited
  var this = Object.create(Pokemon.prototype);

  // Add properties and methods
  this.name = name;
  this.say = function() {
    return "I am " + this.name;
  };

  // return this;
}

