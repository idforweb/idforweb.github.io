"use strict";
// Create namespace
var Util = Util || {
  // For both client and server
  str2u8 : function (str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen = str.length; i<strLen; ++i) {
      bufView[i] = str.charCodeAt(i);
    }
    return bufView;
  },
  u82str : function (u8) {
    return String.fromCharCode.apply(null, u8);
  },
  str2ab : function(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  },
  ab2str : function(ab) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  },
  str_deflate : function(str) {
    var str_output = Util.pako.deflate(str.toString(), {
      raw : true,
      to: 'string',
      level : 1,
      memLevel : 9,
      windowBits : 15,
      strategy : 0,
    });
    return str_output;
  },
  str_inflate : function(str) {
    var str_output = Util.pako.inflate(str.toString(), {
      raw : true,
      to: 'string',
      windowBits : 15,
    });
    return str_output;
  },

  use_base64  : false,
  use_zip     : true,
  crypto      : undefined,
  pako        : undefined,

  atob : function(str) {
    str = str.toString();
    if(Util.check_nodejs()) {
      return new Buffer(str, 'base64');
    }
    else {
      return atob(str);
    }
  },

  btoa : function(str) {
    str = str.toString();
    if(Util.check_nodejs()) {
      return new Buffer(str, 'binary').toString('base64');
    }
    else {
      return btoa(str);
    }
  },

  just_zip : function(str) {
    // Apply zip if used
    var zipped_str = str;
    if(Util.use_zip) {
      zipped_str = Util.str_deflate(str);
    }

    // Apply base64 if used
    if(Util.use_base64) {
      return Util.btoa(zipped_str);
    } else {
      return zipped_str;
    }
  },

  just_unzip : function(str) {
    // Translate if use base64
    var real_str = str;
    if(Util.use_base64) {
      real_str = Util.atob(str);
    }

    // Unzip if use zip
    var unzip_str = real_str;
    if(Util.use_zip) {
      unzip_str = Util.str_inflate(real_str);
    }
    return unzip_str;
  },

  json_and_zip : function(str) {
    // Build JSON string
    var json_str = JSON.stringify(str);

    // Apply zip if used
    var zipped_str = json_str;
    if(Util.use_zip) {
      zipped_str = Util.str_deflate(json_str);
    }

    // Apply base64 if used
    if(Util.use_base64) {
      return Util.btoa(zipped_str);
    } else {
      return zipped_str;
    }
  },

  unzip_and_parse : function(str) {
    // Translate if use base64
    var real_str = str;
    if(Util.use_base64) {
      real_str = Util.atob(str);
    }

    // Unzip if use zip
    var json_str = real_str;
    if(Util.use_zip) {
      json_str = Util.str_inflate(real_str);
    }

    return JSON.parse(json_str);
  },

  raw_async_unzip_and_parse : function(str, callback) {
    setTimeout(function() {
      callback(Util.unzip_and_parse(str));
    }, 0);
  },
  async_unzip_and_parse : function(str, callback) {
      setTimeout(function() {
        callback(Util.unzip_and_parse(str));
      }, 1);
  },

  async_json_and_zip : function(str, callback) {
    setTimeout(function() {
      callback(Util.json_and_zip(str));
    }, 1);
  },

  async_just_zip : function(str, callback) {
    setTimeout(function() {
      callback(Util.just_zip(str));
    }, 0);
  },

  async_just_unzip : function(str, callback) {
    setTimeout(function() {
      callback(Util.just_unzip(str));
    }, 0);
  },

  check_nodejs : function() {
    if (typeof module !== 'undefined' && module.exports) {
      return true;
    }
    else {
      return false;
    }
  },

  initialize : function() {
    // If nodejs
    if(Util.check_nodejs()) {
    }
    else {
      Util.pako = pako;
      Util.is_node = false;
      Util.is_web = true;
    }
  }
};

Util.initialize();
