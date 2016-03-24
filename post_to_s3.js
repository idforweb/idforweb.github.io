function post_data(filename, data) {
  // encrypt data with password
  // make it as base64
  // post!
  var url = 'http://ec2-52-90-217-64.compute-1.amazonaws.com/upload.php';
  var posting = $.post(url, { 'filename' : filename,
         'data' : data });
  posting.done(function(data) {
    console.log(data);
  });
}
