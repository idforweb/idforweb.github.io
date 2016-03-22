function getVideoElem() {
  var video = document.getElementById('record');
  return video;
}

var is_recording = false;
function recordToggle() {
  is_recording != is_recording;
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
