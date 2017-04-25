var rita = require('rita');
var Chains = {
  order : 6,
  rand : function(max) {
    return Math.floor((Math.random() * max));
  },
  createSet : function() {
    return {
      starts : {},
      startCount : 0,
      parts : {},
      endChar: '.',
      joinChar: '\n',
	  markov : null
    };
  },
  
  getItem : function (obj, text)  {
    if (!obj.hasOwnProperty(text)) {
      obj[text] = {
        next : {},
        total : 0,
        endCount : 0,
        text: text
      }
    }
    return obj[text];
  },
  merge : function ( list ) {
    /*var set = this.createSet();
    for (v = 0; v < list.length; v++) {
      var lst = list[v];
      set.startCount += list[v].startCount;
      for (i in lst.starts) {
        var item = this.getItem(set.starts, i);
        item.endCount += lst.starts[i].endCount;
        for (j in lst.starts[i].next) {
          this.addNext(item, j, lst.starts[i].next[j]);
        }
      }
      for (i in lst.parts) {
        var item = this.getItem(set.parts, i);
        item.endCount += lst.parts[i].endCount;
        for (j in lst.parts[i].next) {
          this.addNext(item, j, lst.parts[i].next[j]);
        }
      }
    }
    
    return set;/**/
  },
  addNext : function (current, next, c) {
    if (typeof c == "undefined") c = 1;
    if (!current.next.hasOwnProperty(next)) {
      current.next[next] = 0;
    }
    current.next[next] += c;
    current.total += c;
  },
  parse : function(set, text, removeSpeech) {
	set.markov = new rita.RiMarkov(this.order);
	set.markov.loadText(text);
  },
  
  getNext : function( obj ) {
    var searchCount = obj.endCount + obj.total;
    var item = this.rand(searchCount);
    if (item < obj.endCount) 
      return '.';
    
    item = item - obj.endCount;
    
    for (var v in obj.next) {
      if (item < obj.next[v]) {
        return v;
      }
      item -= obj.next[v];
    }
  },
  
  getStart : function(set) {
    var item = this.rand(set.startCount);
    for (var v in set.starts) {
      if (item < set.starts[v].total) {
        return v;
      }
      item -= set.starts[v].total;
    }
  },
  
  getSentence : function(set) {
    return set.markov.generateSentences(1).join(set.joinChar);
  },
  
  getText : function (set, minLength, maxLength, log) {
    log.info('update', 'Generating text');
    if (maxLength < minLength) {
      log.error('update', "maxLength less than minLength");
      return;
    }
    var text = null;
	var tries = 5;
	while ((tries > 0) && (text == null)) {
		var newText = set.markov.generateSentences(tries).join(set.joinChar);
		if (newText <= maxLength) {
			text = newText;
		}
		--tries;
	}
	while (text == null ) {
		var newText = set.markov.generateSentences(1).join(set.joinChar);
		if (newText <= maxLength) {
			text = newText;
		}
	}
	log.info('New Message', newText);
    return text;
  }
};

module.exports = Chains;
