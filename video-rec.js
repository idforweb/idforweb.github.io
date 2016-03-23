function getVideoElem() {
  var video = document.getElementById('record');
  return video;
}

navigator.getUserMedia  = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

var record_constraints = {
  video : true,
  audio : true,
};

var mediaRecorder = null;

function start_recording() {
  var video = document.querySelector('video');
  function onMediaSuccess(stream) {
    mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.mimeType = 'video/webm';
    mediaRecorder.ondataavailable = function (blob) {
      //var blobURL = URL.createObjectURL(blob);
      video.src = window.URL.createObjectURL(stream);
    }
    mediaRecorder.start();
  }
  function onMediaError() {
    console.log("Error on opening webcam");
  }
  navigator.getUserMedia(record_constraints, onMediaSuccess, onMediaError);
}

function stop_recording() {
  if(mediaRecorder != null) {
    mediaRecorder.stop();
  }
}

var is_recording = false;
function recordToggle() {
  is_recording = !is_recording;
  var button = document.getElementById('record_btn');
  if(is_recording) {
    button.innerText = 'Stop Record';
    console.log('Record Started');
  }
  else {
    button.innerText = 'Start Record';
    // finished recording
    console.log('Record Finished');
  }
}
