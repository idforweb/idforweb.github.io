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
    width: 640,
    height: 360,
  },
  audio : true,
};

var rtcRecorder = null;

function init_recording() {
  var videoElem = document.querySelector('video');
  function onMediaSuccess(stream) {
    rtcRecorder = new RecordRTC(stream, {
      type: 'video',
      numberOfAudioChannels: 1,
      bufferSize: 16384,
      sampleRate: 44100,
      video: videoElem,
    });
    // make the stream to be displayed on the things...
    videoElem.src = window.URL.createObjectURL(stream);
    videoElem.play();
  }
  function onMediaError() {
    console.log("Error on opening webcam");
  }
  navigator.getUserMedia(record_constraints, onMediaSuccess, onMediaError);
}
var video_record = document.querySelector('video');
init_recording();

var test_affs = 'Yeongjin Jang, Researcher at GT-IISP. Today is Mar 22nd, 2016';
var test_phrases = ['tasty avocado', 'handsome lion', 'opened sesame'];
var indexes = [];
var all_phrases = [test_affs].concat(test_phrases);

function PhrasePlayer(phrases, mode, target_html_elem, target_video_elem, times) {
  this.timer = null;
  this.target_html_elem = target_html_elem;
  if(typeof target_html_elem == 'string') {
    this.target_html_elem = document.getElementById(target_html_elem);
  }
  this.stamps = [];
  this.mode = mode;
  if(mode == 'verify') {
    this.target_video_elem = target_video_elem;
    if(typeof target_video_elem == 'string') {
      this.target_video_leme = document.getElementById(target_video_elem);
    }
    this.stamps = times;
  }
  this.phrases = phrases;
  this.current_position = 0;
  this.is_started = false;
}

PhrasePlayer.prototype.start_timer = function() {
  this.timer = Date.now();
  this.is_started = true;
};
PhrasePlayer.prototype.clear_timer = function() {
  this.timer = null;
  this.stamps = [];
};

PhrasePlayer.prototype.lap_timer = function() {
  var lap = Date.now() - this.timer;
  this.stamps.push(lap);
};

PhrasePlayer.prototype.get_stamps = function() {
  return this.stamps.slice(0);
};

PhrasePlayer.prototype.update_record_html = function() {
  if(this.is_started) {
    this.lap_timer();
  }
  else {
    this.start_timer();
  }
  var total_length = this.phrases.length;
  if(total_length <= this.current_position) {
    // write a button 'done'
    this.target_html_elem.innerHTML = '';

    // create button, append child
    var button = document.createElement('button');
    button.innerText = 'Done';
    button.addEventListener('click',function() {
      stop_recording(this.get_stamps());
    }, false);
    this.target_html_elem.appendChild(button);
  }
  else {
    var current_phrase = this.phrases[this.current_position];
    var header = '';
    if(this.current_position == 0) {
      header = 'Your info: ';
    }
    else {
      header = 'Phrase ' + this.current_position + ': ';
    }
    this.target_html_elem.innerText = header + current_phrase + "\n";
    var button = document.createElement('button');
    button.innerText = 'Next';
    var self = this;
    button.addEventListener('click', function() {
      self.update_record_html();
    }, false);
    this.target_html_elem.appendChild(button);
    this.current_position += 1;
  }
};



var phrasePlayer = new PhrasePlayer(all_phrases, 'record', 'phrase');

function start_recording() {
  if(rtcRecorder != null) {
    rtcRecorder.startRecording();
    phrasePlayer.update_record_html();
  }
}

function stop_recording(timings) {
  if(rtcRecorder != null) {
    rtcRecorder.stopRecording(function() {
      video_record.src = rtcRecorder.toURL();
      console.log('Record finished');
    });
  }
}

var is_recording = false;
function recordToggle() {
  is_recording = !is_recording;
  var button = document.getElementById('record_btn');
  if(is_recording) {
    var video_record = document.querySelector('video');
    video_record.muted = true;
    button.innerText = 'Stop Record';
    console.log('Record Started');
    start_recording();
  }
  else {
    var video_record = document.querySelector('video');
    video_record.muted = false;

    button.innerText = 'Start Record';
    // finished recording
    console.log('Record Finished');
    stop_recording();
  }
}
