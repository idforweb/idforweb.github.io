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
    height: 480,
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
      this.target_video_elem = document.getElementById(target_video_elem);
      if(this.target_video_elem != undefined) {
        var self = this;
        setTimeout(function() {
          self.target_video_elem.muted = false;
        }, 100);
      }
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

PhrasePlayer.prototype.reject_id = function() {
  console.log('ID rejected');
};

PhrasePlayer.prototype.accept_id = function() {
  console.log('ID accpeted');
  getThumbnail(this.target_video_elem.src, this.get_stamps());
  if(hide_record != undefined) {
    hide_record();
  }
};



PhrasePlayer.prototype.play_current_phrase = function() {
  // set video to the start position.
  var start_position = this.set_video_position();
  // set timer for pause!
  var next_position = this.stamps[this.current_position];
  console.log('start ' + start_position + ' end ' + next_position + ' stamps: ');
  console.dir(this.stamps);
  var self = this;
  setTimeout(function() {
    self.target_video_elem.pause();
  }, next_position - start_position);
  // play!
  this.target_video_elem.play();
};

PhrasePlayer.prototype.set_video_position = function() {
  var start_position = 0;
  if(this.current_position == 0) {
    // set position to 0.
    this.target_video_elem.currentTime = 0;
  }
  else {
    start_position = this.stamps[this.current_position - 1];
    this.target_video_elem.currentTime = (start_position / 1000.0);
  }
  this.target_video_elem.pause();
  return start_position;
}

PhrasePlayer.prototype.verify_next = function() {
  this.current_position += 1;
  return this.start_verify();
}

PhrasePlayer.prototype.start_verify = function() {
  /*
    Show current phrase
    Button 1: back - back to previous phrase
    Button 2: Next - move to next phrase
    Button 3: Reject - reject current video
  */
  this.set_video_position();
  var self = this;
  function getBackButton() {
    var button = document.createElement('button');
    button.innerText = 'Back';
    button.addEventListener('click',function() {
      self.current_position -= 1;
      if(self.current_position < 0) {
        self.current_position = 0;
      }
      self.start_verify();
    }, false);
    return button;
  }
  function getPlayButton() {
    var button = document.createElement('button');
    button.innerText = 'Play';
    button.addEventListener('click',function() {
      self.play_current_phrase();
    }, false);
    return button;
  }
  function getDoneButton() {
    var button = document.createElement('button');
    button.innerText = 'Done';
    button.addEventListener('click',function() {
      self.verify_next();
      self.play_current_phrase();
    }, false);
    return button;
  }
  function getRejectButton() {
    var button = document.createElement('button');
    button.innerText = 'Reject';
    button.addEventListener('click',function() {
      self.reject_id();
    }, false);
    return button;
  }

  function getAcceptButton() {
    var button = document.createElement('button');
    button.innerText = 'Accept';
    button.addEventListener('click',function() {
      self.accept_id();
    }, false);
    return button;
  }

  var is_the_last = this.current_position == (this.phrases.length - 1);
  var current_phrase = this.phrases[this.current_position];
  if(this.current_position == 0) {
    header = 'Your info: ';
  }
  else {
    header = 'Phrase ' + this.current_position + ': ';
  }

  this.target_html_elem.innerText = header + current_phrase + "\n";
  this.target_html_elem.appendChild(getBackButton());
  this.target_html_elem.appendChild(getPlayButton());
  if(is_the_last) {
    this.target_html_elem.appendChild(getAcceptButton());
  }
  else {
    this.target_html_elem.appendChild(getDoneButton());
  }
  this.target_html_elem.appendChild(getRejectButton());
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
    var self = this;
    button.addEventListener('click',function() {
      self.lap_timer();
      stop_recording(self.phrases, self.get_stamps());
    }, false);
    this.target_html_elem.appendChild(button);
  }
  else {
    var is_the_last = this.current_position == (this.phrases.length - 1);
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
    if(is_the_last) {
      button.innerText = 'Done';
      var self = this;
      button.addEventListener('click',function() {
        self.lap_timer();
        stop_recording(self.phrases, self.get_stamps());
      }, false);
    }
    else {
      button.innerText = 'Next';
      var self = this;
      button.addEventListener('click', function() {
        self.update_record_html();
      }, false);
    }
    this.target_html_elem.appendChild(button);
    this.current_position += 1;
    console.log("Updated with phrase[" + this.current_position + "]: " + current_phrase);
  }
};


function start_recording() {
  if(rtcRecorder != null) {
    rtcRecorder.startRecording();
    console.log('start recording');
  }
  phrasePlayer.update_record_html();
}
var video_uri = null;
function stop_recording(phrases, timings) {
  if(rtcRecorder != null) {
    rtcRecorder.stopRecording(function() {
      var video_record = document.querySelector('video');
      video_uri = rtcRecorder.toURL();
      video_record.src = video_uri;
      Globals.video_blob_uri = video_uri;
      rtcRecorder.toDataURI(function(url) {
        Globals.video_data_uri = url;
      });
      Globals.id_index = timings.splice(0);
      video_record.muted = false;
      phrasePlayer = new PhrasePlayer(phrases, 'verify', 'phrase', 'record', timings);
      phrasePlayer.start_verify();
      console.log('Record finished');
      if(timings != undefined) {
        Globals.indexes = timings;
      }
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
    button.innerText = 'Start Record';
    // finished recording
    console.log('Record Finished');
    stop_recording();
  }
}

/*
 For a given data URI and the timestamp,
 extract thumbnail...
*/
function getThumbnail(videoDataURI, stamps) {
  var video_width = 640;
  var video_height = 480;
  // create thumbnail
  var i = 0;
  var images = [];
  images.push(document.getElementById('img1'));
  images.push(document.getElementById('img2'));
  images.push(document.getElementById('img3'));
  for(i=0; i<images.length; ++i) {
    // create a video element
    var video_elem = document.createElement('video');
    video_elem.height = video_height;
    video_elem.width = video_width;
    video_elem.id = 'video_test_thumbnail';
    video_elem.src = videoDataURI;

    // create a canvas
    var canvas = document.createElement('canvas');
    canvas.height = video_height;
    canvas.width = video_width;
    canvas.id = 'canvas_test_thumbnail';

    getThumbnailAt(video_elem, canvas, stamps[i], images[i]);
  }
}

function getThumbnailAt(video_elem, canvas_elem, time, img) {
  video_elem.currentTime = (time / 1000.0);
  setTimeout(function() {
    var ctx = canvas_elem.getContext('2d');
    ctx.drawImage(video_elem, 0, 0, canvas_elem.width, canvas_elem.height);
    img.src = canvas_elem.toDataURL("image/png");
  }, 300);
}
