var VerifyGlobals = VerifyGlobals || {
  IDs : {},
  num_array : [],
};
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
          },
          function(err) {
            console.dir('err on retrieveing id: ' + err);
          });
        }
      });
  }
  b2bDB.init_db();
}
