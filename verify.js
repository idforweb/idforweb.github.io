var VerifyGlobals = VerifyGlobals || {
  IDs : {},
  num_array : [],
};

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
      console.log('I wanna verify ' + ID['idNumber']);
      // do something
      // create PhrasePlayer
      phrasePlayer = new PhrasePlayer(ID['phrases'], 'verify',
                                      'phrase', 'record', ID['time_index']);
      var video = document.getElementById('record');
      video.src = ID['videoURL'];
      // show verify
      show_verify();
    }
  })(id);
  p.appendChild(img);
  var br = document.createElement('br');
  p.appendChild(br);
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
}

if(location.href.endsWith('verify.html')) {
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
