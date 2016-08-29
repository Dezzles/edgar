var process=require('process');
var LogOutput = {
  post : function(tweet, log) {
    log.info(tweet);
  }
};
console.log("Key: " + process.env.CONSUMER_KEY);
module.exports = LogOutput;
