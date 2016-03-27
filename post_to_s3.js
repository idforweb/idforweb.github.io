function encrypt_data(data) {
  console.log('trying encrypting');
  if(typeof data != 'string') {
    data = JSON.stringify(data);
  }
  // get iv
  var iv = forge.random.getBytesSync(16);
  //console.log('iv: ' + forge.util.bytesToHex(iv));
  var key = 'some_key_for_enc';
  var cipher = forge.cipher.createCipher('AES-OFB', key);
  cipher.start({iv: iv});
  cipher.update(forge.util.createBuffer(data));
  cipher.finish();
  var encrypted = cipher.output;
  //console.log('enc: ' + forge.util.bytesToHex(encrypted.data));
  console.log('encryption is finished, size: ' + encrypted.data.length);
  return (iv + encrypted.data);
}

function decrypt_data(data) {
  var iv = data.substring(0,16);
  //console.log('iv: ' + forge.util.bytesToHex(iv));
  var real_data = data.substring(16);
  //console.log('enc: ' + forge.util.bytesToHex(real_data));
  var key = 'some_key_for_enc';
  var decipher = forge.cipher.createDecipher('AES-OFB', key);
  decipher.start({iv: iv});
  decipher.update(forge.util.createBuffer(real_data));
  decipher.finish();
  var decrypted = decipher.output;
  //console.dir(decrypted.data);
  try {
    return JSON.parse(decrypted.data);
  } catch(e) {
    console.log("Failed on parsing JSON");
    console.dir(decrypted);
    throw(e);
  }
}

function post_data(filename, data, cb_ok, cb_fail) {
  // encrypt data with password
  // make it as base64
  // post!
  console.log('Trying post of ' + filename + ' sized ' + data.length);
  var url = 'https://idforweb.blue9057.com/upload.php';
  var posting = $.post(url, { 'filename' : filename,
         'data' : data });
  posting.done(function(data) {
    console.log('Posted url: ' + data);
    if(data.startsWith('http')) {
      if(cb_ok) {
        cb_ok(data);
      }
    }
    else {
      if(cb_fail) {
        cb_fail(data);
      }
    }
  });
}

function upload_data_uri_to_s3(dataURI, fn, cb_ok, cb_fail) {
  var encrypted = encrypt_data(dataURI);
  var base64_encrypted = forge.util.encode64(encrypted);
  post_data(fn, base64_encrypted, cb_ok, cb_fail);
}

function upload_to_s3(id_object, cb_ok, cb_fail) {
  var filename = id_object['idNumber'];
  var encrypted = encrypt_data(id_object);
  var base64_encrypted = forge.util.encode64(encrypted);
  post_data(filename, base64_encrypted, cb_ok, cb_fail);
}

function upload_to_s3_with_number(idNumber) {
  b2bDB.retrieve_id_with_number(idNumber, function(result) {
    upload_to_s3(result, function() {
      result['uploaded'] = true;
      b2bDB.update_id(result);
      var img2 = document.getElementById('img_' + result['idNumber']);
      if(img2) {
        img2.style='display:none;';
      }
      alert('uploading of ' + idNumber + ' is succeeded');
      window.location.reload();
    }, function () {
      alert('uploading of ' + idNumber + ' is failed');
    });
  },
  function() {
    alert('upload failed: db query');
  });
}
