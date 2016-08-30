var fs = require('fs');
var Chains = require('./Chains');
var edgar = {
  config : {},
  moods : {},
  moodList : [],
  currentMood : "",
  stories : {

  },
  getMood : function(mood) {
    if (!this.moods.hasOwnProperty(mood)) {
      this.moods[mood] = [];
      this.moodList.push(mood);
    }
    return this.moods[mood];
  },
  load : function(log) {
    var config = fs.readFileSync('config.js', 'utf8');
    this.config = JSON.parse(config);
    for (var v in this.config) {
      log.info('Load', 'Loading: ' + v);
      var o = this.config[v];
      var text = fs.readFileSync(o.file, 'utf8');
      this.stories[v] = {};
      this.stories[v].set = Chains.createSet();
      this.stories[v].type = o.type;
      this.stories[v].maxLength = o.maxLength;
      this.stories[v].minLength = o.minLength;
      this.stories[v].set.endChar = o.endChar;
      this.stories[v].set.joinChar = o.joinChar;
      Chains.parse(this.stories[v].set, text, true);
      for (i = 0; i < o.moods.length; ++i ) {
        this.getMood(o.moods[i]).push(v);
        this.currentMood = o.moods[i];
      }
    }
    log.info('Load', this.moods);
  },
  updateMood : function(log) {
    log.info('MOOD', "Updating Mood");
    log.info('MOOD', "Current mood: " + this.currentMood);
    var newMood = this.currentMood;
    while (newMood == this.currentMood) {
      newMood = this.moodList[Chains.rand(this.moodList.length)];
    }
    log.info('MOOD', { old: this.currentMood, new: newMood });
    this.currentMood = newMood;
  },
  getText : function( min, max, log ) {
    var options = this.moods[this.currentMood];
    var set = options[Chains.rand(options.length)];
    var act = this.stories[set];
    return { 
      text : Chains.getText( this.stories[set].set, act.minLength, act.maxLength, log),
      mood : this.currentMood,
      set : set
    };
  }
}


module.exports = edgar;
