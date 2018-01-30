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


// Webpack Documentation Notes v3.10.0
// - used to compile JavaScript modules
// - npm install --save-dev webpack
// - "source" code we write and edit, "distribution" code minimized and optimized output of build processes
// that will eventually be loaded in the browser
// - can build dependency graph to generate optimized bundle.js where scripts executed in correct order
// - webpack "transpiles" code so older browsers can run ES2015 import/export
// - supports a config file like webpack.config.js to specify loader rules, plugins, resolve options, etc.
// - custom parameters can be passed to webpack by adding two dashes between the npm run build command and your parameters
// like npm run build -- --colors

// Asset Management
// - dynamically bundle all dependencies, can include any other type of file besides JavaScript for which there is a loader
// <script src="./bundle.js"></script>
// i.e. style-loader and css-loader
module: {
  rules: [
    {
      // Uses regex to determine files ending with .css
      // so you can import './style.css' into file and it will be injected into head tag
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    },
    // i.e. loading images with file-loader so you can do import MyImage from './my-image.png'
    // and added to output directory and MyImage contains final url of that image after processing
    // html-loader handles <img src="./my-image.png" />
    // - can minify and optimize images with image-webpack-loader and url-loader
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        'file-loader'
      ]
    },
    // i.e. loading fonts that you can use via @font-face url declaration and font-family
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        'file-loader'
      ]
    },
    // i.e. loading data like JSON (already built-in by default), CSV, TSV, XML with csv-loader and xml-loader
    {
      test: /\.(csv|tsv)$/,
      use: [
        'csv-loader'
      ]
    },
    {
      // Can do import Data from './data.xml' and console log the JSON
      test: /\.xml$/,
      use: [
        'xml-loader'
      ]
    }
  ]
}
// - instead of relying on global /assets directory, you can group assets with the code that uses them as long as 
// external dependencies and configuration has same loaders defined
// -> if you have some assets shared between multiple components, it is still possible to store assets in base directory
// and use aliasing to make them easier to import

// Output Management
// - html-webpack-plugin to handle multiple entry points and using hashes in filenames
// - webpack uses a manifest to keep track of how all the modules map to the output bundle which you can extract into a JSON
// file with WebpackManifestPlugin
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js',
    print: './src/print.js'
  },
  plugins: [
    // since Webpack will generate files and put them in /dist folder for you, it doesn't keep track of which files
    // are actually in use by your project, so you can clean the /dist folder before each build so only used files generated
    new CleanWebpackPlugin(['dist']),
    // by default generates its own index.html file and replaces old one
    new HtmlWebpackPlugin({
      title: 'Output Management'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}

// Development
// - after bundling, could be difficult to track down errors and warnings to their original locations so you can
// use source map which maps compiled code back to your original source code
// i.e. can use inline-source-map with devtool (not for production) - devtool: 'inline-source-map'
// - hassle to manually run npm run build every time you want to compile code so you can use webpack's Watch Mode,
// webpack-dev-server (usually use this) or webpack-dev-middleware
// -> watch mode to "watch" all files within your dependency graph for changes and if one of files updated, the code 
// will be recompiled so you don't have to run the full build manually
// i.e. add a script like "watch": "webpack --watch" but you need to refresh your browser to see changes
// -> webpack-dev-server provides simple web server and ability to use live reloading
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js',
    print: './src/print.js'
  },
  devtool: 'inline-source-map',
  // webpack-dev-server serves files from dist directory on localhost:8080
  // can add script to package.json like "start": "webpack-dev-server --open"
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Development'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
// -> webpack-dev-middleware is wrapper that will emit files processed by webpack to a server
// and can set publicPath: '/'

// Hot Module Replacement
// - allows all kinds of modules to be updated at runtime without the need for a full refresh
// and is not intended for production
// i.e. can also do webpack-dev-server --hotOnly
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Hot Module Replacement'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
// - via the Node.js API you don't put the dev server options on webpack config object but pass them as
// second parameter upon creation
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const config = require('./webpack.config.js');
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost'
};

webpackDevServer.addDevServerEntryPoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(5000, 'localhost', () => {
  console.log('dev server listening on port 5000');
});
// - may need to update bindings by using module.hot.accept
// - HMR with CSS is straightforward with style-loader
// - can look into React Hot Loader or Redux HMR

// Tree Shaking
// - used in JS context for dead-code elimination, relies on static structure of ES2015 module syntax like import/export
// and if certain functions are unused we see comments like /* unused harmoney export square */
// - use UglifyJSPlugin to support dead code removal like new UglifyJSPlugin() or --optimize-minimize
// - can yield a significant decrease in bundle size when working on larger applications with complex dependency trees

