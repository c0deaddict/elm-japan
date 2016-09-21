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
          var n = document.createElement('button');
          n.appendChild(document.createTextNode(device.label));
          n.addEventListener('click', function() {
            navigator.mediaDevices.getUserMedia({ video: { deviceId: device.deviceId } }).then(function(stream) {
                video.src = window.URL.createObjectURL(stream);
                video.play();
            });
          });
          document.getElementById('videoSelection').appendChild(n);
        }
      });
    });


  // Elements for taking the snapshot
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var video = document.getElementById('video');

  // Trigger photo take
  document.getElementById("snapButton").addEventListener("click", function() {
  	context.drawImage(video, 0, 0, canvas.width, canvas.height);
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    var grayscale = function() {
      var sum = 0;
      for (var i = 0; i < data.length; i += 4) {
        sum += (data[i] + data[i + 1] + data[i +2]) / 3;
      }

      var avg = sum / (data.length / 4);

      for (var i = 0; i < data.length; i += 4) {
        var gray = (data[i] + data[i + 1] + data[i +2]) / 3;
        var color = gray < avg * 0.80 ? 0 : 255;
        data[i]     = color;
        data[i + 1] = color;
        data[i + 2] = color;
      }

      context.putImageData(imageData, 0, 0);
    };

    console.log('converting image to grayscale...');
    grayscale();
    console.log('done');
  });
})();
