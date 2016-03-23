function getVideoElem() {
  var video = document.getElementById('record');
  return video;
}

navigator.getUserMedia  = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

window.URL = window.URL || window.webkitURL;

var record_constraints = {
  video : {
    width: 720,
    height: 540,
  },
  audio : true,
};

var rtcRecorder = null;

function init_recording() {
  var videoElem = document.querySelector('video');
  function onMediaSuccess(stream) {
    /*
    rtcRecorder = new RecordRTC(stream, {
      type: 'video',
      numberOfAudioChannels: 1,
      bufferSize: 16384,
      sampleRate: 44100,
      video: videoElem,
    });
    */
    // make the stream to be displayed on the things...
    videoElem.src = window.URL.createObjectURL(stream);
  }
  function onMediaError() {
    console.log("Error on opening webcam");
  }
  navigator.getUserMedia(record_constraints, onMediaSuccess, onMediaError);
}
var video_record = document.querySelector('video');
init_recording();

function start_recording() {
  if(rtcRecorder != null) {
    rtcRecorder.startRecording();
  }
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
