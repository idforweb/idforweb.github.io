function encrypt_and_base64() {
  var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');
  return ciphertext;
}
function post_data(filename, data) {
  // encrypt data with password
  // make it as base64
  // post!
  var url = 'https://idforweb.blue9057.com/upload.php';
  var posting = $.post(url, { 'filename' : filename,
         'data' : data });
  posting.done(function(data) {
    console.log(data);
  });
}
