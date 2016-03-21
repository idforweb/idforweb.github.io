function draw(at, cb) {
  var video = document.getElementById('thumbnail');
  video.ontimeupdate = function() {
    cb(video);
  };
  video.currentTime = at;
}

function drawCanvas(at) {
  var canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 540;
  var body =  document.getElementsByTagName('body')[0];
  body.appendChild(canvas);
  draw(at, function(video) {
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 720, 540);
  });
}
