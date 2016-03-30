function get_gtid() {
  return localStorage['gtid'];
}

function check_gtid() {
  var gtid = get_gtid();
  var display_id = document.getElementById('gtid');
  if(gtid == undefined) {
    display_id.innerText = 'Your GTID is not yet set';
  }
  else {
    display_id.innerText = 'Your GTID is ' + gtid;
  }
}

function update_gtid() {
  var input = document.getElementById('gtid_input');
  if(input.value == undefined || typeof(input.value) != 'string' || input.value.length < 6) {
    alert('GTID must be longer than 6 digits');
    return;
  }
  localStorage['gtid'] = input.value;
  check_gtid();
}

function back_to_main() {
  location.href = 'index.html';
}
