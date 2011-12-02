/*    This file is part of MuLTiFlow.

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

var o$ = new OWL();


function OWL() {

    this.reportPopAuthorInMendeley = function() {
	var owlHtml = m$.getPopAuthorInMendeley();
	var url = "chrome://multiflow/content/dialogs/owl.xul";
	var prefs = "width=300,height=300";
	var w = window.openDialog(url,"Mendeley_Report", prefs, owlHtml);
    }

    this.reportOIDs = function() {
	var owlHtml = o$.getOIDreport();
	owlHtml = owlHtml + o$.getOIDhrefReport();
	var url = "chrome://multiflow/content/dialogs/owl.xul";
	var prefs = "width=300,height=300";
	var w = window.openDialog(url,"OWL_Report", prefs, owlHtml);
    }

    this.getOIDreport = function() {
	var doc = m$.Editor().contentDocument;
	var oidNodes = $(doc).find("[id]").filter(function() {
		return this.id.match(/^oid[.][.]/);
	    });
	var base2ext = {};
	var id2txt = {};
	oidNodes.each(function () {
		var id = this.id;
		var base = id.replace(/^oid[.][.]([^.]+).*$/,"$1");
		var ext;
		if(id.match(/^oid[.][.]([^.]+)[.]([^.]+)$/)) {
		    ext = id.replace(/^oid[.][.]([^.]+)[.]([^.]+)$/,"$2");
		}
		if(base2ext[base]) {
		    base2ext[base] = base2ext[base] + "," + ext;
		}
		else {
		    base2ext[base] = ext;
		}
		id2txt[id] = $(this).html();
	    });
	var tableCaption = "<p class='TableCaption'>Report on OWL IDs: (a) OIDs and their children</p>\n";
	var owlHtml = tableCaption;
	for(var base in base2ext) {
	    if(base2ext[base]) {
		var baseHtml = "<tr><th colspan='" + base2ext[base].split(",").length + "'>" + base + "</th></tr>";
		var extHtml = "<tr><th>" + base2ext[base].replace(/,/g,"</th><th>") + "</th></tr>";
		var txtHtml = "<tr>";
		var exts = base2ext[base].split(",");
		for(var i in  exts) {
		    var id = "oid.." + base + "." + exts[i];
		    txtHtml = txtHtml + "<td>" + id2txt[id] + "</td>";
		}
		txtHtml = txtHtml + "</tr>";
		owlHtml = owlHtml + "<table>" + baseHtml + extHtml + txtHtml + "</table>";
	    }
	    else {
		var id = "oid.." + base;
		owlHtml = owlHtml + "<table><tr><th>" + base + "</th></tr>";
		owlHtml = owlHtml + "<tr><td>" + id2txt[id] + "</td></tr></table>";
	    }
	}
	return owlHtml;
    }

    this.getOIDhrefReport = function() {
	var doc = m$.Editor().contentDocument;
	var oidNodes = $(doc).find("[href]").filter(function() {
		return $(this).attr("href").match(/^rel:/);
	    });

	var owlHtml = "";
	var tableCaption = "<p class='TableCaption'>Report on OWL IDs: (b) Relationships between OIDs</p>\n";
	owlHtml = owlHtml + tableCaption + "<table>";

	oidNodes.each(function () {
		var href = $(this).attr("href");
		href = href.replace(/%([0-9A-F]+)/gi,"&#x$1;");
		href = href.replace(/&#x20;/gi," ");
		if(href.match(/\[/)) {
		    href = href.replace(/^(rel:[^:])\s+/gi,"$1</th><th>");
		}
		else {
		    href = href.replace(/\s+/gi,"</th><th>");
		}
		owlHtml = owlHtml + "<tr><th>" + href + "</th>";
		owlHtml = owlHtml + "<td>" + $(this).html() + "</td></tr>";
	    });

	owlHtml = owlHtml + "</table>";
	return owlHtml;
    }


    this.reportAllLinks = function() {
	var doc = m$.Editor().contentDocument;
	var report = "<table>";
	var idNodes = $(doc).find("[id]");
	var idHrefNodes = $(doc).find("[href]");
	var reportMisc = "<tr>";
	var map = {};
	idNodes.each(function (){
		var id = this.id;
		report = report + "<tr><th>" + id + "</th><td>";
		idHrefNodes.each(function (){
			if($(this).attr("href").match(/^#/)) {
			    var hrefSrc = $(this).attr("href").replace(/^#/,"");
			    if(id == hrefSrc) {
				report = report + $(this).html() + ", ";
			    }
			}
		    });
		report = report + "</td></tr>";
	    });
	report = report + "</table>";

	var errHrefs = "";
	alert(idHrefNodes.length);
	idHrefNodes.each(function (){
		if($(this).attr("href").match(/^#/)) {
		    var hrefSrc = $(this).attr("href").replace(/^#/,"");
		    alert(hrefSrc);
		    var hrefHasID = false;
		    idNodes.each(function (){
			    var id = this.id;
			    if(id == hrefSrc) {	
				hrefHasID = true;
			    }
			});
		    if(hrefHasID == false) {
			errHrefs = errHrefs + hrefSrc + ", ";
		    }
		}
	    });
	if(errHrefs != "") {
	    var errorHrefs = "<table><tr><td>" + errHrefs + "</td></tr></table>";
	    var errorMsg = "<p>Errors: links pointing to non-existent IDs</p>\n";
	    report = report + errorMsg + errorHrefs;
	}

	return report;
    }

    this.POStag = function(sentence) {
	function tagText(tag,text) {
	    var str = "<" + tag + ">" + text + "</" + tag + ">";
	    return str;
	}
	m$.logMessage("Lexer ...");
	var words = new Lexer().lex(sentence);
	m$.logMessage("POStagger ...");
	var taggedWords = new POSTagger().tag(words);
	m$.logMessage("POStagger ... exit");
	var str = "";
	for (i in taggedWords) {
	    var taggedWord = taggedWords[i];
	    var word = taggedWord[0];
	    var tag = taggedWord[1];
	    str = str + " " + tagText(tag,word);
	}
	str = str.replace(/^ /,"");
	alert(str);
	return str;
    }

   /*---end-of-owl--*/
}