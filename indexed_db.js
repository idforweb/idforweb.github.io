'use strict';

// Define indexedDB
if(window.indexedDB == undefined) {
  window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;
}
// Define IDBTransaction
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction
                       || window.msIDBTransaction;

window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange
                      || window.msIDBKeyRange;


if (!window.indexedDB) {
  console.log("Your browser doesn't support a stable version of IndexedDB." +
        "Such and such feature will not be available.");
}

// Create namespace for b2bDB.
var b2bDB = b2bDB || {
  db : null,

  // Open callback after the initialization
  db_open_callback : undefined,

  init_db : function() {
    var req = window.indexedDB.open("b2bDB_data", 14);
    req.onerror = function(err) {
      if(err) {
        console.log('Error on opening database');
        var msg = 'please re-start your browser.';
        if(/firefox/.test(navigator.userAgent.toLowerCase())) {
          msg += ' Private browsing mode in Firefox is not supported.';
        }
        alert('Error on opening Indexed DB: ' + msg);
        console.dir(err);
        throw err;
      }
    };

    // on open success callback
    req.onsuccess = function(evt) {
      b2bDB.db = evt.target.result;
      console.log('DB is initialized');
      b2bDB.db.onerror = function(err) {
        console.log('DB error happened');
        console.dir(err);
        throw err;
      };
      if(b2bDB.db_open_callback) {
        b2bDB.db_open_callback();
      } else {
        console.log('DB open callback is undefined');
      }
    };

    // create db schema here
    req.onupgradeneeded = function(evt) {
      console.log('upgrade is requested');
      b2bDB.db = evt.target.result;
      if(b2bDB.db.objectStoreNames.contains("id-data")) {
        b2bDB.db.deleteObjectStore('id-data');
      }
      if(b2bDB.db.objectStoreNames.contains("id-metadata")) {
        b2bDB.db.deleteObjectStore('id-metadata');
      }

      var objectStore =
        b2bDB.db.createObjectStore("id-data", {keyPath: "idNumber"});
      objectStore.createIndex("timestamp", "timestamp", { unique: false });
      objectStore.createIndex("id_picture", "id_picture", { unique: false });
      objectStore.createIndex("public_key", "public_key", { unique: false });
      objectStore.createIndex("private_key", "private_key", { unique: false });
      objectStore.createIndex("time_index", "time_index", { unique: false });
      objectStore.createIndex("phrases", "phrases", { unique: false });
      objectStore.createIndex("videoURL", "videoURL", { unique: false });

      // init data after schema construction
      objectStore.transaction.oncomplete = function(event) {
        /* the way how query works. arg 1 is object store name, and arg2 will be
        * readonly or readwrite */
        // var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
        // for (var i in customerData) {
        //    customerObjectStore.add(customerData[i]);
        // }
      };

      var objectStore_2 =
        b2bDB.db.createObjectStore("id-metadata", {keyPath: "idNumber"});
      objectStore_2.createIndex("timestamp", "timestamp", { unique: false });

      // init data after schema construction
      objectStore_2.transaction.oncomplete = function(event) {
        /* the way how query works. arg 1 is object store name, and arg2 will be
        * readonly or readwrite */
        // var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
        // for (var i in customerData) {
        //    customerObjectStore.add(customerData[i]);
        // }
      };

    };
  }, // init_db END

  get_all_metadata : function (success_callback) {
    var transaction = b2bDB.db.transaction(["id-metadata"], "readonly");
    var objectStore = transaction.objectStore("id-metadata");
    var cursorRequest = objectStore.openCursor();
    var aggregate = [];
    cursorRequest.onsuccess = function (event){
      if (event.target.result){
        var vector = event.target.result.value;
        var object = {};
        object['timestamp'] = vector['timestamp'];
        object['idNumber'] = vector['idNumber'];
        aggregate.push(object);
        event.target.result['continue']();
      }
    };

    transaction.oncomplete = function (event) {
      if(success_callback)
        success_callback(aggregate); // return items
    };
  },

  retrieve_id_with_number : function(number, success_callback, error_callback) {
    var transaction = b2bDB.db.transaction(["id-data"], "readonly");
    var objectStore = transaction.objectStore("id-data");
    var obj = objectStore.get(number);
    obj.onsuccess = function(evt) {
      var result = evt.target.result;
      if(success_callback) {
        success_callback(result);
      }
    };

    obj.onerror = function(err) {
      if(error_callback) {
        error_callback(err);
      }
    };
  },

  store_id : function(idNumber, public_key, private_key, id_figure, id_index, id_phrase, id_video_url, success_callback) {
    var timestamp = Date.now();
    var transaction = b2bDB.db.transaction(["id-data"], "readwrite");
    var objectStore = transaction.objectStore("id-data");
    var request = objectStore.put(value_object);
    request.onsuccess = function(evt) {
      if(success_callback) {
        success_callback(evt);
      }
    };
  },

  query_db : function(objectName, options, success_callback, error_callback) {
    var transaction = b2bDB.db.transaction(["wiki-data"], "readonly");
    var objectStore = transaction.objectStore("wiki-data");
    var obj = objectStore.get(objectName);
    obj.onsuccess = function(evt) {
      var result = evt.target.result;
      if(success_callback) {
        if(options.with_data != true) {
          delete result.data;
        }
        success_callback(result);
      }
    };

    obj.onerror = function(err) {
      if(error_callback) {
        error_callback(err);
      }
    };
  },

  // for debugging
  query_db_and_set_variable : function(objectName, variable_name) {
    var transaction = b2bDB.db.transaction(["wiki-data"], "readonly");
    var objectStore = transaction.objectStore("wiki-data");
    var obj = objectStore.get(objectName);
    obj.onsuccess = function(evt) {
      var result = evt.target.result;
      eval('window.' + variable_name + ' = result;');
    };
  },

  clear_db : function (db_name) {
    var transaction = b2bDB.db.transaction([db_name], "readwrite");
    var objectStore = transaction.objectStore(db_name);
    objectStore.clear();
  },

  clear_wiki_db : function () {
    b2bDB.clear_db('wiki-data');
  },
  get_wiki_data_db_size : function(size_complete_callback) {
    b2bDB.query_all_object_from_db({ with_data : true },
      function (object_list) {
        var db_size = 0;
        var idx;
        console.log("Total " + object_list.length + " objects in DB");
        async.eachSeries(object_list, function(item, callback) {
          if(item.data != undefined) {
            db_size += item.data.length;
          }
          callback();
        }, function done() {
          size_complete_callback(db_size);
        });
      }
    );
  },

  query_all_object_from_db : function(options, success_callback) {
    var transaction = b2bDB.db.transaction(["wiki-data"], "readonly");
    var objectStore = transaction.objectStore("wiki-data");
    var cursorRequest = objectStore.openCursor();
    var aggregate = [];
    cursorRequest.onsuccess = function (event){
      if (event.target.result){
        var vector = event.target.result.value;
        if(options.type == null
           || vector['type'] == options.type) {
          var object = {};
          object.hash = vector['hash'];
          object.objectName = vector['objectName'];
          object.type = vector['type'];
          if(options.with_data == true) {
            object.data = vector['data'];
          }
          aggregate.push(object);
        }
        event.target.result['continue']();
      }
    };

    transaction.oncomplete = function (event) {
      if(success_callback)
        success_callback(aggregate); // return items
    };
  },

  add_to_db : function(value_object, success_callback) {
    var transaction = b2bDB.db.transaction(["wiki-data"], "readwrite");
    var objectStore = transaction.objectStore("wiki-data");
    var request = objectStore.put(value_object);
    request.onsuccess = function(evt) {
      success_callback(evt);
    };
  },
};
