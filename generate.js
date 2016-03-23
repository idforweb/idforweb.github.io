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
  var phrases = genKeyAndPhrase();
  var fn = document.getElementById('fn').value;
  var ln = document.getElementById('ln').value;
  var pos = document.getElementById('pos').value;
  var aff = document.getElementById('aff').value;
  var phrase_0 = fn + " " + ln + ", " + pos + " at " + aff + ", today is " +
    get_date_string();
  var all_phrases = [phrase_0].concat(phrases);
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

function chooseImg(id) {
  var id_tag = 'img' + (id + 1);
  var img = document.getElementById(id_tag);
  var img_chosen = document.getElementById('chosen_img');
  img_chosen.src = img.src;
}


var Globals = Globals || {
};
