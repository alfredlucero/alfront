// Webpack:
// - Polyfill.io detects which features you need to polyfill for browser
// - Code splitting with Webpack - CommonChunks, import.then
// - Content hashing to improve performance with caching, only get the changed files/vendors
// - Module Bundler: asynchronously loads modules and runs them when they finished loading or 
// combines all of the necessary files into a single JS file that would be loaded via <script> tag in the HTML
// - Why Webpack? plugin system, bundling with config files, large community
// - npm install webpack -D to save as development dependency
// i.e. "scripts": { "build": "webpack src/main.js dist/bundle.js" } -> takes input and output

// Can create webpack.config.js and run webpack
module.exports = {
  entry: './src/main.js',
  output: {
    path: './dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      // holds config for each loader you use
      // need to set a minimum of test (regex to test for file's extension like /\.jsx?$/)
      // and loader which sets the loader to use on files that pass the test
      {
        test: /\.jsx?$/,
        loader: 'babel-loader', // Can also do this in .babelrc
        exclude: /node_modules/,
        options: {
          plugins: ['transform-runtime'],
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new HtmlwebpackPlugin()
  ]
};

// Loaders to apply transformation or perform operations on files of a given type
// - Can chain multiple loaders together to handle a single file type
// i.e. passing all .js files through ESLint and transpile from ES2015 to ES5 by Babel
// - tree-shaking: eliminates unused portions of modules
// i.e. rules: [ { test: /\.hbs$/, loader: 'handlebars-loader' }]

// Plugins to install custom functionality into webpack, can be injected anywhere
// i.e. plugins: [ new HtmlwebpackPlugin({ title: 'Intro to webpack', template: 'src/index.html'}) ]
// i.e. adding JS minification via a plugin, UglifyJS

// Lazy-loading chunks: through CommonJS or AMD
// Require.ensure makes sure the module is available but not execute it and pass in an array of module names and 
// then a callback; you'll need to require it using the argument passed to your callback
// CommonJS way
require.ensure(["module-a", "module-b"], function(require) {
  var a = require("module-a");
  var b = require("module-b");
  // ...
});
// AMD way
require(["module-a", "module-b"], function(a, b) {
  // ...
});
// Also supports System.import which uses promises rather than callbacks; also import()
import { map } from 'lodash';

let numbers = map([1,2,3,4,5,6], n => n*n);

setTimeout(() => {
  require(['./numberlist.hbs'], template => {
    document.getElementById('app-container').innerHTML = template({numbers});
  })
}, 2000);

// Vendor chunks: define a separate bundle that will store "common" or third-party code that is unlikely to change
// Visitors can cache your libraries in a separate file from your application code, so that the libraries won't need 
// to be downloaded again when you update the application 
// CommonsChunkPlugin
entry: {
  vendor: ['babel-polyfill', 'lodash'], // Include in vendor common chunks
  main: './src/main.js'
}
...
plugins: [
  new UglifyJsPlugin({
    beautify: false,
    mangle: { screw_ie8: true },
    compress: { screw_ie8: true, warnings: false },
    comments: false
  }),
  new CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.bundle.js' // Places all vendor dependencies into this file
  })
]

// Webpack 2:
// Why is do we use build tools? server side templating (backend server creates an HTML document and sends to user)
// and single page apps (server sends a bare-bones HTML doc to the user and JS runs on user machine to assemble a full webpage)
// Why webpack? load and execution order with multiple js files, performance in bundling many Javascript files/modules into one bundle.js (less HTTP requests)
// Module Systems:
// 1. CommonJS (npm) -> module.exports, require
// 2. AMD -> define, require
// 3. ES2015 -> export, import
