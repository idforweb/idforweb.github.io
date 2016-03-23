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
  trace("Your browser doesn't support a stable version of IndexedDB." +
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
        trace('Error on opening database');
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
      trace('DB is initialized');
      //b2bDB.delete_stat_db('recv');
      //b2bDB.delete_stat_db('send');
      b2bDB.db.onerror = function(err) {
        trace('DB error happened');
        console.dir(err);
        throw err;
      };
      if(b2bDB.db_open_callback) {
        b2bDB.db_open_callback();
      } else {
        trace('DB open callback is undefined');
      }
    };

    // create db schema here
    req.onupgradeneeded = function(evt) {
      trace('upgrade is requested');
      b2bDB.db = evt.target.result;
      if(b2bDB.db.objectStoreNames.contains("wiki-data")) {
        b2bDB.db.deleteObjectStore('wiki-data');
      }
      if(b2bDB.db.objectStoreNames.contains("wiki-stat-recv")) {
        b2bDB.db.deleteObjectStore('wiki-stat-recv');
      }
      if(b2bDB.db.objectStoreNames.contains("wiki-stat-send")) {
        b2bDB.db.deleteObjectStore('wiki-stat-send');
      }

      var objectStore =
        b2bDB.db.createObjectStore("wiki-data", {keyPath: "objectName"});
      objectStore.createIndex("timestamp", "timestamp", { unique: false });
      objectStore.createIndex("last_modified", "last_modified", { unique: false });
      objectStore.createIndex("hash", "hash", { unique: false });
      objectStore.createIndex("data", "data", { unique: false });
      objectStore.createIndex("img_list", "img_list", { unique: false });
      objectStore.createIndex("type", "type", { unique: false });

      // init data after schema construction
      objectStore.transaction.oncomplete = function(event) {
        /* the way how query works. arg 1 is object store name, and arg2 will be
        * readonly or readwrite */
        // var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
        // for (var i in customerData) {
        //    customerObjectStore.add(customerData[i]);
        // }
      };

      /*
      var objectStore_stat_recv =
        b2bDB.db.createObjectStore("wiki-stat-recv",
                                   { keyPath: "id", autoIncrement:true });
      objectStore_stat_recv.createIndex("peerID", "peerID", { unique: false });
      objectStore_stat_recv.createIndex("objectName", "objectName", { unique: false });
      objectStore_stat_recv.createIndex("objectType", "objectType", { unique: false });
      objectStore_stat_recv.createIndex("size", "size", { unique: false });
      objectStore_stat_recv.createIndex("time", "time", { unique: false });


      var objectStore_stat_send =
        b2bDB.db.createObjectStore("wiki-stat-send",
                                   { keyPath: "id", autoIncrement:true });
      objectStore_stat_send.createIndex("peerID", "peerID", { unique: false });
      objectStore_stat_send.createIndex("objectName", "objectName", { unique: false });
      objectStore_stat_send.createIndex("objectType", "objectType", { unique: false });
      objectStore_stat_send.createIndex("size", "size", { unique: false });
      */

    };
  }, // init_db END

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
  /*
  clear_wiki_stat_db : function () {
    b2bDB.clear_db('wiki-stat-send');
    b2bDB.clear_db('wiki-stat-recv');
  },
  */
  get_wiki_data_db_size : function(size_complete_callback) {
    b2bDB.query_all_object_from_db({ with_data : true },
      function (object_list) {
        var db_size = 0;
        var idx;
        trace("Total " + object_list.length + " objects in DB");
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

  /*
  add_to_stat_db : function(value_object, success_callback) {
    var transaction = b2bDB.db.transaction(["wiki-stat-" + value_object.type],
                                           "readwrite");
    var objectStore = transaction.objectStore("wiki-stat-" + value_object.type);
    var request = objectStore.put(value_object);
    request.onsuccess = function(evt) {
      if(success_callback)
        success_callback(evt);
    };
  },

  query_stat_db : function(peerID, type, success_callback) {
    var transaction = b2bDB.db.transaction(["wiki-stat-" + type], "readonly");
    var objectStore = transaction.objectStore("wiki-stat-" + type);
    var obj = objectStore.get(peerID);
    obj.onsuccess = function(evt) {
      var result = evt.target.result;
      if(success_callback) {
        success_callback(result);
      }
    };
  },

  query_server_recv : function(success_callback) {
    var transaction = b2bDB.db.transaction(["wiki-stat-recv"], "readonly");
    var objectStore = transaction.objectStore("wiki-stat-recv");
    var cursorRequest = objectStore.openCursor();
    var aggregate = [];
    cursorRequest.onsuccess = function (event){
      if (event.target.result){
        if(event.target.result.value['peerID'] &&
           event.target.result.value['peerID'] == 'server'){
          aggregate.push(event.target.result.value);
        }
        event.target.result['continue']();
      }
    };

    transaction.oncomplete = function (event) {
      if(success_callback)
        success_callback(aggregate); // return items
    };
  },

  query_peer_recv : function(success_callback) {
    var transaction = b2bDB.db.transaction(["wiki-stat-recv"], "readonly");
    var objectStore = transaction.objectStore("wiki-stat-recv");
    var cursorRequest = objectStore.openCursor();
    var aggregate = [];
    cursorRequest.onsuccess = function (event){
      if (event.target.result){
        if(event.target.result.value['peerID'] &&
           event.target.result.value['peerID'] != 'server'){
          aggregate.push(event.target.result.value);
        }
        event.target.result['continue']();
      }
    };

    transaction.oncomplete = function (event) {
      if(success_callback)
        success_callback(aggregate); // return items
    };
  },
  query_peer_sent : function(success_callback) {
    var transaction = b2bDB.db.transaction(["wiki-stat-send"], "readonly");
    var objectStore = transaction.objectStore("wiki-stat-send");
    var cursorRequest = objectStore.openCursor();
    var aggregate = [];
    cursorRequest.onsuccess = function (event){
      if (event.target.result){
        if(event.target.result.value['peerID'] &&
           event.target.result.value['peerID'] != 'server'){
          aggregate.push(event.target.result.value);
        }
        event.target.result['continue']();
      }
    };

    transaction.oncomplete = function (event) {
      if(success_callback)
        success_callback(aggregate); // return items
    };
  },


  delete_stat_db : function(type) {
    var transaction = b2bDB.db.transaction(["wiki-stat-" + type], "readwrite");
    var objectStore = transaction.objectStore("wiki-stat-" + type);
    objectStore.clear();
  },
  */
};
