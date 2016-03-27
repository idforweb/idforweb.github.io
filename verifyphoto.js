var PHOTO = PHOTO || {
};

function photo_startup() {
  PHOTO.video = document.getElementById('video');
  PHOTO.canvas = document.getElementById('canvas');
  PHOTO.photo = document.getElementById('photo');
  PHOTO.startbutton = document.getElementById('startbutton');

  // setup video
  PHOTO.video.addEventListener('canplay', function(ev){
    /*
    if (!PHOTO.streaming) {
      PHOTO.height = PHOTO.video.videoHeight / (PHOTO.video.videoWidth/PHOTO.width);

      // Firefox currently has a bug where the height can't be read from
      // the video, so we will make assumptions if this happens.

      if (isNaN(PHOTO.height)) {
        PHOTO.height = PHOTO.width / (4/3);
      }

      PHOTO.video.setAttribute('width', PHOTO.width);
      PHOTO.video.setAttribute('height', PHOTO.height);
      PHOTO.canvas.setAttribute('width', PHOTO.width);
      PHOTO.canvas.setAttribute('height', PHOTO.height);
      PHOTO.streaming = true;
    }
    */
  }, false);

  navigator.getMedia = ( navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia);

  navigator.getMedia({
    video: true,
    audio: false
  },
  function(stream) {
    if (navigator.mozGetUserMedia) {
      PHOTO.video.mozSrcObject = stream;
    } else {
      var vendorURL = window.URL || window.webkitURL;
      PHOTO.video.src = vendorURL.createObjectURL(stream);
    }
    PHOTOvideo.play();
  },
  function(err) {
    console.log("An error occured! " + err);
  });
}

photo_startup();
