function encrypt_data(data) {
  if(typeof data != 'string') {
    data = JSON.stringify(data);
  }
  // get iv
  var iv = forge.random.getBytesSync(16);
  console.log('iv: ' + forge.util.bytesToHex(iv));
  var key = 'some_key_for_enc';
  var cipher = forge.cipher.createCipher('AES-OFB', key);
  cipher.start({iv: iv});
  cipher.update(forge.util.createBuffer(data));
  cipher.finish();
  var encrypted = cipher.output;
  console.log('enc: ' + forge.util.bytesToHex(encrypted.data));
  return (iv + encrypted.data);
}

function decrypt_data(data) {
  var iv = data.substring(0,16);
  console.log('iv: ' + forge.util.bytesToHex(iv));
  var real_data = data.substring(16);
  console.log('enc: ' + forge.util.bytesToHex(real_data));
  var key = 'some_key_for_enc';
  var decipher = forge.cipher.createDecipher('AES-OFB', key);
  decipher.start({iv: iv});
  decipher.update(forge.util.createBuffer(real_data));
  decipher.finish();
  var decrypted = decipher.output;
  console.dir(decrypted.data);
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
  var url = 'https://idforweb.blue9057.com/upload.php';
  var posting = $.post(url, { 'filename' : filename,
         'data' : data });
  posting.done(function(data) {
    console.log(data);
    if(data.startsWith('http')) {
      if(cb_ok) {
        cb_ok();
      }
    }
    else {
      if(cb_fail) {
        cb_fail();
      }
    }
  });
}

function upload_to_s3(id_object, cb_ok, cb_fail) {
  var filename = id_object['idNumber'];
  var encrypted = encrypt_data(id_object);
  post_data(filename, encrypted, cb_ok, cb_fail);
}

function upload_to_s3_with_number(idNumber) {
  b2bDB.retrieve_id_with_number(idNumber, function() {
    upload_to_s3(result, function() {
      alert('uploading of ' + idNumber + ' is succeeded');
    }, function () {
      alert('uploading of ' + idNumber + ' is failed');
    });
  },
  function() {
    alert('upload failed: db query');
  });
}
