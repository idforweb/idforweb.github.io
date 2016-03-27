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
check_gtid();

function update_gtid() {
  var input = document.getElementById('gtid_input');
  localStorage['gtid'] = input.value;
  check_gtid();
}

function back_to_main() {
  location.href = 'index.html';
}
