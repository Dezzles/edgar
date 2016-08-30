var uuid = require('uuid');
var bunyan = require('bunyan');

var log = bunyan.createLogger({
  name : 'edgarAppletPoe',
  streams: [
    {
      level: 'info',
      path: '/logs/dezzles/edgar/info.log'
    },
    {
      level: 'info',
      stream: process.stdout
    }
  ]
});

var logger = {
  instance : function() {
    var res = { 
      log : log, uuid : uuid.v1(),
      doLog : function(fn, type,  msg) {
        var obj = { uuid : this.uuid, type: type.toUpperCase(), message: "" };
        if ( ( typeof msg == "object" ) && !(msg instanceof Array) )  {
          for (var v in msg) {
            if (msg.hasOwnProperty(v)) {
              obj[v] = msg[v];
            }
          }
        }
        else {
          obj.message = msg;
        }
        fn.apply(this.log, [ obj ]);
      }, 
      info : function(type, msg) {
        this.doLog(this.log.info, type, msg);
      },
      error : function(type, msg) {
        this.doLog(this.log.error, type, msg);
      },
      debug : function(type, msg) {
        this.doLog(this.log.debug, type, msg);
      }
    };
    res.self = res;
    return res;
  }
 

};


module.exports = logger;
