
var Chains = {
  rand : function(max) {
    return Math.floor((Math.random() * max));
  },
  createSet : function() {
    return {
      starts : {},
      startCount : 0,
      parts : {},
      endChar: '.',
      joinChar: '\n'
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
    var set = this.createSet();
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
    
    return set;
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
    if (typeof removeSpeech == "undefined") removeSpeech = false;
    text = text.replace(/[\r\n]/g, ' ');
    var sentences = text.split('.');
    for (i = 0; i < sentences.length; ++i) {
      var line = sentences[i].trim();
      if (removeSpeech && line.indexOf('"') != -1) {
        continue;
      }
      var words = line.split(' ');
      if (words.length < 2) 
        continue;
      var first = this.getItem(set.starts, words[0].trim());
      set.startCount += 1;
      this.addNext(first, words[1].trim());
      for (j = 1; j < words.length; ++j) {
        var loc = this.getItem(set.parts, words[j].trim());
        if ( j < words.length - 1 ) {
          this.addNext(loc, words[j+1].trim());
        }
        else {
          loc.endCount += 1;
        }
      }
    }
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
    var arr = [];

    var current = this.getStart(set);
    var obj = this.getItem(set.starts, current);
    arr.push( current );
    
    while (current != '.') {
      if (typeof current == "undefined") { console.error("something goofed"); return arr.join(' '); }
      current = this.getNext(obj);
      if ( current != '.' ) {
        arr.push(current);
        obj = this.getItem(set.parts, current);
      }
    }
    return arr.join(' ') + set.endChar;
  },
  
  getText : function (set, minLength, maxLength, log) {
    log.debug('getText start');
    if (maxLength < minLength) {
      console.error("maxLength less than minLength");
      return;
    }
    var text = Chains.getSentence(set);
    while (text.length > maxLength) {
      text = Chains.getSentence(set);
    }
    while (text.length < minLength) {
      var nextText = Chains.getSentence(set);
      while ( (text + set.joinChar + nextText).length > maxLength) {
        nextText = Chains.getSentence(set);
      }
      text = text + set.joinChar + nextText;
    }
    log.debug('getText stop');
    return text;
  }
};

module.exports = Chains;