// Production
// - for dev we want strong source mapping and localhost server with live reloading or hot module replacement
// - for prod we focus on minified bundles, ligher weight source maps, optimized assets to improve load time
// - recommend writing separate webpack configurations for each environment
// -> can use common config to keep things DRY and use webpack-merge i.e. webpack.common/dev/prod.js
// i.e. webpack.common.js
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Production'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
// i.e. webpack.dev.js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  }
});
// i.e. webpack.prod.js
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  plugins: [
    new UglifyJSPlugin()
  ]
});
// i.e. npm scripts 
// "scripts": {
//   "start": "webpack-dev-server --open --config webpack.dev.js",
//   "build": "webpack --config webpack.prod.js"
// }
// - minification with BabelMinifyWebpackPlugin, ClosureCompilerPlugin
// - use devtool: 'source-map' in production and new UglifyJSPlugin({ sourceMap: true });
// - can use DefinePlugin to specify the environment like new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') })
// - often best practice to split your CSS out to separate file using ExtractTextPlugin and using disable opetin with --env flag to allow
// inline loading in development to help with HMR and build speed

// Code Splitting
// - allows you to split code into various bundles which can then be loaded on demand or in parallel
// to achieve smaller bundles and control resource load prioritization which if used correctly can have major impact on load time
// -> can use entry points to manually split code using entry configuration
// --> but may have downside of duplicated modules between entry chunks in both bundles, not as flexible and can't be used to dynamically split code with core
// app logic
// -> prevent duplication by using CommonsChunkPlugin to dedupe and split chunks
// --> extracts common dependencies into an existing entry chunk or an entirely new chunk
// like new webpack.optimize.CommonsChunkPlugin({ name: 'common' })
// --> can use ExtractTextPlugin to split CSS out from main app, bundle-loader to split code and lazy load resulting bundles, promise-loader
// that is similar to bundle-loader but uses promises
// --> CommonsChunkPlugin also used to split vendor modules from core app code using explicit vendor chunks
new webpack.optimize.CommonsChunkPlugin({
  name: "vendor",
  minChunks: function(module) {
    // Automagically pulls all js from node_modules into the vendor bundle
    return module.context && module.context.indexOf("node_modules") !== -1;
  },
})
// -> dynamic imports to split code via inline function calls within modules
// --> import() syntax uses promises internally (for older browsers need es6-promise or promise-polyfill)
// - bundle analysis with webpack-chart, webpack-visualizer, webpack-bundle-analyzer

// Lazy Loading
// - "on demand" loading to optimize site/app, splitting your code at logical breakpoints and then loading it once
// the user has done something that requires or will require a new block of code which speeds up the initial load of the application and lightens its overall weight 
// as some blocks may never even be loaded
button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
  // when using import() on ES6 modules you must reference default property as it is the actual module object returned when promise resolved
  var print = module.default;

  print();
});

// Caching
// - once contents of /dist deployed to server, clients typically browsers hit that server to grab the site and its assets
// - caching allows sites to load faster with less unnecessary network traffic
// - simple way to ensure browser picks up changed files is by using output.filename substitutions
// -> [hash] substitution can be used to include a build-specific hash in filename though one can use [chunkhash]
// i.e. filename: '[name].[chunkhash].js' so bundle's name reflects its content via the hash
// - CommonsChunkPlugin to split modules out into separate bundles and extracting webpack's boilerplate and manifest which can change with every build
// i.e. extracting third-party libraries into separate vendor chunk and taking out manifest
module.exports = {
  entry: {
    main: './src/index.js',
    vendor: [
      'lodash'
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Caching'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    })
  ],
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  }
};
// -> may get new hashes because module.id changed or got reference to a new module or content changed
// -> can use NamedModulesPlugin which will use path to module rather than numerical identifier or HashedModuleIdsPlugin for prod

// Authoring Libraries
// - can also be used to bundle JS libraries so you can access as ES2015 module (import), CommonJS module (require), global variable when
// included through script tag
var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack-numbers.js',
    library: 'webpackNumbers', // to make it compatible in different environments use libraryTarget property
    libraryTarget: 'umd' // can be exposed as global variable, this object, window object in browser, AMD or CommonJS - UMD
  },
  // Since we expect lodash to be brought in as peerDependency and consumer should already have lodash installed
  // and you give up control of external library to consumer of your library
  // - externals means we expect lodash to be available in consumer's environment
  externals: {
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash', 
      root: '_'
    }
  }
};

