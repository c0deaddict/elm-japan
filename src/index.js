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

(function() {
  //main code goes here
  // declare our variables
  var seriously, // the main object that holds the entire composition
    source, // wrapper object for source video
    edge, // edge detection effect
    target; // a wrapper object for our target canvas

  function log(text) {
    document.body.appendChild(document.createTextNode(text));
    document.body.appendChild(document.createElement('br'));
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    log("enumerateDevices() not supported.");
    return;
  }

  // List cameras and microphones.

  navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      devices.forEach(function(device) {
        if (device.kind == 'videoinput') {
          log(device.label + " id = " + device.deviceId);
        }
      });
    })
    .catch(function(err) {
      log(err.name + ": " + error.message);
    });

  if (Seriously.incompatible('camera')) {
    log('Sorry, your browser does not support getUserMedia');
    document.querySelector('canvas').style.display = 'none';
    return;
  }

  // construct our seriously object
  seriously = new Seriously();
  // time to get serious
  source = seriously.source('camera', {
      video: {
          facingMode: "back"
      }
    });
  target = seriously.target('#target');
  //edge = seriously.effect('edge');
  // connect all our nodes in the right order
  //edge.source = source;
  //target.source = edge;
  target.source = source;
  seriously.go();
}());
