var Animated_GIF = require('./Animated_GIF/Animated_GIF.js');

module.exports = function(videoElement) {
    'use strict';

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    canvas.width = videoElement.width;
    canvas.height = videoElement.height;

    this.getShot = function(callback, numFrames, interval) {
        numFrames = numFrames !== undefined ? numFrames : 3;
        interval = interval !== undefined ? interval : 0.1; // In seconds

        var pendingFrames = numFrames;
        var ag = new Animated_GIF({
            workerPath: './lib/Animated_GIF/quantizer.js'
        });
        ag.setSize(canvas.width, canvas.height);
        ag.setDelay(interval);

        captureFrame();

        function captureFrame() {
            ag.addFrame(videoElement);
            pendingFrames--;

            if (pendingFrames > 0) {
                setTimeout(captureFrame, interval * 1000); // timeouts are in milliseconds
            } else {
                ag.getBase64GIF(function(image) {
                    var img = document.createElement('img');
                    img.setAttribute('id', 'target')
                    img.src = image;

                    document.querySelector('#target_box').appendChild(img);
                    callback(image);
                });
            }
        }

    };
}