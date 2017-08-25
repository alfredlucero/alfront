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
// npm install --save-dev webpack
// Why do we use build tools? server side templating (backend server creates an HTML document and sends to user)
// and single page apps (server sends a bare-bones HTML doc to the user and JS runs on user machine to assemble a full webpage)
// Why webpack? load and execution order with multiple js files, performance in bundling many Javascript files/modules into one bundle.js (less HTTP requests)
// - Link up JS modules together
// Module Systems:
// 1. CommonJS (npm) -> module.exports, require
// 2. AMD -> define, require
// 3. ES2015 -> export, import

// CommonJS 
const sum = (a, b) => a + b;
module.exports = sum;
// In another file
const sumModule = require('./sum');

// ES2015 Modules
export default sum;
// In another file
import sumModule from './sum';

// webpack.config.js
const path = require('path');

const config = {
  // Entry file for the application
  // Starting point from which it starts to look at all requires
  entry: './src/index.js',
  // Where to save the bundle to and what to name it
  output: {
    // Need absolute file path
    // __dirname refers to current working directory, places bundle.js to build folder
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  }
};

module.exports = config;

// Simplified representation of what happens to bundle.js
// Puts an array of function dependencies and starts an entry point function
var myModules = [
  function() {
    const sum = (a, b) => a + b;
    return sum;
  },
  function() {
    const sum = myModules[0]();
    const total = sum(10, 10);
    console.log(total);
  }
];

var entryPointIndex = 1;
myModules[entryPointIndex]();

// Introduction to Loaders
// - libraries that can run on our project files, preprocessing
// - modules/rules in webpack config
// Using babel to transpile ES2015 code to ES5
// npm install --save-dev babel-loader babel-core babel-preset-env
// - need babel-loader: teaches babel how to work with webpack
// - babel-core: takes code in, parses it, and generates some output files
// - babel-preset-env: ruleset for telling babel exactly what pieces of ES2015/16/17 to look for
// and how to turn it into ES5 code
// css-loader: knows how to deal with CSS imports; style-loader: takes CSS imports and adds them to HTML document
// -> inject into style tag of HTML document
// image-webpack-loader: resizes/compresses image; url-loader: if image small, includes image in bundle.js as raw data
// or if big, includes the raw image in the output directory

// Setting up babel
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: 'build/'
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        // Regex to check file extensions like ending in .js
        // Files that pass the test will be affected by the babel-loader
        test: /\.js$/
      },
      // { 
      //   // Order matters - applied series of loaders from right to left
      //   use: ['style-loader', 'css-loader'],
      //   test: /\.css$/
      // }
      {
        // Extracts css out and places into build/styles.css
        loader: ExtractTextPlugin.extract({
          loader: 'css-loader'
        }),
        test: /\.css$/
      },
      { 
        // Compresses and handles how image is included
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          { 
            // URL loader emits the URL of the file with 'output.publicPath' prepended to the URL
            loader: 'url-loader',
            options: { limit: 40000 }
          },
          'image-webpack-loader'
        ]
      }
    ]
  }, 
  plugins: [
    new ExtractTextPlugin('style.css')
  ]
};

module.exports = config;

// .babelrc to set the presets with babel-preset-env
{
  "presets": ["babel-preset-env"]
}

// Introduction to Code Splitting
// Lets you split up bundle.js output into several different files and can load up different code when you want
// i.e. only load minimum amount of JS necessary to show a view and then when it goes to another route, load the rest
// System.import for on demand code loading/splitting into different bundle.js
const button = document.createElement('button');
button.innerText = 'Click to see image';
button.onclick(() => {
  // Loads only one module of the image on click of button
  System.import('./image_viewer').then(module => {
    // Calls export default function from imported module
    module.default();
  });
});

document.body.appendChild(button);

// Sample webpack.config.js for a React project:
// Set up with babel, css/style-loaders
// Can code split our code and the vendor code such as lodash/react/redux
// and exploit vendor caching to not download vendor code everytime you visit since vendor changes infrequently
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const VENDOR_LIBS = [
  'react', 'lodash', 'redux', 'react-redux', 'react-dom',
  'faker', 'react-input-range', 'redux-form', 'redux-thunk'
];

