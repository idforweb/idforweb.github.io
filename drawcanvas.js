function draw() {
  var ctx = document.getElementById('drawcanvas').getContext('2d');
  var text = ctx.measureText("foo"); // TextMetrics object
  text.width; // 16;
}
// drawText('asdf', 0, 100, '48px serif');
function drawText(string, x, y, font) {
  var ctx = document.getElementById('drawcanvas').getContext('2d');
  ctx.font = font;
  ctx.textBaseline = "hanging";
  ctx.fillText(string, x, y);
}

function loadID(src, cb) {
  var ctx = document.getElementById('drawcanvas').getContext('2d');
  var imageObj = new Image();
  imageObj.crossOrigin = "Anonymous";
  imageObj.onload = function () {
    ctx.canvas.width = imageObj.width;
    ctx.canvas.height = imageObj.height;
    ctx.drawImage(this, 0, 0);
    if(cb) {
      cb();
    }
  };
  imageObj.src = src;
}

function load_ID_default(cb) {
  loadID('idtemplate.png', cb);
}

function getDate() {
  var d = new Date().toString();
  var d_arr = d.split(' ');
  var new_arr = [];
  new_arr.push(d_arr[1]);
  new_arr.push(d_arr[2]);
  new_arr.push(d_arr[3]);
  return new_arr.join(' ');
}

function getRandomID() {
  var int_id = (Math.random() * 100000000) | 0;
  var str_id = '' + int_id;

  var add = (9 - str_id.length);
  for(var i=0; i<add; ++i) {
    str_id = '0' + str_id;
  }
  return str_id;
}

function drawAllText(first_name, last_name, position, affiliation) {
  var font = "44px arial";
  drawText("First Name: " + first_name, 500, 400, font);
  drawText("Surname: " + last_name, 500, 475, font);
  drawText("Position: " + position, 500, 550, font);
  drawText("Affiliation: " + affiliation, 500, 625, font);
  drawText("Issue Date: " + getDate(), 500, 700, font);
  var idNumber = getRandomID();
  Globals.idNumber = idNumber;
  drawText("ID Number: " + idNumber, 500, 775, font);
}

function drawQR(string, x, y, size, finished) {
  // create new canvas element
  var canvas = document.createElement('canvas');
  canvas.height = size;
  canvas.width = size;
  canvas.id = 'qr_canvas_' + ((Math.random() * 100000 )| 0);
  canvas.style='display:none';
  var body =  document.getElementsByTagName('body')[0];
  body.appendChild(canvas);
  var qrcode = new QRCode(canvas.id, {
    text: string,
    width: size,
    height: size,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H,
  });
  console.log("Try draw QR in " + canvas.id);

  var cb = function callback(elem) {
    if(elem.src != undefined && elem.src.length > 0 && elem.src.substring(0,10) == 'data:image')
    {
      setTimeout(function() {
        var ctx = document.getElementById('drawcanvas').getContext('2d');
        ctx.drawImage(elem, x, y);
        console.log('Draw canvas id ' + canvas.id);
        if(finished) {
          finished();
        }
      }, 100);
    }
    else {
      setTimeout(function() { callback(elem);}, 50);
    }
  };
  var intervalID = setInterval(function() {
    var elem = document.getElementById(canvas.id + '_img');
    if(elem != null) {
      clearInterval(intervalID);
      cb(elem);
    }
    else {
      console.log(canvas.id + " is null");
    }
  }, 50);
}

function drawImage(img_elem) {
    var canvas = document.getElementById('drawcanvas');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img_elem, 50, 450, 400, 300);
}

function generateID(fn, ln, pos, aff, qr1, qr2) {
  load_ID_default(function() {
    drawQR(qr1, 1105, 275, 350, function() {
      drawQR(qr2, 1105, 650, 350, function() {
        setTimeout(function() {
          drawAllText(fn, ln, pos, aff);
          setTimeout(function() {
            var chosen_img = document.getElementById('chosen_img');
            drawImage(chosen_img);
            setTimeout(function() {
              var canvas = document.getElementById('drawcanvas');
              var dataURL = canvas.toDataURL('image/png');
              var img = document.getElementById('img_id');
              img.src = dataURL;
              img.addEventListener('click', function() {
                location.href='verify.html';
              });
              Globals.id_figure = dataURL;
              show_div_id();
              // store into DB
              b2bDB.store_id(Globals.idNumber,
                        Globals.key.getPublicKey(),
                        Globals.key.getPrivateKey(),
                        Globals.id_figure,
                        Globals.id_index,
                        Globals.phrases,
                        Globals.video_data_uri);
              }, 100);
          }, 100);
        }, 100);
      });
    });
  });
//  setTimeout(function () {

//  }, 200);
}

