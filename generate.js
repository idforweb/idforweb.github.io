if(location.href.endsWith('generate.html')) {
  b2bDB.db_open_callback = function() {
    console.log('db init');
  }
  b2bDB.init_db();
  function check_https() {
    var url = location.href;
    var sub = url.substring(0,5);
    if(sub != 'https') {
      if(sub != 'file:') {
        location.href='https://idforweb.github.io/generate.html';
      }
    }
  }
  check_https();
}

function generate_qr_code(name, string, size) {
    document.getElementById(name).innerHTML = '';
    var qrcode = new QRCode(name, {
      text: string,
      width: size,
      height: size,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
    return qrcode;
}

function show_main() {
  document.getElementById('menu').style = '';
}
function hide_main() {
  document.getElementById('menu').style = 'display:none;';
}

function get_date_string() {
  var date_arr = Date().split(' ').splice(1,3);
  return date_arr[0] + ' ' + date_arr[1] + ', ' + date_arr[2];
}

function generate_phrases() {
  var key_and_phrases = genKeyAndPhrase();
  var phrases = key_and_phrases['phrases'];
  Globals.key = key_and_phrases['key'];
  var fn = document.getElementById('fn').value;
  var ln = document.getElementById('ln').value;
  var pos = document.getElementById('pos').value;
  var aff = document.getElementById('aff').value;
  Globals.fn = fn;
  Globals.ln = ln;
  Globals.pos = pos;
  Globals.aff = aff;
  var phrase_0 = fn + " " + ln + ", " + pos + " at " + aff + ", today is " +
    get_date_string();
  var all_phrases = [phrase_0].concat(phrases);
  Globals.phrases = all_phrases;
  return all_phrases;
}
var phrasePlayer = undefined;

function show_record() {
  document.getElementById('recording').style = '';
  hide_main();
  var all_phrases = generate_phrases();
  Globals.all_phrases = all_phrases;
  console.dir(all_phrases);
  phrasePlayer = new PhrasePlayer(all_phrases, 'record', 'phrase');
}
function hide_record() {
  document.getElementById('recording').style = 'display:none;';
  show_main();
}

function show_instructions() {
  document.getElementById('instructions').style = '';
}
function hide_instructions() {
  document.getElementById('instructions').style = 'display:none;';
}

function refresh_page() {
  location.href='generate.html';
}

function click_record_selfie() {
  hide_main();
  show_instructions();
}

function click_instructions() {
  hide_instructions();
  show_record();
  recordToggle();
}

function show_div_id() {
  document.getElementById('div_showing_id').style = '';
  hide_main();
}
function hide_div_id() {
  document.getElementById('div_showing_id').style = 'display:none;';
  show_main();
}

function chooseImg(id) {
  var id_tag = 'img' + (id + 1);
  var img = document.getElementById(id_tag);
  var img_chosen = document.getElementById('chosen_img');
  img_chosen.src = img.src;
  document.getElementById('gen').style = '';
}

function xor_qr(qr_string) {
  var keystring = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
  var new_string = '';
  var i;
  for(i=0; i<qr_string.length; ++i) {
    var idx = i % keystring.length;
    var value_a = keystring.charCodeAt(idx);
    var value_b = qr_string.charCodeAt(i);
    new_string += String.fromCharCode(value_a ^ value_b);
  }
  return new_string;
}

function do_generate_id() {
  // get phrases
  // get indexes
  // get fn, ln, pos, aff
  // get img

  // to read and heading
  var arr = Globals.phrases.slice(0);
  var heading = arr.shift();
  var qr1 = arr.join('~~~') + 'MMM' + heading;
  // time and videopath
  var qr2 = Globals.indexes.join('~~~') + 'MMM' + 'Video_ID_HERE';

  qr1 = xor_qr(qr1);
  qr2 = xor_qr(qr2);
  console.log(xor_qr(qr1));
  console.log(xor_qr(qr2));
  generateID(Globals.fn, Globals.ln, Globals.pos, Globals.aff, qr1, qr2);
}


var Globals = Globals || {
};
