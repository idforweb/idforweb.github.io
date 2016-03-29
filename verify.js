var VerifyGlobals = VerifyGlobals || {
  IDs : {},
  num_array : [],
  get_session_number : function() {
    VerifyGlobals.sessionNumber = localStorage['verify_session_number']|0;
    localStorage['verify_session_number'] = '' + VerifyGlobals.sessionNumber;
    return VerifyGlobals.sessionNumber;
  },
  increment_session_number : function() {
    VerifyGlobals.sessionNumber = localStorage['verify_session_number']|0;
    VerifyGlobals.sessionNumber += 1;
    localStorage['verify_session_number'] = '' + VerifyGlobals.sessionNumber;
  },
  photo_count : 0,
};

function survey() {
  location.href='https://goo.gl/forms/xhxUZ5GhZp';
}
function menu() {
  location.href='stage2.html';
}


function show_menu() {
  var menu = document.getElementById('menu');
  menu.style = '';
}
function hide_menu() {
  var menu = document.getElementById('menu');
  menu.style = 'display:none;';
}
function show_verify() {
  var verify_video = document.getElementById('recording');
  verify_video.style = '';
  hide_menu();
}
function hide_verify() {
  var verify_video = document.getElementById('recording');
  verify_video.style = 'display:none;';
  show_menu();
}

function upload_all() {
  // get ids.
  var i;
  var upload_list = [];
  for(i=0; i<VerifyGlobals.num_array.length; ++i) {
    var idNumber = VerifyGlobals.num_array[i]['idNumber'];
    var ID = VerifyGlobals.IDs[idNumber];
    if(ID['uploaded'] != true) {
      upload_list.push(ID);
    }
  }
  var cnt = 0;
  upload_list.forEach(function(id_object) {
    upload_to_s3(id_object, function() {
      id_object['uploaded'] = true;
      b2bDB.update_id(id_object);
      cnt += 1;
      if(cnt == upload_list.length) {
        alert('Upload all finished');
        window.location.reload();
      }
    },
    function() {
      alert('Failed to upload ' + id_object.idNumber);
    });
  });
}

var phrasePlayer = phrasePlayer || undefined;

function draw_id(id) {
  // create img element
  var p = document.getElementById('id_list');
  var img = document.createElement('img');
  img.width = 400;
  img.height = 300;
  img.src = id['id_picture'];
  img.onclick = (function(ID) {
    return function() {
      console.dir(ID);
      console.log('I wanna verify ' + ID['idNumber']);
      // do something
      // create PhrasePlayer
      phrasePlayer = new PhrasePlayer(ID['phrases'], 'verify2',
                                      'phrase', 'record', ID['time_index']);
      var video = document.getElementById('record');
      video.src = ID['videoURL'];
      // show verify
      show_verify();
      phrasePlayer.capture_cb = function() {
        console.log('captured!');
        takepicture(function() {
          var fn = get_gtid() + '_' + ID['idNumber'] + "_" +
            VerifyGlobals.get_session_number() + '_' +
            VerifyGlobals.photo_count + '.jpg.b64';
          VerifyGlobals.photo_count += 1;
          console.log('fn : ' + fn);
          console.log(PHOTO.photo.src.length);
          upload_data_uri_to_s3(PHOTO.photo.src,
                                fn,
                                function(data) {
                                  console.log("Upload is OK: " + data);
                                },
                                function() {
                                  alert('check your internet connection: ' + data);
                                });
        })
      };
      VerifyGlobals.increment_session_number();
      phrasePlayer.start_verify();
    }
  })(id);
  p.appendChild(img);
  var img2 = document.createElement('img');
  img2.src = 'indicator.gif';
  img2.width = 24;
  img2.height = 24;
  img2.style = 'display:none;';
  img2.id = 'img_' + id['idNumber'];
  var button = document.createElement('button');
  button.addEventListener('click', function() {
    upload_to_s3_with_number(id['idNumber']);
    // add indicator
    img2.style = '';
  });

  button.innerText = 'Click to upload (takes few seconds)';
  var button2 = document.createElement('button');
  button2.addEventListener('click', function() {
    b2bDB.delete_id(id['idNumber'], function() {
      window.location.reload();
    });
  });
  button2.innerText = 'Delete ID';

  var b2 = document.createElement('b');
  b2.innerText = " Uploaded? ";
  var b3 = document.createElement('b');
  if(id['uploaded'] == true) {
    b3.innerHTML = "<font color='green'>O</font>";
  }
  else {
    b3.innerHTML = "<font color='red'>X</font>";
  }


  var b = document.createElement('b');
  b.innerText = 'ID: ' + id['idNumber'];
  var br = document.createElement('br');
  var br2 = document.createElement('br');
  var br3 = document.createElement('br');
  var br4 = document.createElement('br');
  p.appendChild(br);
  p.appendChild(b);
  p.appendChild(br2);
  p.appendChild(button);
  p.appendChild(button2);
  p.appendChild(b2);
  p.appendChild(b3);
  p.appendChild(img2);
  p.appendChild(br3);
  p.appendChild(br4);
}

function loaded_all() {
  // key list at VerifyGlobals.num_array[i]['idNumber'];
  // IDs at VerifyGlobals.IDs[idNumber];
  var i;
  for(i=0; i<VerifyGlobals.num_array.length; ++i) {
    var idNumber = VerifyGlobals.num_array[i]['idNumber'];
    var ID = VerifyGlobals.IDs[idNumber];
    // draw at here!
    (function(id) {
      draw_id(id);
    })(ID);
  }
  if(location.hash == '#verifyprevious') {
    if(id_list.firstElementChild != null) {
      id_list.firstElementChild.click();
    }
  }
}

if(location.href.split('#')[0].endsWith('verify.html')) {
  b2bDB.db_open_callback = function() {
      console.log('db init');
      // load IDs
      b2bDB.get_all_metadata(function(data) {
        var data_array = data;
        data_array.sort(function(a, b) {
          return a['timestamp'] < b['timestamp'];
        });
        VerifyGlobals.num_array = data_array.slice(0);
        var i;
        for(i=0; i<data_array.length; ++i) {
          b2bDB.retrieve_id_with_number(data_array[i].idNumber, function(result) {
            // add result into the list.
            VerifyGlobals.IDs[result['idNumber']] = result;
            if(Object.keys(VerifyGlobals.IDs).length == VerifyGlobals.num_array.length) {
              loaded_all();
            }
          },
          function(err) {
            console.dir('err on retrieveing id: ' + err);
          });
        }
      });
  }
  b2bDB.init_db();
}
