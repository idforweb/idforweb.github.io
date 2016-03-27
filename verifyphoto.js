var PHOTO = PHOTO || {
};

function photo_startup() {
  PHOTO.video = document.getElementById('video');
  PHOTO.canvas = document.getElementById('canvas');
  PHOTO.photo = document.getElementById('photo');
  PHOTO.startbutton = document.getElementById('startbutton');

  PHOTO.navigator.getMedia = ( navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia);

  PHOTO.navigator.getMedia({
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