// Shimming
// - webpack compiler can understand modules written in ES2015, CommonJS, or AMD modules
// - some third party libraries may expect global dependencies like $ and create globals that need to be exportred
// and shimming can help with that or when you want to polyfill browser functionality to support more users
// - shimming globals with ProvidePlugin which makes a package available as a variable in every module compiled through webpack
// i.e. using ProvidePlugin for globals
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: { 
    index: './src/index.js',
    // can do import 'babel-polyfill' in the main bundle but not recommended because penalizes modern browsers users by making them
    // download a bigger file with unneeded scripts
    polyfills: './src/polyfills.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        // granular shimming as some legacy modules rely on this being the window object
        // but there is problem when module is executed in CommonJS context where this is equal to module.exports so you need
        // the imports-loader
        test: require.resolve('index.js'),
        use: 'imports-loader?this=>window'
      },
      {
        // for global exports, we can use exports-loader to export that global variable as a normal module export
        // so now we can do import { file, parse } from './globals'
        test: require.resolve('globals.js'),
        use: 'exports-loader?file,parse=helpers.parse'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      // if you encounter at least one instance of the variable lodash, include lodash package and provide it to the modules that need it
      _: 'lodash',
      // can use "array path" to expose only a single export of a module
      join: ['lodash', 'join']
    })
  ]
};
// Sample conditional loading of polyfills
var modernBrowser = (
  'fetch' in window &&
  'assign' in Object
);

if (!modernBrowser) {
  var scriptElement = document.createElement('script');
  scriptElement.async = false;
  scriptElement.src = '/polyfills.bundle.js';
  document.head.appendChild(scriptElement);
}
// - babel-preset-env package uses browserslist to transpile only what is not supported in your browsers matrix
// and comes with useBuiltIns option false by default which converts your global babel-polyfill import to a more granular feature by feature import pattern
// - node built-ins like process can be polyfilled directly from your config file without the use of any special loaders or plugins
// - script-loader evaluates code in the global context similar to inclusion via a script tag; every normal library should work but require, module, etc. are undefined
// but it is not minimized by webpack and no devtool

// TypeScript
// - typed superset of JS that compiles to plain JS
// - typescript, ts-loader, tsconfig.json, need to add "sourceMap": true and devtool: 'inline-source-map'
// - when installing third party libraries form npm we need the type definition like at TypeSearch i.e. @types/lodash
// - may degrade build performance
// - when importing other assets that are non-code, we need to defer the type for these imports
declare module "*.svg" {
  const content: any;
  export default content;
}

// Progressive Web Applications
// - web apps that deliver an experience similar to native applications like functioning when offline through use of Service Workers
// - typically a real user accesses a web app over a network and browser talks to a server which will serve up the required assets (.html/js/css files)
// - using http-server package, workbox-webpack-plugin to encourage ServiceWorkers to get in there fast and not allow any straggling old SWs to hang around
// and we see sw.js and precache-manifest.js
// i.e. registering the Service Worker (to test, stop your server and refresh your page and if browser supports SWs then we should still see app as served by SW not the server)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    })
  })
}

// Migrating versions (from 1 to 2)
// - resolve.root, resolve.fallback, resolve.modulesDirectories replaced by resolve.modules
// - resolve.extensions, resolve.*; module.laoders is now module.rules; can chain loaders in array of loaders
// - json-loader not required, loaders in config resolve relative to context
// - see more changes here: https://webpack.js.org/guides/migrating/

// Environment Variables
// - to disambiguate between dev and prod builds, using --env to pass in as many environment variables as you like
// and accessible in webpack.config.js
// webpack --env.NODE_ENV=local --env.production --progress
// - to use the env variable you must convert module.exports to a function
module.exports = env => {
  // Use env.<YOUR VARIABLE> here:
  console.log('NODE_ENV: ', env.NODE_ENV) // 'local'
  console.log('Production: ', env.production) // true;

  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
};

