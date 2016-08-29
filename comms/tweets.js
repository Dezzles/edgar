Twitter = require('twitter');
var Tweets = {
  client : new Twitter( {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  }),
  post : function(tweet, log) {
    log.info(tweet);
    this.client.post('statuses/update', {status: tweet.text},  function(error, tweet, response) {
      if(error){
        // console.log( error );
        log.error( error );
      }
      // log.info(response);
      log.info('Tweet sent');
    })
  }

};

module.exports = Tweets;
