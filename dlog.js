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
      doLog : function(fn, msg) {
        var obj = { uuid : this.uuid };
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
      info : function(msg) {
        this.doLog(this.log.info, msg);
      },
      error : function(msg) {
        this.doLog(this.log.error, msg);
      },
      debug : function(msg) {
        this.doLog(this.log.debug, msg);
      }
    };
    res.self = res;
    return res;
  }
 

};


module.exports = logger;
