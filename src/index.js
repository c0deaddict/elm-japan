'use strict';

require('ace-css/css/ace.css');
require('font-awesome/css/font-awesome.css');

// Require index.html so it gets copied to dist
require('./index.html');

var Elm = require('./Main.elm');
var mountNode = document.getElementById('main');

// The third value on embed are the initial values for incomming ports into Elm
var app = Elm.Main.embed(mountNode);

(function() {
  var video = document.getElementById('video');

  // // Get access to the camera!
  // if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //     // Not adding `{ audio: true }` since we only want video now
  //     navigator.mediaDevices.getUserMedia({ video: { facingMode: {exact: "back"}} }).then(function(stream) {
  //         video.src = window.URL.createObjectURL(stream);
  //         video.play();
  //     });
  // }

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
          var n = document.createElement('div');
          n.appendChild(document.createTextNode(device.label + " id = " + device.deviceId));
          n.addEventListener('click', function() {
            navigator.mediaDevices.getUserMedia({ video: { deviceId: device.deviceId } }).then(function(stream) {
                video.src = window.URL.createObjectURL(stream);
                video.play();
            });
          });
          document.body.appendChild(n);
        }
      });
    });


  // Elements for taking the snapshot
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var video = document.getElementById('video');

  // Trigger photo take
  document.getElementById("snapButton").addEventListener("click", function() {
  	context.drawImage(video, 0, 0, 640, 480);
  });
})();
