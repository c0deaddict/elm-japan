'use strict';

require('ace-css/css/ace.css');
require('font-awesome/css/font-awesome.css');

// Require index.html so it gets copied to dist
require('./index.html');

var Elm = require('./Main.elm');
var mountNode = document.getElementById('main');

// The third value on embed are the initial values for incomming ports into Elm
var app = Elm.Main.embed(mountNode);

require('seriously');
require('../lib/seriously/sources/seriously.camera.js')
require('../lib/seriously/effects/seriously.edge.js');
require('../lib/seriously/effects/seriously.ascii.js');

(function() {
  //main code goes here
  // declare our variables
  var seriously, // the main object that holds the entire composition
    source, // wrapper object for source video
    edge, // edge detection effect
    target; // a wrapper object for our target canvas
  if (Seriously.incompatible('camera')) {
    document.body.appendChild(document.createTextNode('Sorry, your browser does not support getUserMedia'));
    document.querySelector('canvas').style.display = 'none';
    return;
  }
  // construct our seriously object
  seriously = new Seriously();
  // time to get serious
  source = seriously.source('camera');
  target = seriously.target('#target');
  edge = seriously.effect('ascii');
  // connect all our nodes in the right order
  edge.source = source;
  target.source = edge;
  seriously.go();
}());