// Build Performance
// - use the latest webpack version as more performance improvements made, latest is 3.10.0 and up to date with Node.js/npm
// - apply loaders to minimal number of modules necessary by using include field to only apppy loader modules that actually need to be transformed by it
{
  test: /\.js$/,
  include: path.resolve(__dirname, "src"),
  loader: "babel-loader"
}
// - each additional loader/plugin has a bootup time so use as few different tools as possible
// - increase the speed of resolving by minimizing the number of items in resolve.modules/extensions/mainFiles/descriptionFiles as they
// increase the number of filesystem calls
// -> set resolve.symlinks to false if you don't use symlinks like npm/yarn link
// -> resolve.cacheWithContext: false if you use custom resolving plugins that are not context specific
// - use DllPlugin to move code that is changed less often into a separate compilation to improve app's compilation speed though it increases build process complexity
// - smaller = faster: decrease total size of compilation to increase build performance and keep chunks small
// -> use fewer/smaller libraries, use CommonsChunksPlugin in muti-page apps/in async mode, remove unused code, only compile part of code you are currently developing on
// - thread-loader to offload expensive loaders to a worker pool (but there is boot overhead for Node.js runtime and loader, minimize module transfers between worker and main process,
// as IPC is expensive)
// - persistent caching with cache-loader, clear cache directory on "postinstall" in package.json
// - profile custom plugins/loaders to not introduce performance problem
// - incremental builds: use webpack's watch mode, keeps track of timestamps and passes information to compilation for cache invalidation and in
// some setups it falls back to polling mode and may cause a lot of CPU load, watchOptions.poll
// - compiling and serving assets in memory rather than writing to disk (webpack-dev-server, webpack-hot-middleware, webpack-dev-middleware)
// - devtool: "eval" has best performance but doesn't assist you for transpiled code, cheap-source-map variants more performant with slightly worse mapping quality
// and eval-source-map for incremental builds, most cases cheap-module-eval-source-map is best option
// - avoid production specific tooling when in development like UglifyJSPlugin, ExtractTextPlugin, [hash] / [chunkhash], AggressiveSplittingPlugin, AggressiveMergingPlugin, ModuleConcatenationPlugin
// - minimal entry chunk: webpack only emits updated chunks to the filesystem and for some config options like HMR, [name/chunkhash] in output.chunkFilename, [hash] the entry chunk
// is invalidated in addition to changed chunks
// -> make sure entry chunk is cheap to emit by keeping it small like a chunk containing only runtime with all other chunks as children
// - multiple compilations: parallel-webpack (in worker pool), cache-loader (shared between multiple compilations)
// - source maps expensive for prod so probably don't need them
// - babel: minimize number of preset/plugins
// - typescript: use fork-ts-checker-webpack-plugin for type checking in separate process, configure loaders to skip typechecking, use ts-loader in happyPackMode: true / transpileOnly: true for prod
// - node-sass has bug which blocks threads from Node.js threadpool, when using with thread-loader set workerParallelJobs: 2

// Dependency Management
// - context created if your request contains expressions so the exact module is not known on compile time
require("./template/" + name + ".ejs"); // parses require call and extracts information like directory and regex
// -> context module generated and contains references to all modules in that directory that can be required with a request matching the regex, contains map which translates requests to module ids
// -> dynamic requires supported but will cause all possible modules to be included in bundle
// - can create our own context with require.context(): allows you to pass in directory to search, a flag indicating whether subdirectories should be searched too, and regex to match files against
require.context(directory, useSubdirectories = false, regExp = /^\.\//)
// - context module API, exports a require function that takes one argument: the request
// -> exported function with 3 properties: resolve, keys, id
// -> resolve is function that returns the module id of parsed request
// -> keys is function that returns an array of all possible requests that context module can handle
var cache = {};
function importAll(r) {
  r.keys().forEach(r);
}
importAll(require.context('../components', true, /\.js$/));

// Public Path
// - publicPath config option to specify base path for all assets within your application
// -> every file emitted to output.path directory will be referenced from output.publicPath location that includes child chunks (created via code splitting) and any other assets that are part of dep graph
// - i.e. hosting static assets on CDN in prod but have assets folder for dev
// -> use environment variable like ASSET_PATH
import webpack from 'webpack';

// Try the environment variable, otherwise use root
const ASSET_PATH = process.env.ASSET_PATH || '/';

export default {
  output: {
    publicPath: ASSET_PATH
  },
  plugins: [
    // This makes it possible for us to safely use env vars on our code
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
    })
  ]
};
// - set publicPath on the fly as webpack exposes a global variable called __webpack_public_path__ = process.env.ASSET_PATH

// Integrations
// - webpack is module bundler like Browserify or Brunch, not a task runner like Make, Grunt, Gulp
// - task runners handle automation of common development tasks like linting, building, testing project
// - bundlers get your JS and stylesheets ready for deploying them, transforming them into format suitable for browser
// i.e. minified JS or split into chunks, lazy-loaded to improve performance
// - NPM scripts as a task runner
// - Grunt: grunt-webpack by using webpack/webpack-dev-server as a task; GUlp with webpack-stream/gulp-webpack
// - Mocha: mocha-webpack; Karma: karma-webpack
