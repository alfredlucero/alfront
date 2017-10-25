// Electron Notes - Cross-Platform Desktop apps with HTML/CSS/JS
// - Shortcoming of web browser: can't access your hard drive
// - Familiar tooling and speedier development by making it more web-like
// - How does it work? 
// -- for Google Chrome browser process - there is a child browser Google Chrome Helper process created per tab
//  a Chome app -> RendererProcess -> shows a webpage, there is interprocess communication (IPC) between separate RendererProcesses (tabs) and MainWindow
// -- for Electron desktop, there will be a main window process and a number of child renderer processes to show separate windows to the user
// in a desktop looking environment with an interprocess communication system too
// - History: Github -> Electron -> Atom
// - Basic: Electron app creates MainWindow (like browser window) with an index.html
// - npm install --save electron

// Sample index.js
// "main": "index.js"
// "scripts": { "electron": "electron ." }
const electron = require('electron');

// Overall running electron app process to start up
const { app, BrowserWindow } = electron;

// Event-based programming
app.on('ready', () => {
  console.log('App is now ready!');
  // Opens up a blank browser window and can even access Chromium development console
  // new BrowserWindow({});
  const mainWindow = new BrowserWindow({});
  // Look at current working directory and find index.html to load into browser window
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});
