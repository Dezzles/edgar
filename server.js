var schedule = require('node-schedule');
var Twitter = require('twitter');
var Chains = require('./Chains');
var fs = require('fs');
var uuid = require('uuid');
var argv = require('yargs').argv;
var Edgar = require('./edgar.js');

var Logger = require('./dlog');
var log = Logger.instance();
Edgar.load(log);
Edgar.updateMood(log);
var comms;
if ( argv._.indexOf('debug') > -1 ) {
  comms = require('./comms/logger.js');
  console.log('Using Logger only');
}
else {
  comms = require('./comms/tweets.js');
  console.log('Using Twitter');
}


var rules = [];

var postTweet = function() {
  var logobj = Logger.instance();
  logobj.info('TWEET', 'Starting update');
  var tweet = Edgar.getText(50, 140, logobj);
  comms.post(tweet, logobj);
  if (Chains.rand(100) < 20) {
    Edgar.updateMood(logobj);
  }
};
if (argv.t) {
  for (v = 0; v < 20; ++ v) {
    postTweet();
  }
}
var jobs = [];
var tweetsPerHour = 4;
var tweetTimer = 60 / tweetsPerHour;
if (argv.f) {
  tweetTimer = argv.f;
  tweetsPerHour = 60 / tweetTimer;
}
log.info("INIT", "Frequency set to " + tweetTimer);
log.info("INIT", "Tweets per hour: " + tweetsPerHour);
for (var v = 0; v < tweetsPerHour; ++v ) { 
  var rule = new schedule.RecurrenceRule();
  rule.minute = v * tweetTimer;
  jobs.push(schedule.scheduleJob(rule, postTweet));
}
