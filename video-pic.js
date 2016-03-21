var recordingDIV = document.querySelector('.recordrtc');
var recordingMedia = recordingDIV.querySelector('.recording-media');
var recordingPlayer = recordingDIV.querySelector('video');
var mediaContainerFormat = recordingDIV.querySelector('.media-container-format');

function captureAudioPlusVideo(config) {
  captureUserMedia({video: true, audio: true}, function(audioVideoStream) {
    recordingPlayer.srcObject = audioVideoStream;
    recordingPlayer.play();

    config.onMediaCaptured(audioVideoStream);

    audioVideoStream.onended = function() {
      config.onMediaStopped();
    };
  }, function(error) {
    config.onMediaCapturingFailed(error);
  });
}