module.exports = {
  // By passing in an object to entry, we have multiple entry points to application
  entry: {
    bundle: './src/index.js',
    // Produces a separate bundle file for vendor dependencies that change infrequently in vendor.js file
    vendor: VENDOR_LIBS
  }
  output: {
    path: path.join(__dirname, 'dist'),
    // Saves output of bundle as [entryKeyName].js
    // [chunkhash] helps to uniquely identify each file that is generated (hash of contents of file)
    // and if file name different, browser will download updated file
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        // Exclude ES5 node modules
        exclude: /node_modules/
      },
      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/
      }
    ]
  },
  plugins: {
    // May have duplicate includes of dependencies in both bundle and vendor so we need CommonChunksPlugins
    // To look at total sum of project files and helps to pull out duplicates into vendor.js only
    // Hopefully user can cache the vendor file that doesn't change much
    // Manifest is to better tell browser whether or not vendor file changed or not
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    // Generates an HTML document with script tags inside for every js file generated by webpack (bundle/vendor)
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    // Looks for window scoped environment variable i.e. NODE_ENV=production, webpack -p (minifies JS code for production)
    // "build": "NODE_ENV=production npm run clean && webpack -p"
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  }
};

// .babelrc
{
  "presets": ["babel-preset-env", "react"]
}

// Need to clear all the generated bundle/vendor/manifest files
// so need rimraf node_module -> rimraf dist
// npm install --save-dev rimraf webpack-dev-server
// webpack-dev-server -> act as intermediary between browser and webpack output, development server
// - need to also integrate node api server as well to handle backend data stuff, doesn't save output files to your local
// but rather saves in memory when you go to localhost
// - start up one time and watches all project files and rebuilds whenever any changes occur
// and it only updates the individual project files that changed (not the whole thing for performance)

// React router and code splitting (probably only add splitting if many routes)
// - Say a separate file for showing route/base routes of application and then dynamically load the rest of the components
// when the user navigates around
// Plain routes with React Router Code Splitting
const componentRoutes = {
  component: Home,
  path: '/',
  indexRoute: { component: ArtistMain },
  childRoutes: [
    {
      path: 'artists/new',
      getComponent(location, cb) {
        System.import('./components/artists/ArtistCreate')
          .then(module => cb(null, module.default));
      }
    },
    {
      path: 'artists/:id',
      getComponent(location, cb) {
        System.import('./components/artists/ArtistDetail')
          .then(module => cb(null, module.default));
      }
    },
    {
      path: 'artists/:id/edit',
      getComponent(location, cb) {
        System.import('./components/artists/ArtistEdit')
          .then(module => cb(null, module.default));
      }
    }
  ]
};
// <Route path="/" component={Home}>
//      <IndexRoute component={ArtistMain}/>
//      <Route path="artists/new" component={ArtistCreate}/>
//      <Route path="artists/:id" component={ArtistDetail}/>
//      <Route path="artists/:id/edit" component={ArtistEdit}/>
//    </Route>
//  </Router> 
// const Routes = () => {
//   return (
//     <Router history={hashHistory} routes={componentRoutes} />
//   );
// };

// Static asset providers: Github Pages (gh-page branch), Amazon S3 (s3-website), Digital Ocean, MS Azure, surge, Gatsby
// for surge.sh: npm install -g surge, npm run build, surge -p dist
// Server-based providers: Amazon EC2, Amazon ELB, Digital Ocean, Heroku, MS Azure
// AWS Elastic Beanstalk -> may scale up to more servers and load balancing
// Using express node server and webpack middlewares in development environment
// npm install --save-dev webpack-dev-middleware
const express = require('express');
const path = require('path');

const app = express();

// Server routes...
app.get('/hello', (req, res) => res.send({ hi: 'there' }));

// Only use webpack in development because it takes up a lot of resources you'll need in prod
if (process.env.NODE_ENV !== 'production') {
  const webpackMiddleware = require('webpack-dev-middleware'); // middleware to intercept requests looking for prod assets
  const webpack = require('webpack'); // Compile all application assets
  const webpackConfig = require('./webpack.config.js');

  app.use(webpackMiddleware(webpack(webpackConfig)));
} else {
  // Gives access to dist directory
  app.use(express.static('dist'));

  // For browser history module of react router and makes sure it works correctly
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

app.listen(process.env.PORT || 3050, () => console.log('Listening'));
