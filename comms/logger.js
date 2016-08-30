var process=require('process');
var LogOutput = {
  post : function(tweet, log) {
    log.info('TWEET', tweet);
  }
};
console.log("Key: " + process.env.CONSUMER_KEY);
module.exports = LogOutput;
