/*
 * Node.js Notes
 * - two core modules for managing module dependencies
 * 1. require module: available on global scope -> command
 * 2. module: available on global scope -> organizer of all required modules
 */
// Main object exported by require module is a function
// - goes through the following steps
// 1. Resolving: finding absolute path of file
// 2. Loading: determine the type of file content
// 3. Wrapping: give file its private scope so require and module objects local to every file we require
// 4. Evaluating: what VM does with loaded code
// 5. Caching: when we require the file again, we don't go over all the steps another time
// - every module object gets id property to identify it like full path to file
// -> one-to-one relation with files on filesystem
// -> we require a module by loading the content of a file into memory
// -> module.paths list to check; list of node_module directories under every directory from current directory to root directory
// so be careful as if you remove the dependency on current node project and it exists anywhere below it will access that one instead
const config = require('/path/to/file');

// if you want to only resolve the module and not execute it, you can use require.resolve function
// -> doesn't load the file but will throw an error if file does not exist and it will return full path to file when found
// -> can be used to check whether an optional package is installed or not and only use it when it's available
require.resolve('find-me');

// can require modules with relative paths (./ and ../) or absolute paths starting with /
require('./lib/find-me');

// circular modular dependency is allowed in Node so be careful about that
// -> if circular dependency, we get all properties exported prioer to circular dependency
// exports is a special object that is managed in each file's module object; exposed properties
// -> can make it into any object like a function
// -> module.exports object in every module is what the require function returns when we require that module
exports.id = 'index';
const sampleModuleObj = {
  id: '.',
  exports: { id: 'index' },
  // loaded attribute tracks which modules have been loaded (true value) and which modules are still being loaded (false)
  loaded: false,
  children: [],
  paths: []
};

module.exports = function() {};

const UTIL = require('./lib/util');
console.log('UTIL:', UTIL); // UTIL : { id: 'lib/util' }

// entire process of requiring/loading a module is synchronous - can see modules fully loaded after one cycle of event loop
// -> cannot change exports object asynchronously
// - can nativelyrequire JSON files and C++ addon files with require function and don't need to specify file extension
// -> resolves .js, .json, .node binary
// -> JSON for static configuration values or some values that you periodically read from an external source
// config.json
// -> node-gyp package to compile and build .cc file into a .addon file, need to conigure binding.gyp
// -> check out require.extensions: module._compile for .js files, JSON.parse for .json files, process.dlopen for .node files
const config = {
  "host": "localhost",
  "port": 8080
};

const { host, port } = require('./config');
console.log(`Server will run at http://${host}:${port}`);

const addon = require('./addon-cpp');
console.log(addon.hello());

// all code you write in Node will be wrapped in functions
// exports object to export properties but we cannot replace it directly because it's just a reference to module.exports
// -> before compiling a module, Node wraps the module code in a function which we can inspect using wrapper property of module
require('module').wrapper
// Keeps top level variables that are defined in any module scoped to that module
// -> exports = reference to module.exports, require and module specific to function to be executed, __filename/__dirname contain the wrapped module's absolute
// filename and directory path
// -> can access that function's arguments with the arguments keyword
(function(exports, require, module, __filename, __dirname) {})();

// require: object that acts mainly as function that takes module name or path and returns th emodule.exports object
// - require.main to determine if script is being required or run directly; require.main === module
// - all modules will be cached
// -> node caches the first call and does not load the file again on second call
// -> observe require.cache; registry is an object that has a property for every required module; can delete a property to invalidate cache and Node will re-load module to 
// re-cache it
function wrapper(require, module, __filename, __dirname) {
  let exports = module.exports;

  // Your code...

  return module.exports;
}
// Can mock out the require
require = function() {
  return { mocked: true };
};

