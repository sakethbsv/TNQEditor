/*
  This file is part of MuLTiFlow.

  MuLTiFlow is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  MuLTiFlow is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with MuLTiFlow.  If not, see <http://www.gnu.org/licenses/>.
*/
var e$ = new TUXExtractor();
function TUXExtractor() {
    this.getDocAsString = function() {
	var doc = m$.Editor().contentDocument;
	if(!($(doc.body).is(":visible"))) {
	    doc = m$.Browser().contentDocument;
	}
	var str = "";
	var xpathResult = doc.evaluate(".//text()",doc.body,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
	for (var i = 0; i < xpathResult.snapshotLength; i++) {
	    str += " " + xpathResult.snapshotItem(i).nodeValue;
	};
	return str;
    };

    this.getSingleLetterVariables = function() {
	var doc = m$.Editor().contentDocument;
	if(!($(doc.body).is(":visible"))) {
	    doc = m$.Browser().contentDocument;
	}
	var str = "";
	var xpathResult = doc.evaluate(".//text()",doc.body,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
	for (var i = 0; i < xpathResult.snapshotLength; i++) {
	    var t = xpathResult.snapshotItem(i).nodeValue;
	    if(t.match(/^[a-z]$/)) {
		str += "{" + xpathResult.snapshotItem(i).nodeValue + "}";
	    }
	};
	m$.CodeArea().value = str;
    };

    this.outputToCodeArea = function(ca) {
	var app = "";
	for (var j = 0; j < ca.length; j++) {
	    app += "{" + ca[j][0] + " : " + ca[j][1] + "} ";
	}
	m$.CodeArea().value = app;
    };

    this.outputWordFreq = function()  {
	var str = e$.getDocAsString();
	var ca = e$.sortwc(e$.wc(str));
	e$.outputToCodeArea(ca);
    };

    this.outputHyphenWords = function() {
	var str = e$.getDocAsString();
	var ca = e$.hyphenWords(str);
	e$.outputToCodeArea(ca);
    };


    this.outputSpacedWords = function() {
	var str = e$.getDocAsString();
	var ca = e$.spacedWords(str);
	e$.outputToCodeArea(ca);
    };

    this.outputBritishAmericanWords = function() {
	var str = e$.getDocAsString();
	var ca = e$.BritishAmericanWords(str);
	e$.outputToCodeArea(ca);
    };

    this.outputProperNounWords = function() {
	var str = e$.getDocAsString();
	var ca = e$.ProperNounWords(str);
	e$.outputToCodeArea(ca);
    };


    this.hyphenWords = function(str) {
	var ca = e$.sortwc(e$.wc(str));
	var ha = [];
	for (var j = 0; j < ca.length; j++) {
	    if(ca[j][1].match(/\-/)) {
		ha.push([ca[j][0], ca[j][1]]);
	    }
	}
	return ha;
    };

    this.spacedWords = function(str) {
	var ca = e$.sortwc(e$.wc(str));
	var ha = [];
	for (var j = 0; j < ca.length; j++) {
	    if(ca[j][1].match(/ /)) {
		ha.push([ca[j][0], ca[j][1]]);
	    }
	}
	return ha;
    };

    this.BritishAmericanWords = function(str) {
	var ca = e$.sortwc(e$.wc(str));
	var ha = [];
	for (var j = 0; j < ca.length; j++) {
	    if(ca[j][1].match(/yze|yse|i[zs]ation|(our|or)$|ae|oe|xion|(re|er)$/)) {
		ha.push([ca[j][0], ca[j][1]]);
	    }
	}
	return ha;
    };

    this.ProperNounWords = function(str) {
	var ca = e$.sortwc(e$.Mwc(str));
	var ha = [];
	for (var j = 0; j < ca.length; j++) {
	    ha.push([ca[j][0], ca[j][1]]);
	}
	return ha;
    };


    this.sortwc = function(map) {
	var ca = [];
	for (var word in map) {
	    ca.push([map[word], word]);
	    /*---convert hyphenated word to closeup word??? what if more than one hyphen--*/
	    word = word.replace(/\-/,"");
	    /*---convert closedup word to word-spaced word and check--*/
	    for (var i=1; i < word.length; i++) {
		var sword = word.substring(0,i) + " " + word.substring(i);
		var splitWordRegExp = new RegExp("(?=\\b)" + sword + "(?=\\b)");
		var splits = e$.getDocAsString().match(splitWordRegExp);
		if(splits) {
		    ca.push([splits.length , sword]);
		}
	    }
	}
	ca.sort(function(a, b) {
		return a[0] - b[0];
	    });
	return ca;
	
    };

    this.Mwc = function(str) {
	var sa = str.match(/(?=\b)(.{15,})(?=\b.*\1)/gi);
	var map = {};
	if(sa) {
	    for (var i = 0; i < sa.length; i++) {
		var w = sa[i];
		if(!(w.match(/^\s*(it|can|will|would|could|by|be|a|the|in|of|is|was|from|to|but|some|new|old|can|what|why|when|a|we|no|do|this|that|then|go|went)\s+(it|can|will|would|could|by|be|a|the|in|of|is|was|from|to|but|some|new|old|can|what|why|when|a|we|no|do|this|that|then|go|went)\s*$/i))) {
		    var count = map[w];
		    if (count == null) count = 1;
		    count++;
		    map[w] = count;
		}
		else { logMessage("common phrase: " + w);}
	    }
	}
	return map;
    };

    this.PNwc = function(str) {
	var sa = str.match(/(?=\b)[A-Z][A-Za-z\-]+(?=\b)/g);
	var map = {};
	for (var i = 0; i < sa.length; i++) {
	    var w = sa[i];
	    if(!(w.match(/^(the|in|of|is|form|to|but|some|new|old|can|what|why|when|a|we|no|do|this|that|then)$/i))) {
		var count = map[w];
		if (count == null) count = 0;
		count++;
		map[w] = count;
	    }
	}
	return map;
    };

    this.Hwc = function(str) {
	m$.CodeArea().value = str;
	var sa = str.match(/(?=\b)([a-z\-]+)(?=\b(?:.*\1\b){4,})/gi);
	var map = {};
	for (var i = 0; i < sa.length; i++) {
	    var w = sa[i];
	    if(!(w.match(/^(it|this|that|he|she|his|we|they|their|can|will|would|could|by|be|a|an|the|in|of|is|was|were|from|to|for|have|has|had|been|so|with|at|in|inside|between|versus|etc[.]?|e.g.|example|as|but|whether|where|whereas|moreover|firstly|secondly|thirdly|fourthly|one|two|three|four|then|can|what|why|when|how|and|or|do|come|go|went)$/i))) {
		var count = map[w];
		if (count == null) count = 0;
		count++;
		map[w] = count;
	    }
	}
	return map;
    };

    this.wc = function(str) {
	var sa = str.match(/[a-z\-]+/gi);
	var map = {};
	for (var i = 0; i < sa.length; i++) {
	    var w = sa[i].toLowerCase();
	    if(!(w.match(/^(it|this|that|he|she|his|we|they|their|can|will|would|could|by|be|a|an|the|in|of|is|was|were|from|to|for|have|has|had|been|so|with|at|in|inside|between|versus|etc[.]?|e.g.|example|as|but|whether|where|whereas|moreover|firstly|secondly|thirdly|fourthly|one|two|three|four|then|can|what|why|when|how|and|or|do|come|go|went)$/))) {
		var count = map[w];
		if (count == null) count = 0;
		count++;
		map[w] = count;
	    }
	}
	return map;
    };


    this.checkSpelling =  function(word) {
	// Different versions of Firefox have different contract IDs
	var spellclass = "@mozilla.org/spellchecker/myspell;1";
	if ("@mozilla.org/spellchecker/hunspell;1" in Components.classes)
	    spellclass = "@mozilla.org/spellchecker/hunspell;1";
	if ("@mozilla.org/spellchecker/engine;1" in Components.classes)
	    spellclass = "@mozilla.org/spellchecker/engine;1";
	    
	gSpellCheckEngine = Components.classes[spellclass].createInstance(Components.interfaces.mozISpellCheckingEngine);
	var lang = m$.getPref("general.useragent.locale");
	gSpellCheckEngine.dictionary = lang;
	var check = false;
	if (gSpellCheckEngine.check(word))
	    {
		// It's spelled correctly
		check = true;
	    }
	else
	    {
		// It's spelled incorrectly but check if the user has added "kat" as a correct word..
		var mPersonalDictionary = Components.classes["@mozilla.org/spellchecker/personaldictionary;1"]
		.getService(Components.interfaces.mozIPersonalDictionary);
		if (mPersonalDictionary.check(word, gSpellCheckEngine.dictionary))
		    {
			// It's spelled correctly according to the user's personal dictionary
			check = true;
		    }
		else
		    {
			// It's spelled incorrectly
		    }
	    }						

	return check;
    }

    this.suggestCorrectAlternatives = function(word) {
	// Different versions of Firefox have different contract IDs
	var spellclass = "@mozilla.org/spellchecker/myspell;1";
	if ("@mozilla.org/spellchecker/hunspell;1" in Components.classes)
	    spellclass = "@mozilla.org/spellchecker/hunspell;1";
	if ("@mozilla.org/spellchecker/engine;1" in Components.classes)
	    spellclass = "@mozilla.org/spellchecker/engine;1";
	    
	gSpellCheckEngine = Components.classes[spellclass].createInstance(Components.interfaces.mozISpellCheckingEngine);
	var suggestions = {};
	gSpellCheckEngine.suggest(word, suggestions, {}); 
	if (suggestions.value) {
	    // suggestions.value is a JavaScript Array of strings
	    // there were suggestions.value.length suggestions found
	}
	return suggestions.value;
    }

    this.spellCheckDoc = function() {

	$(m$.Editor().contentDocument).find("*").contents()
	.filter( function() { return this.nodeType == 3; } )
	.replaceWith(function () { return this.nodeValue.replace(/(?=\b)([a-z]+\-[a-z]+)(?=\b)/gi,"<hyph>$1</hyph>")
	    });
    }


}


