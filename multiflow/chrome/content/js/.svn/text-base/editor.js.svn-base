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

const PR_WRONLY = 0x02;
const PR_RDWR = 0x04;
const PR_CREATE_FILE = 0x08;
const PR_APPEND = 0x10;
const PR_TRUNCATE = 0x20;

var m$ = new MuLTiFlow();

function MuLTiFlow() {

    this.editMode=0;
    this.el;
    this.md;
    this.pd;
    this.xoff=0;
    this.yoff=60;
    this.px;
    this.py;
    this.req;
    this.focused;


    this.Browser = function() {
	return m$.gid("browser-iframe");
    }

    this.Editor = function() {
	return m$.gid("editor-iframe");
    };

    this.Scratch = function() {
	return m$.gid("scratch-iframe");
    };

    this.ParaStyleBox = function() {
	return m$.gid("parastyle");
    };

    this.CodeArea = function() {
	return m$.gid("parahtml");
    };

    this.CodeWindow = function() {
	return m$.gid("code-window");
    };

    this.InsertBox = function() {
	return m$.gid("markup-fragment");
    };

    this.UrlBox = function() {
	return m$.gid("browser-urlbox");
    };

    this.url = function(spec) {
	var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
	return ios.newURI(spec, null, null);
    };



    this.Init = function() {
	m$.Scratch().contentDocument.body.innerHTML = "<p>Scratch pad for rough work.</p><p>Scratch pad for rough work.</p>";
	window.addEventListener("resize",m$.OnResize, false);
	window.addEventListener("close", m$.OnClose, false);
	window.addEventListener("keypress", m$.windowKeyPressHandler, false);
	m$.initEditor();
	m$.Editor().src = m$.url("chrome://multiflow/locale/MuLTiFlow.html");
	m$.closeFile();
	m$.closeFile();
	$(m$.CodeWindow()).hide();
	m$.updatePrefs();
	m$.setGoogleScholarPreferences();
    };

    this.windowKeyPressHandler = function(evt) {
	evt.stopPropagation();
    };

    this.initEditor = function() {
	$(m$.Browser()).hide();
	$(m$.Scratch()).hide();
	$(m$.Editor()).show();
	m$.optionCodeWindow();
	m$.editMode = 1;
    };

    this.initBrowser = function() {
	$(m$.Editor()).hide();
	$(m$.Scratch()).hide();
	$(m$.Browser()).show();
	$(m$.CodeWindow()).hide();
	var frame = m$.Browser();
	frame.addEventListener("DOMContentLoaded", function(evt) { m$.BrowserScrapper(); }, false);
	m$.editMode = 0;
    };

    this.initScratch = function() {
	$(m$.Browser()).hide();
	$(m$.Editor()).hide();
	$(m$.Scratch()).show();
	$(m$.CodeWindow()).show();
	m$.makeScratchable();
	m$.editMode = 2;
    };

    this.OnResize = function(evt) {
	var w = window;
	if(w.name == "Preferences") { w = w.opener; }
	var wd = w.innerWidth - 40;
	$(m$.Editor().contentDocument ).find('body').css('width', wd);

	if(wd > 500) {
	    $(m$.CodeWindow()).find("#parahtml").attr('cols', "80");
	    $(m$.CodeWindow()).find("#markup-fragment").attr('size', "30");
	}
	else {
	    $(m$.CodeWindow()).find("#parahtml").attr('cols', "25");
	    $(m$.CodeWindow()).find("#markup-fragment").attr('size', "15");	    
	}
    };


    this.OnClose = function(evt) {
	if(confirm("This will close the application. Thanks for using MuLTiFlow!!")) {
	    if(m$.editMode != 1) {
		m$.initEditor();
	    }
	    var ifr = m$.Editor();
	    if(ifr.src == null || ifr.src.spec != "chrome://multiflow/locale/MuLTiFlow.html") {
		if(confirm("Save the file?")) {
		    m$.saveCurrentFile();
		}
	    }
	    window.close();
	    if(!(window.navigator.userAgent.match(/Firefox/i))) {
		m$.quitMuLTiFlow(false);
	    }
	}
	else {
	    evt.preventDefault();
	}
    };

    this.closeFile = function() {
	if(m$.editMode == 1) {
	    var ifr = m$.Editor();
	    if(ifr.src == null || ifr.src.spec != "chrome://multiflow/locale/MuLTiFlow.html") {
		if(confirm("Save the file?")) {
		    m$.saveCurrentFile();
		}
	    }
	    m$.initBrowser();
	}
	else {
	    m$.initEditor();
	}
    };

    this.printDoc = function() {
	var settings = PrintUtils.getPrintSettings();
	// from chrome://global/content/printUtils.js
	if(m$.editMode == 0) {
	    m$.Browser().contentWindow.print(settings, null);
	}
	else {
	    if(m$.editMode == 1) {
		m$.Editor().contentWindow.print(settings, null);
	    }
	    else {
		m$.Scratch().contentWindow.print(settings, null);
	    }
	}
    };

    this.printPreview = function() {
	var settings = PrintUtils.getPrintSettings();
	// from chrome://global/content/printUtils.js
        PrintUtils.printPreview(settings, null, m$.Editor().contentWindow);
	if(confirm("Do you want to exit this preview?")) {
	    PrintUtils.exitPrintPreview();
	}
    }


    this.showPrefs = function() {
	//var features = "centerscreen=yes,toolbar=no,menubar=no,personalbar=no,scrollbars=no,resizable=yes,dependent=yes,chrome=yes,modal=yes";
	var features = "chrome=yes,menubar=yes,modal=yes,minimizable=yes,resizable=yes,width=500,height=1000";
	//var features = "all=no,modal=yes,chrome=yes";
	var prefName = "Preferences-XUL";
	if(window.navigator.userAgent.match(/Firefox/i)) { prefName ="Preferences"; }
	var r = window.open("chrome://multiflow/content/preferences.xul", prefName, features);
    }

    this.updatePrefs = function() {
	m$.optionCodeWindow();
	m$.updateDocumentMetaData();
	m$.updateDocumentStyles();
	var evt = null;
	m$.OnResize(evt);
    }

    this.updateDocumentMetaData = function() {
	var title = m$.getPref("docTitle");
	var author = m$.getPref("author");
	var doc = m$.Editor().contentDocument;
	$(doc).find("title").html(title);
	$(doc).find("meta[name='author']").attr('content',author);
    }

    this.updateDocumentStyles = function() {
	var styleTheme = m$.getPref("styleTheme");
	var jdoc = $(m$.Editor().contentDocument);
	var chromePath = m$.getChromePath();
	var styleSheet = "file://" + chromePath + "/skin/document/tux-" + styleTheme + ".css";
	jdoc.find("#webcss").attr("href",styleSheet);
	//var cols = m$.getPref("columns");
	//m$.makeColumns(cols);
	m$.refreshEditor();

    }

    this.updateDocumentMetaDataToPrefs = function(title,author) {
	var doc = m$.Editor().contentDocument;
	var title = $(doc).find("title").html();
	var author = $(doc).find("meta[name='author']").attr('content');
	m$.setPref("docTitle", Components.interfaces.nsISupportsString, title);
	m$.setPref("author", Components.interfaces.nsISupportsString, author);
    }

    this.biggerFontSize = function() {
	m$.el = m$.Editor().contentWindow.getSelection().anchorNode;
	if(m$.el.childNodes.length > 0 && m$.el.nodeName.match(/^g$/i)) {
	    var vnode = m$.getSVGObjectFromGroup();
	    m$.rescaleSVGNode(vnode,1.5);
	}
	else {
	    var fontsize = parseInt($(m$.cPara()).css("font-size"))*1.5;
	    $(m$.cPara()).css("font-size", fontsize);
	}
    }

    this.smallerFontSize = function() {
	m$.el = m$.Editor().contentWindow.getSelection().anchorNode;
	if(m$.el.childNodes.length > 0 && m$.el.nodeName.match(/^g$/i)) {
	    var vnode = m$.getSVGObjectFromGroup();
	    m$.rescaleSVGNode(vnode,0.7);
	}
	else {
	    var fontsize = parseInt($(m$.cPara()).css("font-size"))/1.5;
	    //var lineheight = parseInt($(m$.cPara()).css("line-height"))/1.5;
	    $(m$.cPara()).css("font-size", fontsize);
	    //$(m$.cPara()).css("line-height", lineheight);
	}
    }


    this.any2html = function(fp) {
	var abiwordPath = m$.getPref("abiwordPath");
	var args;
	var f = fp.replace(/[.][a-z]+$/,"");
	//Switch for each filetype depending on file extension///
	var ext = fp.replace(/^.*[.]([a-z]+)$/i,"$1").toLowerCase();
	switch(ext) {
	case "docx":
	case "odt":
	case "doc":
	case "rtf":
	    args = ["--to=html",fp];
	cmm$.runShellCommand(abiwordPath,args);
	f = f + ".html";
	break;

	case "tex":
	    args = ["--destination=" + f + ".xml", fp];
	    cmm$.runLaTeXML(args);
	    args = ["--destination=" + f + ".xhtml", f + ".xml"];
            cmd$.runLaTeXMLpost(args);
	    f = f + ".xhtml";
	    break;
	
	default:
	    alert("Unknown file extension...opening as HTML");
	    f = fp;
	    break;
	}
   
	return f;

    }

    this.surf4Selection = function(surfer) {
	var surfURL = m$.surf4URL(surfer);
	m$.UrlBox().value = surfURL;
	m$.initBrowser();
	m$.Browser().loadURI(surfURL,m$.Browser().currentURI,null);
    }

    this.BrowserScrapper = function() {
	var doc = m$.Browser().contentDocument;
	var xrefs = $(doc).find("[href^=\/scholar.bib]");
	if(xrefs) {
	    m$.extractBibTeXCitations();
	}
    }

    this.surf4URL = function(surfer,selection) {
	var surfURL;
	var selection;
	switch(m$.editMode) {
	   case 0: selection = m$.Browser().contentWindow.getSelection(); break;
	   case 1: selection = m$.Editor().contentWindow.getSelection(); break;
	   case 2: selection = m$.Scratch().contentWindow.getSelection(); break;
	}
	var sel = encodeURIComponent(selection);
	switch(surfer) {
	case "dic": surfURL = "http://www.thefreedictionary.com/" + sel; break;
	case "duck": surfURL = "http://duckduckgo.com/?q=" + sel; break;
	case "scholar": surfURL = "http://scholar.google.co.in/scholar?q=" + sel; break;
	case "wiki": surfURL = "http://duckduckgo.com/?q=" + sel + " site:wikipedia.org"; break;
	case "code": surfURL = "http://code.google.com/query/#q=" +  sel; break;
	case "yahoo": surfURL = "http://search.yahoo.com/search?p=" + sel; break;
	case "bing": surfURL = "http://www.bing.com/search?q=" + sel; break;
	case "indic": surfURL = "http://www.google.com/transliterate"; break;
	case "unicode": surfURL = "http://www.utf8-chartable.de/unicode-utf8-table.pl"; break;
	default: surfURL = "http://www.google.com/search?q=" + sel; break;
	}
	return surfURL;
    }
    

    this.setGoogleScholarPreferences = function() {
	var scisig = "";
	var pref_url = "http://scholar.google.co.in/scholar_preferences?hl=en";
	$.ajax({
		type: "GET",
		    url:pref_url,
		    async: false,
		    dataType: "html",
		    success: function(data) {
		    var rgxp = /name=scisig\s+value=\"([^\"]+)\"/i;
		    var found = data.match(rgxp);
		    if(found) {
			scisig = found[1];
		    }
		}
	    });

	if(scisig!="") {
	    pref_url="http://scholar.google.co.in/scholar_setprefs?scisig=" + scisig + "&inststart=0&hl=en&lang=all&as_sdt=1%2C5&as_sdtp=on&instq=&num=10&scis=yes&scisf=4&submit=Save+Preferences";
	    $.ajax({
		    type: "GET",
			url: pref_url,
			async: false,
			dataType: "html",
			success: function(data) {
		    }
		});
	}
	else {
	    m$.Browser().loadURI(pref_url,m$.Browser().currentURI,null);
	}

    }


    this.extractBibTeXCitations = function() {
	var doc = m$.Browser().contentDocument;
	var xrefs = $(doc).find("[href^=\/scholar.bib]");
	var body = "";
	xrefs.each(function() {
		var xref_url = "http://scholar.google.co.in" + $(this).attr("href");;
		$.ajax({
			type: "GET",
			    url: xref_url,
			    async: false,
			    dataType: "html",
			    success: function(data) {
			    body = body + "<li>" + m$.bibtex2html(data) + "</li>";
			}
		    });
		    
	    });
	if(body!="") {
	    body = "<body><div><ol>" + body + "</ol></div></body>";
	    m$.initScratch();
	    var doc = m$.Scratch().contentDocument;
	    $(doc).find("body").html(body);
	}
    }

    this.bibtex2html = function(bt){
	var html = bt;
	html = bt.replace(/\@([A-Za-z]+)\s*\{([A-Za-z0-9]+)\s*,/g,"<span class='$1' id='$2'>");
	html = html.replace(/([A-Za-z]+)\s*=\s*\{/g,"<span class='$1'>");
	html = html.replace(/\}/g,"</span>");
	return html;
    }


    this.setCookie = function(url,cookieString) {
	var cookieUri = Components.classes["@mozilla.org/network/io-service;1"]  
	.getService(Components.interfaces.nsIIOService)  
	.newURI(url, null, null);
	Components.classes["@mozilla.org/cookieService;1"]
	.getService(Components.interfaces.nsICookieService)
	.setCookieString(cookieUri, null, cookieString, null);
	m$.logMessage("set-cookie:" + cookieString);
	m$.logMessage("get-cookie:" + m$.getCookie(url,"GSP"));
    }

    this.getCookie = function(url,name) {
	var ios = Components.classes["@mozilla.org/network/io-service;1"]
	.getService(Components.interfaces.nsIIOService);
	var uri = ios.newURI(url, null, null);
	
	var cookieSvc = Components.classes["@mozilla.org/cookieService;1"]
	.getService(Components.interfaces.nsICookieService);
	var cookie = cookieSvc.getCookieString(uri, null);
	return cookie
    }

    this.browseAddress = function() {
	m$.initBrowser();
	var f = m$.UrlBox().value;
	f = f.replace(/^(g|go+|googl|gugl|google)$/i,"http://www.google.com");
	f = f.replace(/^(ct|citi)$/i,"http://www.citibank.co.in");
	f = f.replace(/^(d|dic)$/i,"http://www.dictionary.com");
	if(f.match(/^[\/]/)) {
	    f = "file" + "://" + f.replace(/^(\/)+/,"/");
	    m$.UrlBox().value = f;
	}

	if(!(f.match(/^([a-z]+:)/i))) {
	    m$.UrlBox().value = "http" + "://" + f.replace(/^ht+p([:\/]+)/,"");
	}
	var url = m$.UrlBox().value.replace(/^(http|file)(:[\/]+[a-z.?=]+)(.*)$/i,"$1$2");
	var qry = m$.UrlBox().value.replace(/^(http|file)(:[\/]+[a-z.?=]+)(.*)$/i,"$3");
	qry = encodeURIComponent(qry);
	m$.UrlBox().value = url + qry;
	m$.UrlBox().value = m$.UrlBox().value.replace(/%2F/gi,'/');
	m$.UrlBox().value = m$.UrlBox().value.replace(/%3F/gi,'?');
	m$.UrlBox().value = m$.UrlBox().value.replace(/%3D/gi,'=');
	m$.UrlBox().value = m$.UrlBox().value.replace(/%26/gi,'&');
	m$.Browser().loadURI(m$.UrlBox().value,m$.Browser().currentURI,null);
    }


    this.browseBack = function() {
	if(m$.editMode == 1) {
	    var href = m$.Editor().contentWindow.location.href.replace(/#[\w]*$/,"");
	    m$.Editor().contentWindow.location.href = href + "#currentParaTUX";
	}
	else {
	    if(m$.editMode == 0) { m$.Browser().goBack(); }
	}
    }

    this.browseForward = function() {
	if(m$.editMode == 1) {
	    m$.goToLink();
	}
	else {
	    if(m$.editMode == 0) { m$.Browser().goForward(); }
	}
    }

    this.insertGraphic = function() {
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, "Insert a Graphic", nsIFilePicker.modeOpen);
	fp.appendFilters(nsIFilePicker.filterImages);
	fp.appendFilter("Vector Graphic", "*.svg");
	var res = fp.show();
	if (res == nsIFilePicker.returnOK){
	    var thefile = fp.file;
	    if (thefile.exists()) {
		if(thefile.path.match(/[.]svg$/i)) {
		    m$.makeEdit("inserthtml","<embed src='file://" + thefile.path + "'>");
		}
		else {
		    m$.makeEdit("inserthtml","<img src='file://" + thefile.path + "'>");
		}
	    }
	}
    }

    this.insertVideo = function() {
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, "Insert a Video", nsIFilePicker.modeOpen);
	fp.appendFilter("Ogg", "*.ogg");
	fp.appendFilter("MP4", "*.mp4");
	var res = fp.show();
	if (res == nsIFilePicker.returnOK){
	    var thefile = fp.file;
	    if (thefile.exists()) {
		m$.makeEdit("inserthtml","<video src='file://" + thefile.path + "' controls='true' autoplay='true'>Doesn't support <code>video</code> tag!!!</video>");
	    }
	}

    }

    this.insertAudio = function() {
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, "Insert a Video", nsIFilePicker.modeOpen);
	fp.appendFilter("Ogg", "*.ogg");
	fp.appendFilter("Wave", "*.wav");
	var res = fp.show();
	if (res == nsIFilePicker.returnOK){
	    var thefile = fp.file;
	    if (thefile.exists()) {
		m$.makeEdit("inserthtml","<audio src='file://" + thefile.path + "' controls='true' autoplay='true'>Doesn't support <code>audio</code> tag!!!</audio>");

	    }
	}
    }

    this.openFile = function() {
	m$.initEditor();
	var URL = m$.Editor().src;
	if(URL == null || URL.spec != "chrome://multiflow/locale/MuLTiFlow.html") {
	    if(confirm("Save the current file?")) {	m$.saveCurrentFile(); }
	}
	var recentFile = m$.getPref("recentFile");
	var thefile = FileIO.open(recentFile);
	if(confirm("Do you want to open the recent file? (" +  recentFile + ")")) {	    
	}
	else {
	    var nsIFilePicker = Components.interfaces.nsIFilePicker;
	    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	    if(fp.addToRecentDocs) { 
		fp.addToRecentDocs = true; 
	    }
	    else {
		if(recentFile != "") {
		    var recentDir = recentFile.replace(/[a-zA-Z0-9.]+$/,"");
		    var dir = FileIO.open(recentDir);
		    if(dir) {
			fp.displayDirectory = dir;
		    }
		}
	    }
	    fp.init(window, "Open a File", nsIFilePicker.modeOpen);
	    fp.appendFilters(nsIFilePicker.filterHTML);
	    fp.appendFilter("MS Word 2007 XML Package", "*.docx");
	    fp.appendFilter("Open Office XML Package", "*.odt");
	    //fp.appendFilter("3B2 Document", "*.3d");
	    //fp.appendFilter("LaTeX Document", "*.tex");
	    fp.appendFilter("eBook package", "*.epub");
	    fp.appendFilter("HTML package", "*.hpub");
	    fp.appendFilter("All Files", "*");
	    var res = fp.show();
	    if (res == nsIFilePicker.returnOK){
		thefile = fp.file;
	    }
	    else {
		thefile = null;
	    }
	}
	if (thefile && thefile.exists()) {
	    var theFilePath = thefile.path;
	    m$.setPref("recentFile",theFilePath);
	    var str  = "Sorry couldn't import, may be try saving it as HTML and opening the file in this editor!!";
	    if(theFilePath.match(/[.](htm|html|xhtml|xml|txt)$/i)) {
		m$.UrlBox().value = theFilePath;
		str  = FileIO.read(thefile,"UTF-8");
	    }
	    else if(theFilePath.match(/[.](docx|odt|epub|hpub)$/i)) {
		str = m$.getHtmlFromPackage(theFilePath);
	    }
	    else {
		alert("This file format/extension is not supported. Please convert to HTML and load the HTML document or try cutting and pasting into a blank document from the application that opens the document");
	    }
	    var bstr = str.replace(/^([^a]|a)*<body[^<>]*>/im,"");
	    bstr = m$.normalizeText(bstr);
	    $(m$.Editor().contentDocument.body).html(bstr);
	    m$.LaTeXMLFilter();
	    m$.HTMLFilter();
	    var ios = Components.classes["@mozilla.org/network/io-service;1"]
	    .getService(Components.interfaces.nsIIOService);  
	    m$.Editor().src = ios.newFileURI(thefile);
	    m$.makeEditable();
	    var doc = m$.Editor().contentDocument;
	    var title = "M5 document";
	    var author = "Nicolas Bourbaki";
	    if(str.match(/<title(?:\s[^<>]*)?>([^<>]*)<\/title>/)) {
		title = str.match(/<title(?:\s[^<>]*)?>([^<>]*)<\/title>/)[0].replace(/<[^<>]+>/g,"");
	    }
	    if(str.match(/<meta(?:\s[^<>]*)?name=[\'\"]?author[^a-z][^<>]*>/i)) {
		author = str.match(/<meta(?:\s[^<>]*)?name=['"]?author[^a-z][^<>]*>/i)[0].replace(/^.*content=["']?([^<>\"\']+).*>/gi,"$1");
	    }
	    $(doc).find("title").html(title);
	    $(doc).find("meta[name='author']").attr('content',author);
	    m$.updateDocumentMetaDataToPrefs(title,author);
	    m$.markAllSentenceBreaks();
	    if(m$.getGeckoVersion() < 2) { m$.convertMath(doc); }
	    m$.optionCodeWindow();
	    m$.refreshEditor();
	}
	else {
	    alert("Not able to access the file: " + theFilePath);
	}
      
    }

    this.refreshEditor = function() {
	m$.initBrowser();
	m$.initEditor();
    }

    this.convertMath = function(doc) {
	m$.initMathconvert(doc,10);
	setTimeout("m$.restMathconvert(10)",10);
    }

    this.optionCodeWindow = function() {
	/*----This one decides if CodeArea should be displayed or not----*/
	var showCodeWindow = m$.getPref("showCodeWindow");
	if(parseInt(showCodeWindow) == 1) {
	    $(m$.CodeWindow()).show();
	}
	else {
	    $(m$.CodeWindow()).hide();
	}
    }

    this.showTOC = function() {
	var doc = m$.Editor().contentDocument;
	$(doc.body).find('p').each(function () {
		if($(this).attr('class').match(/(para|bibitem|math|^$)/i)) {
		    $(this).hide();
		};
	    });
    }


    this.showDOC = function() {
	var doc = m$.Editor().contentDocument;
	$(doc.body).find('p').each(function () {
		if($(this).attr('class').match(/(para|bibitem|math|^$)/i)) {
		    $(this).show();
		};
	    });
    
	var href = m$.Editor().contentWindow.location.href.replace(/#currentParaTUX$/,"");
	m$.Editor().contentWindow.location.href = href + "#currentParaTUX";
    }


    this.goToLink = function() {
	var selection =  m$.Editor().contentWindow.getSelection();
	var snode = selection.getRangeAt(0).startContainer;
	var href = m$.Editor().contentWindow.location.href.replace(/#[\w]*$/,"");
	var anode = $(snode).parents("a:first");
	if(anode.html()) {
	    m$.Editor().contentWindow.location.href = href + anode.attr("href");
	}
    }


    this.initMathconvert = function(doc,n) {
	$(doc.body).find("p,table").each( 
					 function(i) {
					     if(i < n) { m$.convert2math(doc,this); m$.convert2svg(doc,this); }
					 });
    
    }

    this.restMathconvert = function(n) {
	var doc = m$.Editor().contentDocument;
	$(doc.body).find("p,table").each( 
					 function(i) {
					     if(i > n-1) { m$.convert2math(doc,this); m$.convert2svg(doc,this); }
					 });
    }

    this.openBlankFile = function() {
	m$.initEditor();
	var URL = m$.Editor().src;
	if(URL == null || URL.spec != "chrome://multiflow/locale/MuLTiFlow.html") {
	    if(confirm("Save the current file?")) {	m$.saveCurrentFile(); }
	}
	$(m$.Editor().contentDocument.body).html("<p>A simple blank document.</p>");
	m$.UrlBox().value = "";
	m$.Editor().src = null;
	m$.makeEditable();
	m$.optionCodeWindow();
    }

    this.getGeckoVersion = function() {

	var str = navigator.userAgent;
	var version = str.replace(/^.*rv:\s*([0-9.a-z]+).*$/,"$1");
	var vn = version.replace(/^([0-9]+(?:[.][0-9]+)?).*$/,"$1");
	return vn;
    }

    this.saveAsCurrentFile = function() {
   
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, "Save to a HTML File", nsIFilePicker.modeSave);
	fp.appendFilters(nsIFilePicker.filterHTML);
	fp.defaultString = "New-document.html";
	var res = fp.show();
	if ( (res == nsIFilePicker.returnOK) || (res == nsIFilePicker.returnReplace) ) {
	    var thefile = fp.file;
	    m$.UrlBox().value = thefile.path;
	    var ios = Components.classes["@mozilla.org/network/io-service;1"]
		.getService(Components.interfaces.nsIIOService);  
	    m$.Editor().src = ios.newFileURI(thefile);  
	    m$.saveCurrentFile();
	}
    }


    this.getTUXWebStyle = function() {
	var chromePath = m$.getChromePath();
	var file = FileIO.open(chromePath + "/skin/document/tux.css");
	var str  = FileIO.read(file,"UTF-8");
	return str;
    }

    this.getTUXPrintStyle = function() {
	var chromePath = m$.getChromePath();
	var file = FileIO.open(chromePath + "/skin/document/tuxprint.css");
	var str  = FileIO.read(file,"UTF-8");
	return str;
    }

    this.displayStyleMath = function() {
	$(m$.Editor().contentDocument.body).find("p.DisplayMath").each(function() {
		var html = $(this).html().replace(/<math>/gi,"<math display='block' align='left'>");
		$(this).html(html);
	    });
    }

    this.saveCurrentFile = function() {
	if(m$.editMode == 1) {
	    m$.reformatMath();
	    m$.removeHighlight();
	    //insertNewPara();
	    var URL = m$.Editor().src;
	    if(URL && URL.spec!="") {
		var filepath = URL.QueryInterface(Components.interfaces.nsIFileURL).file.path; ;
		m$.UrlBox().value = filepath;
		var docHTML = m$.Editor().contentDocument.body.innerHTML;
		docHTML = m$.normalizeText(docHTML);
		var fileOut = FileIO.open(filepath);
		var tuxStyle = m$.getTUXWebStyle();
		var tuxPrintStyle = m$.getTUXPrintStyle();
		var docHEAD = "<!DOCTYPE html>\n<html>\n<head>\n<title>MuLTiFlow document</title>\n<meta http-equiv='content-type' content='text/html; charset=UTF-8'>\n<style type='text/css' media='screen'>\n" + tuxStyle + "\n</style>\n<style type='text/css' media='print'>\n" + tuxPrintStyle + "\n</style>\n</head>\n<body>";
		docHTML =  docHEAD + docHTML + "</body>\n</html>";
		if(URL != "chrome://multiflow/locale/MuLTiFlow.html") {
		    var str = FileIO.write(fileOut, docHTML, 'o','UTF-8');
		    var doc = m$.Editor().contentDocument;
		    if(m$.getGeckoVersion() < 2) { m$.convertMath(doc); }
		}
	    }
	    else {
		m$.saveAsCurrentFile();
	    }
	}
    }


    this.saveAsTUXFile = function() {
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, "Export XML", nsIFilePicker.modeSave);
	fp.defaultString = "New-document.xml";
	var res = fp.show();
	if ( (res == nsIFilePicker.returnOK) || (res == nsIFilePicker.returnReplace) ) {
	    var thefile = fp.file;
	    var docBODY = m$.HTML2TUX();
	    var str = FileIO.write(thefile, docBODY, 'o','UTF-8');
	}
    }


    this.saveAsXHTMLFile = function() {
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, "Export XHTML", nsIFilePicker.modeSave);
	var res = fp.show();
	if ( (res == nsIFilePicker.returnOK) || (res == nsIFilePicker.returnReplace) ) {
	    var thefile = fp.file;
	    var docHTML = m$.Editor().contentDocument.body.innerHTML;
	    var docHEAD = "<html xmlns='http://www.w3.org/1999/xhtml'>\n<head>\n<title>MuLTiFlow document</title>\n</head>\n<body>";
	    docHTML =  docHEAD + docHTML + "</body>\n</html>";
	    var str = FileIO.write(thefile, m$.HTML2XHTML(docHTML), 'o','UTF-8');
	}
    }

    this.HTML2XHTML = function(html) {

	html = html.replace(/&nbsp;/g,"&#xA0;");
	html = html.replace(/<br([^<>\/]*)>/g,"<br$1/>");
	html = html.replace(/\s+name="currentParaTUX"/g,"");
	return html;

    }

    this.HTML2TUX = function() {
	var body = m$.Editor().contentDocument.body;
	var cbody = body.cloneNode(true);
	var cjbody = $(cbody);
	cjbody.find("div[class],p[class],span[class]").wrap(function() {
		return "<" + $(this).attr("class") + "/>";
	    });
	cjbody.find("span[class]").wrap(function() {
		return "<" + $(this).attr("class") + "/>";
	    });
	cjbody.find("u").remove();
	var html = cjbody.html();
	cjbody.find("u").remove();
	html = html.replace(/<\/?(span|p|div)(\s+[^<>]*)?>/g,"");
	html = m$.HTML2XHTML(html);
	html = html.replace(/(<[^<>]+)_(>)/g,"$1$2");
	html = html.replace(/<\/p><\/caption>(<italic>(?:[^><]+)<\/italic>)<caption><p>/g,"$1");
	html = html.replace(/<\/p><\/caption>(<bold>(?:[^><]+)<\/bold>)<caption><p>/g,"$1");
	html = html.replace(/([^>]+)<p><list>/,"$1<list>");
	html = html.replace(/(<\/list><\/p>)<\/p>/,"$1");
	//html = html.replace(/(<given-names>(?:[^<>]+)<\/given-names>)(<surname>(?:[^<>]+)<\/surname>)/g,"$2$1");		
	return html;
    }

    this.getChromePath = function() {
	var dsprops = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties);
	var chromePath = dsprops.get("AChrom", Components.interfaces.nsIFile).path;
	var file = FileIO.open(chromePath + "/content/editor.xul");
	if(!file.exists()) {
	    /*---Switch this for Firefox Addon---*/
	    chromePath = dsprops.get("ProfD", Components.interfaces.nsIFile).path + "/extensions/multiflow@tnq.co.in/chrome";
	}
	return chromePath;
    }

    this.saveAsPackage = function() {
	const PR_RDONLY      = 0x01;
	const PR_WRONLY      = 0x02;
	const PR_RDWR        = 0x04;
	const PR_CREATE_FILE = 0x08;
	const PR_APPEND      = 0x10;
	const PR_TRUNCATE    = 0x20;
	const PR_SYNC        = 0x40;
	const PR_EXCL        = 0x80;
	const COMPRESSION_NONE  = 0;
	const COMPRESSION_FASTEST = 1;
	const COMPRESSION_DEFAULT = 6;
	const COMPRESSION_BEST    = 9;

	var chromePath = m$.getChromePath();
	var zipF = Components.classes["@mozilla.org/file/local;1"]
	.createInstance(Components.interfaces.nsILocalFile);
	zipF.initWithPath(chromePath + "/content/docx/");

	var xmlString;
	if(arguments.length > 0) {
	    switch(arguments[0]) {
	    case "docx":
		zipF.append("template.docx");
		xmlString = m$.convertDocToXMLString("docx");
		break;
	    case "odt":
	    case "odf":
		zipF.append("template.odt");
	    xmlString = m$.convertDocToXMLString("odt");
	    break;
	    case "epub":
		zipF.append("template.epub");
		xmlString = m$.convertDocToXMLString("xhtml");
		break;
	    case "hpub":
		zipF.append("template.hpub");
		xmlString = m$.convertDocToXMLString("xhtml");
		break;
	    default:
	    }
	}
	else {	
	}

	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, "Export to " + arguments[0], nsIFilePicker.modeSave);
	var res = fp.show();
	if ( (res == nsIFilePicker.returnOK) || (res == nsIFilePicker.returnReplace) ) {
	    var zipFile = fp.file;
	    var zipW = Components.classes["@mozilla.org/zipwriter;1"]
		.createInstance(Components.interfaces.nsIZipWriter);
	    var zipR = Components.classes["@mozilla.org/libjar/zip-reader;1"]
		.createInstance(Components.interfaces.nsIZipReader);
	    zipR.open(zipF);
	    var entryEnum = zipR.findEntries("*");
	    var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
		.createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	    converter.charset = /* The charset you want to use. Using UTF-8 in this example */ "UTF-8";
	    // Now, convert a string to an nsIInputStream  
	    var stream = converter.convertToInputStream(xmlString);
	    // stream can now be used as an nsIInputStream
	    var date = new Date();
	    var entry;
	    var is;
	    zipW.open(zipFile, PR_RDWR | PR_CREATE_FILE | PR_TRUNCATE);
	    while (entryEnum.hasMore()) {
		entry = entryEnum.getNext();
		is = zipR.getInputStream(entry);
		zipW.addEntryStream(entry, date, COMPRESSION_DEFAULT, is, false);
	    }
	    if(arguments.length > 0) {
		switch(arguments[0]) {
		case "docx":
		    zipW.addEntryStream("word/document.xml", date, COMPRESSION_DEFAULT, stream, false);
		    break;
		case "odt":
		case "odf":
		    zipW.addEntryStream("content.xml", date, COMPRESSION_DEFAULT, stream, false);
		break;
		case "epub":
		    zipW.addEntryStream("OPS/document.xml", date, COMPRESSION_DEFAULT, stream, false);
		    break;
		case "hpub":
		    zipW.addEntryStream("OPS/document.html", date, COMPRESSION_DEFAULT, stream, false);
		    break;
		default:
		}
	    }
	    else {
	    }

	    zipW.close();
	}
    }

    this.convertDocToXMLString = function() {
	var docHEAD = "<html><head><title>MuLTiFlow document</title></head><body>";
	var docBODY = m$.Editor().contentDocument.body.innerHTML;
	var docTAIL = "</body></html>";
	docBODY = docBODY.replace(/\&nbsp;/gi,"&#xA0;");

	switch(arguments[0]) {
	case "docx":
	    docHEAD = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>\n<document xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:r='http://schemas.openxmlformats.org/officeDocument/2006/relationships' xmlns:v='urn:schemas-microsoft-com:vml' xmlns='http://schemas.openxmlformats.org/wordprocessingml/2006/main' xmlns:w10='urn:schemas-microsoft-com:office:word' xmlns:wp='http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing'><body>";
	    /*-----Escape all formatting tags, tables, mathml and svg for now-------*/
	    docBODY = docBODY.replace(/<(?=\/?[a-o_r-z])/gi,"&lt;");
	    /*---Wrap <r> and <t> tags around the text of <p> tags -----*/
	    docBODY = docBODY.replace(/(<p(?:\s[^<>]*)?>)/gi,"$1<r><t>");
	    docBODY = docBODY.replace(/(<\/p>)/gi,"</t></r></p>");
	    docTAIL = "</body></document>";
	    break;
	case "odf":
	case "odt":
	    docHEAD = "<?xml version='1.0' encoding='UTF-8' standalone='yes'?>\n<document-content xmlns='urn:oasis:names:tc:opendocument:xmlns:office:1.0' xmlns:style='urn:oasis:names:tc:opendocument:xmlns:style:1.0' xmlns:text='urn:oasis:names:tc:opendocument:xmlns:text:1.0' xmlns:table='urn:oasis:names:tc:opendocument:xmlns:table:1.0' xmlns:draw='urn:oasis:names:tc:opendocument:xmlns:drawing:1.0' xmlns:fo='urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:meta='urn:oasis:names:tc:opendocument:xmlns:meta:1.0' xmlns:number='urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0' xmlns:svg='urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0' xmlns:chart='urn:oasis:names:tc:opendocument:xmlns:chart:1.0' xmlns:dr3d='urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0' xmlns:math='http://www.w3.org/1998/Math/MathML' xmlns:form='urn:oasis:names:tc:opendocument:xmlns:form:1.0' xmlns:script='urn:oasis:names:tc:opendocument:xmlns:script:1.0' xmlns:ooo='http://openoffice.org/2004/office' xmlns:ooow='http://openoffice.org/2004/writer' xmlns:oooc='http://openoffice.org/2004/calc' xmlns:dom='http://www.w3.org/2001/xml-events' xmlns:xforms='http://www.w3.org/2002/xforms' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:rpt='http://openoffice.org/2005/report' xmlns:of='urn:oasis:names:tc:opendocument:xmlns:of:1.2' xmlns:xhtml='http://www.w3.org/1999/xhtml' xmlns:grddl='http://www.w3.org/2003/g/data-view#' xmlns:officeooo='http://openoffice.org/2009/office' xmlns:tableooo='http://openoffice.org/2009/table' xmlns:field='urn:openoffice:names:experimental:ooo-ms-interop:xmlns:field:1.0' xmlns:formx='urn:openoffice:names:experimental:ooxml-odf-interop:xmlns:form:1.0' xmlns:css3t='http://www.w3.org/TR/css3-text/' version='1.2' grddl:transformation='http://docs.oasis-open.org/office/1.2/xslt/odf2rdf.xsl'><body><text>";
	/*-----Escape all formatting tags, tables, mathml and svg for now-------*/
	docBODY = docBODY.replace(/<(?=\/?[a-o_r-z])/gi,"&lt;");
	docBODY = docBODY.replace(/(<\/?)([p])(\s|>)/gi,"$1text:$2$3");
	docTAIL = "</text></body></document-content>";
	break;
	case "xhtml":
	    docHEAD = "<html xmlns='http://www.w3.org/1999/xhtml'><head><title>MuLTiFlow document</title><link rel='stylesheet' id='webcss' type='text/css' href='css/tux.css' media='screen' /><link rel='stylesheet' id='printcss' type='text/css' href='css/tuxprint1.css' media='print' /></head><body>";
	    docBODY = docBODY.replace(/\&nbsp;/gi,"&#xA0;");
	    /*--XMLizing <hr> and <br> elements--*/
	    docBODY = docBODY.replace(/<([hb]r(\s[^<>]*)?)>/gi,"<$1/>");
	
	    /*--Adding namespaces for MathML and SVG---*/
	    docBODY = docBODY.replace(/<math(\s[^<>]*)?>/g, "<math xmlns='http://www.w3.org/1998/Math/MathML'>");
	    docBODY = docBODY.replace(/<svg(\s[^<>]*)?>/g, "<svg xmlns='http://www.w3.org/2000/svg'>");
	    break;
	}
	var xml = docHEAD + docBODY + docTAIL;
	return xml;
    }

    this.getHtmlFromPackage = function(theFilePath) {

	var ext = theFilePath.replace(/^(.*[.])([a-z]+)$/,"$2");
	var xsltUri = "chrome://multiflow/content/xsl/odt2tux.xsl";
	var xsltStylesUri = "chrome://multiflow/content/xsl/odtStyles.xsl";
	var baseUri = "jar:file://" + theFilePath + "!/";
	var doc_content;
	var doc_styles;
	var xsltUri;
	var html;
	switch(ext) {
	case "odt":
	    doc_content = m$.loadXMLDoc(baseUri + 'content.xml');
	    doc_styles = m$.loadXMLDoc(baseUri + 'content.xml');
	    xsltUri = "chrome://multiflow/content/xsl/odt2tux.xsl";
	    xsltStylesUri = "chrome://multiflow/content/xsl/odtStyles.xsl";
	    break;
	case "docx":
	    /*---There are no fixed conventions, so needs more work---*/
	    doc_content = m$.loadXMLDoc(baseUri + 'word/document.xml');
	    doc_styles = m$.loadXMLDoc(baseUri + 'word/styles.xml');
	    xsltUri = "chrome://multiflow/content/xsl/docx2tux.xsl";
	    xsltStylesUri = "chrome://multiflow/content/xsl/docxStyles.xsl";
	    break;
	case "epub":
	    var zipR = Components.classes["@mozilla.org/libjar/zip-reader;1"]
		.createInstance(Components.interfaces.nsIZipReader);
	    var zipF = Components.classes["@mozilla.org/file/local;1"]
		.createInstance(Components.interfaces.nsILocalFile);
	    zipF.initWithPath(theFilePath.replace(/[\/\\][^\/\\]+$/,""));
	    zipF.append(theFilePath.replace(/^.*[\/\\]([^\/\\]+)$/,"$1"));
	    zipR.open(zipF);
	    var entryEnum = zipR.findEntries("*");
	    var htmlStream;
	    while (entryEnum.hasMore()) {
		entry = entryEnum.getNext();
		if(entry.match(/[.](xml|html|xhtml)$/i) && !(entry.match(/[\/\\]container[.]xml$/i))) {
		    if(confirm("Open? " + entry)) {
			htmlStream = zipR.getInputStream(entry);
			break;
		    }
		}
	    }
	    break;
	}
	if(ext == "epub" || ext == "hpub") {
	    html = m$.convertInputStreamToString(htmlStream);
	}
	else {
	    var stylesheet = m$.loadXMLDoc(xsltUri);
	    var processor = Components.classes["@mozilla.org/document-transformer;1?type=xslt"]
	    .createInstance( Components.interfaces.nsIXSLTProcessor );
	    processor.importStylesheet( stylesheet );
	    processor.setParameter(null, 'param_baseuri', baseUri);
	    var htmlDoc = processor.transformToDocument(doc_content);

	    processor.reset();
	    stylesheet = m$.loadXMLDoc(xsltStylesUri);
	    processor.importStylesheet( stylesheet );
	    processor.setParameter(null, 'param_baseuri', baseUri);
	    var stylesDoc = processor.transformToDocument(doc_styles);
	    $(htmlDoc.body).find("[class]").attr("class", function () {
		    var idp = "[id=" + $(this).attr('class') + "]";
		    return $(stylesDoc.body).find(idp).html();
		});
	    html = "<html><head><title>OpenOffice converted document</title></head><body>" + htmlDoc.body.innerHTML + "</body></html>";
	}

	return html;
    }

    this.convertInputStreamToString = function(is) {
	var html = "";
	var str;
	var cstream = Components.classes["@mozilla.org/intl/converter-input-stream;1"]
	.createInstance(Components.interfaces.nsIConverterInputStream);
	cstream.init(is, "UTF-8", 0, 0);
	let (str = {}) {  
	    let read = 0;  
	    do {   
		read = cstream.readString(0xffffffff, str); // read as much as we can and put it in str.value  
		html += str.value;  
	    } while (read != 0);  
	}
	cstream.close(); // this closes fstream
	return html;
    }


    this.loadXMLDoc = function(uri) {
	var load = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
	.createInstance( Components.interfaces.nsIXMLHttpRequest );
	try {
	    load.open ( "GET", uri, false );
	    load.overrideMimeType("text/xml");
	    load.send(null);
	} catch (error) {
	    alert("Couldn't open " + uri + 
		  ", reason: " + error);
	}
	return load.responseXML;
    }



    this.makeMathEdit = function(cmd,val) {
	var flg;
	var doc =  m$.Editor().contentDocument;
	var selection =  m$.Editor().contentWindow.getSelection();
	var node = selection.anchorNode;
	var nam = node.parentNode.nodeName;
	if (nam.match( /^m/i)) {
	    val = val.replace(/<\/?math>/g,"");
	    node.nodeValue += "iiii";
	    var html = "";
	    if($(node).parents("p:first").html()) { html = $(node).parents("p:first").html(); }
	    else if($(node).parents("div:first").html()) { html = $(node).parents("div:first").html(); }
	    if(html!="") {
		html = m$.normalizeMath(html);
		html = html.replace(/<mi>iiii<\/mi>/,val);
		if($(node).parents("p:first").html()) { $(node).parents("p:first").html(html); }
		else if($(node).parents("div:first").html()) { $(node).parents("div:first").html(html); }
	    }
	}
	else {
	    val = "&nbsp;<span>" + val + "</span>";
	    flg = m$.makeEdit(cmd,"<del>insertID0102030405</del>");
	}
	var cPs = m$.cParas();
	for(var i=0; i<cPs.length; i++) {
	    cPs[i].innerHTML = cPs[i].innerHTML.replace(/<del>insertID0102030405<\/del>/i,val);
	    if(m$.getGeckoVersion() < 2) { m$.convert2math(doc,cPs[i]); m$.convert2svg(doc,cPs[i]); }
	}
	if(m$.cPara()) { m$.CodeArea().value = m$.cPara().innerHTML; }

	return flg;
    }




    this.makeSVGEdit = function(cmd,val) {
	var flg;
	var doc =  m$.Editor().contentDocument;
	val = "&nbsp;<span>" + val + "</span>";
	flg = m$.makeEdit(cmd,"<del>insertID0102030405</del>");
	var cPs = m$.cParas();
	for(var i=0; i<cPs.length; i++) {
	    cPs[i].innerHTML = cPs[i].innerHTML.replace(/<del>insertID0102030405<\/del>/i,val);
	    if(m$.getGeckoVersion() < 2) { m$.convert2svg(doc,cPs[i]); }
	}
	if(m$.cPara()) { m$.CodeArea().value = m$.cPara().innerHTML; }
	return flg;
    }


    this.makeEdit = function(cmd,val) {
	var doc = m$.Editor().contentDocument;
	var flg = doc.execCommand(cmd,false,val);
	if(m$.cPara()) { m$.CodeArea().value = m$.cPara().innerHTML; }
	return flg;
    }

    this.makeMultiEdit = function(cmd,val) {
	var doc = m$.Editor().contentDocument;
	var win = m$.Editor().contentWindow;
	var sel = win.getSelection();
	var n = sel.rangeCount;
	var flg = false;

	var ranges = new Array();
	for(var i=0; i<n; i++) {
	    ranges[i] = sel.getRangeAt(i);
	}
	flg = doc.execCommand(cmd,false,val);
	for(var i=1; i<n; i++) {
	    sel.removeAllRanges();
	    sel.addRange(ranges[i]);
	    flg = doc.execCommand(cmd,false,val);
	}

	if(m$.cPara()) { m$.CodeArea().value = m$.cPara().innerHTML; }
	return flg;
    }

    this.createLink = function() {
	m$.makeEdit("createLink",gid("browser-urlbox").value);
    }

    this.countLinks = function(id) {
	var xpath = "..//a[@href='#" + id + "']";
	var doc = m$.Editor().contentDocument;
	if(m$.editMode != 1) {
	    if(m$.editMode == 0) { doc = m$.Browser().contentDocument; }
	}
	var xpathResult = doc.evaluate(xpath,doc.body,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
	return xpathResult.snapshotLength;
    }

    this.countAllLinks = function() {
	var xpath = ".//a/@id";
	var doc = m$.Editor().contentDocument;
	if(m$.editMode == 0) {
	    doc = m$.Browser().contentDocument;
	}
	var xpathResult = doc.evaluate(xpath,doc.body,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
	var links = "";
	for(var i=0; i<xpathResult.snapshotLength; i++) {
	    links += m$.countLinks(xpathResult.snapshotItem(i).nodeValue) + ":" + xpathResult.snapshotItem(i).nodeValue + "; " ;
	}
	m$.CodeArea().value = links;
	m$.logToConsole(links,"chrome://multiflow/content/js/editor.js",770,770,1,true,"A");
    }

    this.logToConsole = function(aMessage, aSourceName, aSourceLine, aLineNumber, aColumnNumber, aFlags, aCategory)  {
	var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
	.getService(Components.interfaces.nsIConsoleService);
	var scriptError = Components.classes["@mozilla.org/scripterror;1"]
	.createInstance(Components.interfaces.nsIScriptError);
	scriptError.init(aMessage, aSourceName, aSourceLine, aLineNumber, aColumnNumber, aFlags, aCategory);
	consoleService.logMessage(scriptError);
    }

    this.logMessage = function(msg) {
	var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
	.getService(Components.interfaces.nsIConsoleService);
	consoleService.logStringMessage(msg);
    }



    this.normalizeSVG = function(docHTML) {
	if(docHTML!=null) {
	    docHTML = docHTML.replace(/<\/svg>\s*<\/span>\s*<span>\s*<svg>/gi,"");
	} else {
	    var html = m$.Editor().contentDocument.body.innerHTML;
	    m$.Editor().contentDocument.body.innerHTML = m$.normalizeSVG(html);
	}
	return docHTML;
    }

    this.normalizeMath = function(docHTML) {
	docHTML = docHTML.replace(/(<\/?)[a-z]+:/gi,"$1");
	docHTML = docHTML.replace(/<math[^<>]*>/gi,"<math>");
	docHTML = docHTML.replace(/<\/math><math>/gi,"");
	/*----<span> tag wrap for <math> ----*/
	docHTML = docHTML.replace(/<span><math/gi,"<math");
	docHTML = docHTML.replace(/<\/math><\/span>/gi,"</math>");    
	docHTML = docHTML.replace(/<math/gi,"<span><math");
	docHTML = docHTML.replace(/<\/math>/gi,"</math></span>");
	/*----<span> tag wrap for <svg> ----*/
	docHTML = docHTML.replace(/<span><svg/gi,"<svg");
	docHTML = docHTML.replace(/<\/svg><\/span>/gi,"</svg>");    
	docHTML = docHTML.replace(/<svg/gi,"<span><svg");
	docHTML = docHTML.replace(/<\/svg>/gi,"</svg></span>");
	/*----create end tags for all empty elements ----*/
	docHTML = docHTML.replace(/<([^\s]+)([^<>]*)\/[\s]*>/g,"<$1$2></$1>");
	/*----MathML normalization-----*/
	docHTML = docHTML.replace(/(<m[ion][^<>]*>[^<>]+)iiii(<\/m[ion]>)/i,"<mrow>$1$2<mi>iiii</mi></mrow>");
	docHTML = docHTML.replace(/(<m[ion][^<>]*>[^<>]+<\/m[ion]>)/gi,"<mrow>$1</mrow>");
	var mixp = new XRegExp("(<m[ion](?: [^<>]+)?>)((?:\\p{L}|\\p{M})+)","g");
	var moxp = new XRegExp("(<m[ion](?: [^<>]+)?>)(\\p{S}+)(<|(?:\\p{L}|\\p{M}|\\p{N}))","g");
	var mnxp = new XRegExp("(<m[ion](?: [^<>]+)?>)(\\p{N}+[.,]\\p{N}+|[.]\\p{N}+|\\p{N}+)","g");
	/*
	  for (var i=0; i < 5; i++) {
	  docHTML = docHTML.replace(mixp,"<mi>$2</mi>$1");
	  docHTML = docHTML.replace(moxp,"<mo>$2</mo>$1$3");
	  docHTML = docHTML.replace(mnxp,"<mn>$2</mn>$1");
	  }
	*/
	for (var i=0; i < 5; i++) {
	    docHTML = docHTML.replace(/<mrow[^<>]*>(<m[ion][^<>]*>[^<>]+<\/m[ion]>)<\/mrow>/gi,"$1");
	    docHTML = docHTML.replace(/<m([ion]|text|frac|subsup|su[bp]|sqrt|root|row|ath)[^<>]*><\/m([ion]|text|frac|subsup|su[bp]|sqrt|root|row|ath)>/gi,"");
	}
	return docHTML;
    }

    this.normalizeText = function(docHTML) {

	/*------Get Rid of Namespaces---------*/
	docHTML = docHTML.replace(/(<\/?)[a-z]+:/gi,"$1");
	/*------empty element---------*/
	docHTML = docHTML.replace(/(\s|>)([a-z0-9])(<math(?:\s[^<>]*)?><msu[bp]>)<mi\/>/gi,"$1$3<mtext>$2</mtext>");
	docHTML = docHTML.replace(/(\s|>)([a-z0-9]{2,})(<math(?:\s[^<>]*)?><msu[bp]>)<mi\/>/gi,"$1$3<mi>$2</mi>");
	docHTML = docHTML.replace(/(\s|>)([a-z0-9])(<math(?:\s[^<>]*)?><mmultiscripts>)<none\/><mprescripts\/>/gi,"$1$3<mtext>$2</mtext>");
	docHTML = docHTML.replace(/(\s|>)([a-z0-9]{2,})(<math(?:\s[^<>]*)?><mmultiscripts>)<none\/><mprescripts\/>/gi,"$1$3<mi>$2</mi>");
	docHTML = docHTML.replace(/<(m[a-z]+|none)\/>/gi,"<$1></$1>");
	/*------math element---------*/
	docHTML = docHTML.replace(/<math\s[^<>]+>/gi,"<math>");
	/*------Shrink multiple whitespaces---------*/
	docHTML = docHTML.replace(/\s\s+/g," ");
	/*--Remove semantics tag and annotation element--*/
	docHTML = docHTML.replace(/<\/?semantics[^<>]*>/gi,"");
	docHTML = docHTML.replace(/<annotation[^<>]*>[^<>]*<\/annotation>/gi,"");
	/*--Remove pretty printing whitespaces in mathml--*/
	docHTML = docHTML.replace(/<\/(mi|mn|mo|ms|mtext|mfrac|mroot|msqrt|menclose|mrow|mfenced|mtable|mtr|mtd|msub|msup|msubsup|munder|mover|munderover)>[\s\n\r]+/mgi,"</$1>");
	docHTML = docHTML.replace(/<(math|mi|mn|mo|ms|mtext|mfrac|mroot|msqrt|menclose|mrow|mfenced|mtable|mtr|mtd|msub|msup|msubsup|munder|mover|munderover)([\s\n\r][^<>]*)?>[\s\n\r]+<(math|mi|mn|mo|ms|mtext|mfrac|mroot|msqrt|menclose|mrow|mfenced|mtable|mtr|mtd|msub|msup|msubsup|munder|mover|munderover)([\s\n\r][^<>]*)?>/gi,"<$1$2><$3$4>");
	docHTML = docHTML.replace(/<(math|mi|mn|mo|ms|mtext|mfrac|mroot|msqrt|menclose|mrow|mfenced|mtable|mtr|mtd|msub|msup|msubsup|munder|mover|munderover)([\s\n\r][^<>]*)?>[\s\n\r]+<(math|mi|mn|mo|ms|mtext|mfrac|mroot|msqrt|menclose|mrow|mfenced|mtable|mtr|mtd|msub|msup|msubsup|munder|mover|munderover)([\s\n\r][^<>]*)?>/gi,"<$1$2><$3$4>");
	/*---Remove single operators in math---*/
	docHTML = docHTML.replace(/<math(\s[^<>]*)?><mo>([^<>]+)<\/mo><\/math>/gi,"$2");
	docHTML = docHTML.replace(/\&nbsp;/gi," ");
	/*
	  docHTML = docHTML.replace(/<p([\s][^<>]*|>)\s+/gi,"<p$1");
	  docHTML = docHTML.replace(/\s+<\/p>/gi,"</p>");
	  docHTML = docHTML.replace(/<\/p>/gi,"</p>\n");

	  docHTML = docHTML.replace(/<\/div>/gi,"</div>\n");
	  docHTML = docHTML.replace(/\n\n+/gi,"\n");
	*/
	/*---Some HTML Tidying------*/
	/*
	  docHTML = docHTML.replace(/<li([\s][^<>]*)?>/gi,'<li><p>');
	  docHTML = docHTML.replace(/<\/li>/gi,'</p></li>');
	  docHTML = docHTML.replace(/<p>\s*<p([\s][^<>]*)?>/gi,'<p>');
	  docHTML = docHTML.replace(/<\/p>\s*<\/p>/gi,'</p>');
	*/
	return docHTML;
    }


    this.a2xref = function() {
	$(m$.Editor().contentDocument).find("a[href]").each(
							    function() {
								var tag = $(this).attr("href");
								if(tag) {
								    $(this).before("<xref refid='" + tag + "'>" + $(this).html() + "</xref>").remove();
								}
	    
							    });
    
    }

    this.spanClass2tag = function() {
	$(m$.Editor().contentDocument).find("span").each(
							 function() {
							     var hasSpan=false;
							     if($(this).children("span").length > 0) hasSpan=true;
							     var tag = $(this).attr("class");
							     if(tag) {
								 $(this).before("<" + tag + ">" + $(this).html() + "</" + tag + ">").remove();
							     } else {
								 $(this).before($(this).html()).remove();
							     }
	    

	    
							 });
	$(m$.Editor().contentDocument).find("span").each(
							 function() {
							     var hasSpan=false;
							     if($(this).children("span").length > 0) hasSpan=true;
							     var tag = $(this).attr("class");
							     if(tag) {
								 $(this).before("<" + tag + ">" + $(this).html() + "</" + tag + ">").remove();
							     } else {
								 $(this).before($(this).html()).remove();
							     }
	    

	    
							 });
	$(m$.Editor().contentDocument).find("span").each(
							 function() {
							     var hasSpan=false;
							     if($(this).children("span").length > 0) hasSpan=true;
							     var tag = $(this).attr("class");
							     if(tag) {
								 $(this).before("<" + tag + ">" + $(this).html() + "</" + tag + ">").remove();
							     } else {
								 $(this).before($(this).html()).remove();
							     }
	    

	    
							 });
	$(m$.Editor().contentDocument).find("p").removeClass("text_body");
	$(m$.Editor().contentDocument).find("p").each(
						      function() {
							  var tag = $(this).attr("class");
							  if(tag=="") { tag=null; }
							  if(tag) {
							      $(this).before("<p class='" + tag + "'>" + $(this).html() + "</p>").remove();
							  }
							  else {
							      $(this).before("<p>" + $(this).html() + "</p>").remove();
							  }
	    
						      });
    }



    this.makeScratchable = function() {
	var win = m$.Scratch().contentWindow;
	var doc = m$.Scratch().contentDocument;
	doc.designMode = 'on';
	doc.execCommand('styleWithCSS',false,false);
	doc.execCommand('insertbronreturn',false,false);
	doc.addEventListener("keypress",m$.keyPressHandler,true);
	doc.addEventListener("mousedown",m$.mouseDown,true);
	doc.addEventListener("dragstart",m$.mouseDragStart,true);
	doc.addEventListener("drag",m$.mouseDrag,true);
	doc.addEventListener("dragend",m$.mouseDragEnd,true);
	doc.addEventListener("mousemove",m$.dragVector,true);
	doc.addEventListener("mouseup",m$.mouseUp,true);
	doc.addEventListener("click",m$.mouseClick,true);
	doc.addEventListener("dblclick",m$.mouseDblClick,true);
	//doc.addEventListener("contextmenu",m$.editorContextMenu,true);
 
    }


  this.makeEditable = function() {
	var win = m$.Editor().contentWindow;
	var doc = m$.Editor().contentDocument;
	doc.designMode = 'on';
	doc.execCommand('styleWithCSS',false,false);
	doc.execCommand('insertbronreturn',false,false);
	doc.addEventListener("keypress",m$.keyPressHandler,true);
	doc.addEventListener("mousedown",m$.mouseDown,true);
	doc.addEventListener("dragstart",m$.mouseDragStart,true);
	doc.addEventListener("drag",m$.mouseDrag,true);
	doc.addEventListener("dragend",m$.mouseDragEnd,true);
	doc.addEventListener("mousemove",m$.dragVector,true);
	doc.addEventListener("mouseup",m$.mouseUp,true);
	doc.addEventListener("click",m$.mouseClick,true);
	doc.addEventListener("dblclick",m$.mouseDblClick,true);
	//doc.addEventListener("contextmenu",m$.editorContextMenu,true);
 
    }


    this.editorContextMenu = function(evt) {
	var doc = m$.Editor().contentDocument;
	var selection = m$.Editor().contentWindow.getSelection();
	var snode = selection.getRangeAt(0).startContainer;
	var features = "chrome=yes,menubar=yes,modal=yes,minimizable=yes,resizable=yes,width=50,height=100";
	var r = window.open("chrome://multiflow/content/context-menu/spellcheck.xul", "SpellCheck", features);
    }

    this.mouseUp = function(evt) {
	m$.md = false;
	m$.OnResize(evt);
    }

    this.focusCodeArea = function() {
	m$.focused = "code";
    }

    this.mouseClick = function(evt) {
	m$.focused = "doc";
	var frame = m$.getActiveFrame();
	var doc = frame.contentDocument;
	var selection = frame.contentWindow.getSelection();
	var snode = selection.getRangeAt(0).startContainer;
	
	if($(doc).find("div[name=currentParaTUX]").length < 1 || $(snode).parents("div[name=currentParaTUX]").length < 1) {
	    if(m$.ParaStyleBox().value.match(/\@/)) {   m$.addMathvariant();  }
	    m$.showParaStyle();
	    m$.showNestedStyles();
	}      
    }

    this.mouseDblClick = function(evt) {
	m$.showDivStyle();
	//showParaStyle();
    }

    this.xOff = function(e) {
	var x = e.pageX;
	if(m$.el.parentNode.nodeName == 'svg') {
	    x = x - m$.el.parentNode.parentNode.parentNode.offsetLeft;
	}
	return x - m$.xoff;
    }

    this.yOff = function(e) {
	var svg = m$.el.parentNode.parentNode;
	var y = e.pageY;
	if(m$.el.parentNode.nodeName == 'svg') {
	    y = y - m$.el.parentNode.parentNode.parentNode.offsetTop;
	}
	return y - m$.yoff;
    }

    this.mouseDown = function(evt) {
	if(m$.editMode == 1) {
	    m$.el = m$.Editor().contentWindow.getSelection().anchorNode;
	    m$.md = true;
	    m$.px = m$.xOff(evt);
	    m$.py = m$.yOff(evt);

	    if(m$.el.childNodes.length > 0 && m$.el.getElementsByTagName('line').length > 0) {
		vnode = m$.el.getElementsByTagName('line')[0];
		var x1 = parseInt(vnode.getAttribute('x1'));
		var y1 = parseInt(vnode.getAttribute('y1'));
		var x2 = parseInt(vnode.getAttribute('x2'));
		var y2 = parseInt(vnode.getAttribute('y2'));
		var d = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
		var d1 = Math.sqrt((m$.px-x1)*(m$.px-x1)+(m$.py-y1)*(m$.py-y1));
		var d2 = Math.sqrt((m$.px-x2)*(m$.px-x2)+(m$.py-y2)*(m$.py-y2));
		m$.pd = 0;
		if(d1/d < 0.2) { m$.pd = 1; }
		else if(d2/d < 0.2) { m$.pd = 2; }
	    }
	    else if(m$.el.childNodes.length > 0 && m$.el.getElementsByTagName('path').length > 0) {
		var vnode = m$.el.getElementsByTagName('path')[0];
		d = vnode.getAttribute('d') + " M" + m$.xOff(evt) + " " + m$.yOff(evt);
		vnode.setAttribute('d',d);
	    }
	}
    }

    this.mouseDragStart = function(evt) {
    
	//var selnode = m$.Editor().contentWindow.getSelection().anchorNode;
    }

    this.mouseDrag = function(evt) {
	evt.dataTransfer.effectAllowed = "none";
	evt.dataTransfer.dropEffect = "none";
    }

    this.mouseDragEnd = function(evt) {
	//var selnode = m$.Editor().contentWindow.getSelection().anchorNode;
	//dragVector(evt);
    }

    this.keyPressHandler = function(evt)  {
	if(m$.editMode != 0) {
	    var keyCode = evt.charCode || evt.keyCode;
	    if(keyCode < 37 || keyCode > 40)	{
		var frame = m$.getActiveFrame();
		var doc = frame.contentDocument;
		var selection = frame.contentWindow.getSelection();
		var node = selection.anchorNode;
		if(!(($(node).attr("name") == 'currentParaTUX') || $(node).parents("p[name=currentParaTUX]").get(0) || $(node).parents("tr[name=currentParaTUX]").get(0) || $(node).parents("div[name=currentParaTUX]").get(0))) {
		    evt.preventDefault();
		}
	    }
	    else if(m$.editMode == 1) {
		if(m$.el && m$.el.childNodes.length > 0) {
		    var dx=0;
		    var dy=0;
		    switch(keyCode) {
		    case 37: 
			dx = -10;
			break;
		    case 38:
			dy = -10;
			break;
		    case 39: 
			dx = 10;
			break;
		    case 40:
			dy = 10;
			break;
		    default:
		    }
		    var vnode = m$.getSVGObjectFromGroup();
		    if(evt.ctrlKey) {			
			m$.resizeSVGNode(vnode,dx,-1 * dy);
		    }
		    else {
			m$.moveSVGNode(vnode,dx,dy);
		    }
		}
	    }
	}
	else {
	}
    }

    this.moveSVGNodeTo = function() {
	if(arguments.length == 3) {
	    var vnode = arguments[0];
	    var x = parseInt(arguments[1]);
	    var y = parseInt(arguments[2]);
	    switch(vnode.nodeName) {
	    case 'circle':
	    case 'ellipse':
		vnode.setAttribute('cx',x);
	        vnode.setAttribute('cy',y);
	        break;
	    case 'rect':
		vnode.setAttribute('x',x);
		vnode.setAttribute('y',y);
		break;
	    case 'line':
		var x1 = parseInt(vnode.getAttribute("x1"));
		var x2 = parseInt(vnode.getAttribute("x2"));
		var y1 = parseInt(vnode.getAttribute("y1"));
		var y2 = parseInt(vnode.getAttribute("y2"));
		vnode.setAttribute('x1',x + (x1-x2)/2);
		vnode.setAttribute('y1',y + (y1-y2)/2);
		vnode.setAttribute('x2',x - (x1-x2)/2);
		vnode.setAttribute('y2',y - (y1-y2)/2);
		break;
	    case 'text':
		vnode.setAttribute('x',x);
		vnode.setAttribute('y',y);
		break;
	    case 'polygon':
		var p = vnode.getAttribute('points');
		var ps = p.split(" ");
		var xm = 0;
		var ym = 0;
		var psl = ps.length;
		for(var i=0; i < psl; i++) {
		    var x = parseInt(ps[i].split(",")[0]);
		    var y = parseInt(ps[i].split(",")[1]);
		    xm = xm + x;
		    ym = ym + y;
		}
		xm = xm/psl;
		ym = ym/psl;
		p = "";
		for(var i=0; i < psl; i++) {
		    var x = parseInt(ps[i].split(",")[0]);
		    var y = parseInt(ps[i].split(",")[1]);
		    x = x - xm;
		    y = y - ym;
		    ps[i] = x + "," + y;  
		}
		p = ps.join(" ");
		m$.logMessage("p: " + p);
		vnode.setAttribute('points', p);
		break;
	    default:
	    }
	}
	else {
	    m$.CodeArea().value = "Can't move this one!!";
	}
    }

    this.moveSVGNode = function() {
	if(arguments.length == 3) {
	    var vnode = arguments[0];
	    var dx = parseInt(arguments[1]);
	    var dy = parseInt(arguments[2]);
	    switch(vnode.nodeName) {
	    case 'circle':
	    case 'ellipse':
		var cx = parseInt(vnode.getAttribute('cx'));
	        var cy = parseInt(vnode.getAttribute('cy'));
	        var cdx = cx + dx;
	        var cdy = cy + dy;
	        vnode.setAttribute('cx',cdx);
	        vnode.setAttribute('cy',cdy);
	    break;
	    case 'rect':
		var x = parseInt(vnode.getAttribute('x'));
		var y = parseInt(vnode.getAttribute('y'));
		var xdx = x + dx;
		var ydy = y + dy;
		vnode.setAttribute('x',xdx);
		vnode.setAttribute('y',ydy);
        	break;
	    case 'line':
		var x1 = parseInt(vnode.getAttribute("x1"));
		var x2 = parseInt(vnode.getAttribute("x2"));
		var y1 = parseInt(vnode.getAttribute("y1"));
		var y2 = parseInt(vnode.getAttribute("y2"));
		vnode.setAttribute('x1', x1 + dx);
		vnode.setAttribute('y1', y1 + dy);
		vnode.setAttribute('x2', x2 + dx);
		vnode.setAttribute('y2', y2 + dy);
		break;
	    case 'text':
		var x = parseInt(vnode.getAttribute('x'));
		var y = parseInt(vnode.getAttribute('y'));
		var xdx = x + dx;
		var ydy = y + dy;
		vnode.setAttribute('x',xdx);
		vnode.setAttribute('y',ydy);
		break;
	    case 'polygon':
		var p = vnode.getAttribute('points');
		var ps = p.split(" ");
		for(var i=0; i < ps.length; i++) {
		    var x = parseInt(ps[i].split(",")[0]);
		    var y = parseInt(ps[i].split(",")[1]);
		    var xdx = x + dx;
		    var ydy = y + dy;
		    ps[i] = xdx + "," + ydy;
		}
		p = ps.join(" ");
		vnode.setAttribute('points', p);
		break;
	    default:
	    }
	}
	else {
	    m$.CodeArea().value = "Can't move this one!!";
	}
    }

    this.rescaleSVGNode = function() {
	if(arguments.length > 1) {
	    var vnode = arguments[0];
	    var sx = parseInt(arguments[1]);
	    var sy = sx;
	    if(arguments.length > 2) {
		sy = parseInt(arguments[2]);
	    }
	    switch(vnode.nodeName) {
	    case 'circle':
	    var r = parseInt(vnode.getAttribute('r'));
	    if(sx > 0) { vnode.setAttribute('r', r * sx); }
	    break;
	    case 'ellipse':
	    var rx = parseInt(vnode.getAttribute('rx'));
	    var ry = parseInt(vnode.getAttribute('ry'));
	    if(sx > 0) { vnode.setAttribute('rx', rx * sx); }
	    if(sy > 0) { vnode.setAttribute('ry', ry * sy); }
	    break;
	    case 'rect':
	    var width = parseInt(vnode.getAttribute('width'));
	    var height = parseInt(vnode.getAttribute('height'));
	    if(sx > 0) { vnode.setAttribute('width', width * sx); }
	    if(sy > 0) { vnode.setAttribute('height', height * sy); }
	    break;
	    default:
	    }
	}
    }

    this.resizeSVGNode = function() {
	if(arguments.length > 1) {
	    var vnode = arguments[0];
	    var dx = parseInt(arguments[1]);
	    var dy = 0;
	    if(arguments.length > 2) {
		dy = parseInt(arguments[2]);
	    }
	    switch(vnode.nodeName) {
	    case 'circle':
	    var r = parseInt(vnode.getAttribute('r'));
	    vnode.setAttribute('r', r + dx + dy);
	    break;
	    case 'ellipse':
	    var rx = parseInt(vnode.getAttribute('rx'));
	    var ry = parseInt(vnode.getAttribute('ry'));
	    vnode.setAttribute('rx', rx + dx);
	    vnode.setAttribute('ry', ry + dy);
	    break;
	    case 'rect':
	    var width = parseInt(vnode.getAttribute('width'));
	    var height = parseInt(vnode.getAttribute('height'));
	    vnode.setAttribute('width', width + dx);
	    vnode.setAttribute('height', height + dy);
	    break;
	    default:
	    }
	}
    }

    this.getSVGObjectFromGroup = function() {
	var node = m$.el;
	function extractSVGnode(node) {
	    var vnode = node;
	    if(!(node.nodeName.match(/^(circle|rect|polygon|ellipse|line|text|path)$/i))) {
		if(node.nodeType == Node.ELEMENT_NODE) {
		    for(var i=0; i < node.childNodes.length; i++) {		
			vnode = extractSVGnode(node.childNodes[i]);  
		    }
		}
	    }
	    return vnode;
	}
	return extractSVGnode(node);
    }

    this.dragVector = function(evt) {
	if(m$.md && m$.el.childNodes.length > 0) {
	    var vnode =  m$.getSVGObjectFromGroup();
	    switch(vnode.nodeName) {
	    case 'circle':
	    case 'ellipse':
	    case 'text':
	    case 'rect':
		if(evt.ctrlKey) {
		    var dx = 0;
		    var dy = 0;
		    if(Math.abs(m$.xOff(evt) - m$.px) > Math.abs(m$.yOff(evt) - m$.py)) {
			if(m$.xOff(evt) > m$.px) { dx = 1; }
			else { dx = -1; }
		    }
		    else {
			if(m$.yOff(evt) > m$.py) { dy = 1; }
			else { dy = -1; }
		    }
		    m$.resizeSVGNode(vnode,dx,dy);
		}
		else {
		    m$.moveSVGNodeTo(vnode,m$.xOff(evt),m$.yOff(evt));
		}
	    break;
	    case 'line': 
		switch(m$.pd) {
		case 0:
		    var x1 = parseInt(vnode.getAttribute('x1'));
		    var y1 = parseInt(vnode.getAttribute('y1'));
		    var x2 = parseInt(vnode.getAttribute('x2'));
		    var y2 = parseInt(vnode.getAttribute('y2'));
		    var x = (x1+x2)/2;
		    var y = (y1+y2)/2;
		    vnode.setAttribute('x1',x1 + m$.xOff(evt) - x);
		    vnode.setAttribute('y1',y1 + m$.yOff(evt) - y);
		    vnode.setAttribute('x2',x2 + m$.xOff(evt) - x);
		    vnode.setAttribute('y2',y2 + m$.yOff(evt) - y);
		    break;
		case 1:
		    vnode.setAttribute('x1',m$.xOff(evt));
		    vnode.setAttribute('y1',m$.yOff(evt));
		    break;
		case 2:
		    vnode.setAttribute('x2',m$.xOff(evt));
		    vnode.setAttribute('y2',m$.yOff(evt));
		    break;
		default:
		}
		break;
	    case 'path':
		var d = vnode.getAttribute('d');
		var xy = m$.xOff(evt) + " " + m$.yOff(evt);
		d += " L" + xy;
		vnode.setAttribute('d',d);
		//vnode.setAttribute('fill','#FFFFFF');
		//vnode.setAttribute('stroke','#000000');
		break;
	    default: 
	    }
	}
    }


    this.makeNotEditable = function() {
	var cd = m$.Editor().contentDocument;
	cd.designMode = 'off';
    }

    this.insertMarkup = function() {
	var mml = m$.textToMarkup(m$.InsertBox().value);
	m$.makeMathEdit("inserthtml",mml);
    }

    this.convert2math = function(doc,node) {
	var mmlnode = node.getElementsByTagName("math");
	for (var i=0; i<mmlnode.length; i++) {
	    mmlnode[i].parentNode.replaceChild(m$.createNamespace(doc,mmlnode[i],"http://www.w3.org/1998/Math/MathML"),mmlnode[i]);
	}
    }


    this.convert2svg = function(doc,node) {
	var svgnode = node.getElementsByTagName("svg");
	for (var i=0; i<svgnode.length; i++) {
	    svgnode[i].parentNode.replaceChild(m$.createNamespace(doc,svgnode[i],"http://www.w3.org/2000/svg"),svgnode[i]);
	}
    }


    this.createNamespace = function(doc,node,NS) {
	if (node.nodeType==1) {
	    var newnode = doc.createElementNS(NS, node.nodeName.toLowerCase());
	    for(var i=0; i < node.attributes.length; i++) {
		if(node.attributes[i].nodeName.match(/^[a-z]/i)) { 
		    newnode.setAttribute(node.attributes[i].nodeName.toLowerCase(), node.attributes[i].nodeValue);
		}
	    }
	    for (var i=0; i<node.childNodes.length; i++) {
		newnode.appendChild(m$.createNamespace(doc,node.childNodes[i],NS));
	    }
	    return newnode;
	}
	else {
	    var cnode = node.cloneNode(true);
	    return cnode;
	}
	alert("something wrong is here...");
    }




    this.makeColumns = function(cols) {
	$(m$.Editor().contentDocument.body).css('-moz-column-count', cols);
    }


    this.applyTUDStyle = function() {
	$(m$.Editor().contentDocument.body).css('-moz-column-count', cols);
    }

    this.textToMarkup = function(s) {
	if(s.match(/\$/)) {
	    s = m$.UTN28textToMathML(s);
	}
	else {
	    var sub = new XRegExp("_((?:\\p{L}|\\p{M}|\\p{N})+)","g");
	    var sup = new XRegExp("\\^((?:\\p{L}|\\p{M}|\\p{N})+)","g");
	    s = s.replace(sub,"<sub>$1</sub>");
	    s = s.replace(sup,"<sup>$1</sup>");
	}
	return s;
    };

    this.getClassValue = function(_class) {
	var classValue = "";
	if(typeof(_class) == "string") { classValue = _class; }
	else { classValue = _class.getAttribute('label'); }
	return classValue;
    };

    this.addClassToSel = function(_class) {
	m$.addClassToPara(_class);
    }
    this.addClassToDiv = function(_class) {
	var classValue = m$.getClassValue(_class);
	var selection = m$.Editor().contentWindow.getSelection(); 
	var fnode = selection.anchorNode;
	var lnode = selection.focusNode;
	var fpnode;
	var lpnode;

	if($(fnode).parents("p:first").html()) {
	    fpnode = $(fnode).parents("p:first");
	}
	else {
	    fpnode = $(fnode).parents("div:first");
	}

	if($(lnode).parents("p:first").html()) {
	    lpnode = $(lnode).parents("p:first");
	}
	else {
	    lpnode = $(lnode).parents("div:first");
	}


	/*---Stupid hack -- there must be a more elegant JQuery way of doing this--*/
	var html = fpnode.html();
	fpnode.html( "<tuxdiv class='" + classValue + "'></tuxdiv>" + html );
	html = lpnode.html();
	lpnode.html( html + "<tuxdiv></tuxdiv>");
	html = m$.Editor().contentDocument.body.innerHTML;
	html = html.replace(/(<p[^<>]*>)\s*<tux(div [^<>]+)><\/tuxdiv>/,"<$2>\n$1");
	html = html.replace(/<tuxdiv><\/tuxdiv>\s*<\/p>/,"</p></div>");
	$(m$.Editor().contentDocument.body).html(html);

    };


    this.addClassToPara = function(_class) {
	var classValue = m$.getClassValue(_class);
	var selection = m$.Editor().contentWindow.getSelection(); 
	var node = selection.anchorNode;
	var pnode;
	if($(node).parents("p:first").html()) {
	    pnode = $(node).parents("p:first");
	}
	else {
	    pnode = $(node).parents("div:first");
	}
	pnode.attr('class', classValue);
	m$.ParaStyleBox().value = pnode.attr('class');
	m$.CodeArea().value = pnode.html();

    };


    this.gid = function(id) {
	var doc = window.document;
	if(window.name && window.name.match(/^Preferences/)) {
	    doc = window.opener.document;
	}
	return doc.getElementById(id);
    }

    this.egid = function(id) {
	return m$.Editor().contentDocument.getElementById(id);
    }

    this.namedNodes = function(name) {
	var frame = m$.getActiveFrame();
	var doc = frame.contentDocument;
	return doc.getElementsByName(name);
    }

    this.cParas = function() {
	return m$.namedNodes("currentParaTUX");
    }

    this.cPara = function() {
	var cp = m$.cParas();
	var n;
	if(cp.length > 0) {
	    n = cp[0];
	}
	else if(m$.cParas.length > 1) {
	    n = cp[cParas.length];
	}
	return n;
    }

    this.askAndChangeParaTUX = function() {
	function changeParaTUX() {
	    var frame = m$.getActiveFrame();
	    var doc = frame.contentDocument;
	    m$.CodeArea().value = m$.normalizeSVG(m$.normalizeMath(m$.CodeArea().value));
	    m$.cPara().innerHTML = m$.CodeArea().value;
	    /*---Code To get the mfrac/msub/msup rigth for UTN28 text----*/
	    m$.utnFix(doc,"mfrac");
	    m$.utnFix(doc,"msub");
	    m$.utnFix(doc,"msup");
	    var cPs = m$.cParas();
	    if(m$.getGeckoVersion() < 2) { 
		for(var i=0; i<cPs.length; i++) {
		    m$.convert2math(doc,cPs[i]);
		    m$.convert2svg(doc,cPs[i]);
		}
	    }
	}

	if(m$.editMode != 0) {
	    var parser = new DOMParser();
	    try {
		var rgxp = new XRegExp("\\p{L}");
		var doctype = m$.getDoctype();
		var ld = doctype.length-7;
		var xmlString = m$.getDoctype() + m$.CodeArea().value.replace(/<br>/gi,"<br/>") + "</p>";
		var xmlDoc = parser.parseFromString(xmlString, "text/xml");
		if(xmlDoc.getElementsByTagName("parsererror").length > 100) {
		    var s = m$.formatParserErrorsAsString(xmlDoc,ld);
		    alert(s);
		}
		else {
		    if(m$.CodeArea().value.match(rgxp)) {
			if(confirm("Do you want to overwrite this para?")) {
			    changeParaTUX();
			}
		    }
		    else {
			if(confirm("This seems like an empty para. Do you still want to overwrite this para?")) {
			    changeParaTUX();
			}
		    }
		}
		
	    }	    
	    catch(e) {
		alert(e.message);
	    }	
	}
	else {
	    alert("This facility is not available in this mode");
	}
    }

    this.getDoctype = function() {
	var s = "<!DOCTYPE p [<!ENTITY nbsp '&#xA0;'><!ENTITY alpha '&#x3B1;'><!ENTITY beta '&#x3B2;'><!ENTITY gamma '&#x3B3;'><!ENTITY delta '&#x3B4;'><!ENTITY epsilon '&#x3B5;'><!ENTITY phi '&#x3B6;'>]><p>";
	return s;
    }
    this.formatParserErrorsAsString = function(xml,ld) {
	var ser = new XMLSerializer();
	var s = ser.serializeToString(xml);
	s = s.replace(/^Location:[^<>]*$/im,"");
	s = s.replace(/^Line\s+Number[^<>]*<sourcetext/im,"<sourcetext");
	s = s.replace(/<[^<>]+>/g,"");
	s = s.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");
	s = s.replace(/\<\!DOCTYPE p \[\<\!ENTITY[^\]]+\]>/,"");
	s = s.replace(/(^<p>|<\/p>$)/gm,"");
	var rgxp = new RegExp("^[-]{" + ld + "}","m");
	s = s.replace(rgxp,"");
	return s;
    }


    this.utnFix = function(doc,tag) {
	for(var i=0; i < doc.getElementsByTagName(tag).length; i++) {
	    var tagNode = doc.getElementsByTagName(tag)[i];
	    var _class="";
	    if(doc.getElementsByTagName(tag)[i].hasAttribute('class')) {
		_class = tagNode.getAttribute('class');
		if(_class == 'utnFix') {
		    var nextNode = tagNode.nextSibling;
		    var prevNode = tagNode.previousSibling;
		    tagNode.replaceChild(prevNode,tagNode.childNodes[0]);
		    tagNode.replaceChild(nextNode,tagNode.childNodes[1]);
		}
	    }
	}
    }

    this.reformatMath = function() {
	var doc = m$.Editor().contentDocument;
	if($(m$.cPara).html()) {
	    var html = $(m$.cPara).html();
	    html = m$.normalizeMath(html);
	    $(m$.cPara).html(html);
	    if(m$.getGeckoVersion() < 2) { 
		m$.convert2math(doc,cPara());
		m$.convert2svg(doc,cPara());
	    }
	}
    }

    this.removeHighlight = function() {
	var frame = m$.getActiveFrame();
	var doc = frame.contentDocument;
	var jdoc = $(doc);
	jdoc.find("[name=currentParaTUX]").removeAttr("name");
	jdoc.find("[style]").removeAttr("style");
	var jtdDot = jdoc.find("td[char=.]");
	jtdDot.textAlign(".");
    }

    this.insertNewPara = function() {
	var doc = m$.Editor().contentDocument;
	doc.body.innerHTML = doc.body.innerHTML.replace(/<br>\s*<\/p>/gi,"</p><p>&nbsp;&nbsp;&nbsp;&nbsp;</p>");
	doc.body.innerHTML = doc.body.innerHTML.replace(/<br>/gi,"</p><p>");
    }


    this.showDivStyle = function() {
	var doc = m$.Editor().contentDocument;
	var node = $(doc).find("[name=currentParaTUX]").get(0);
	m$.removeHighlight();
	if($(node).parents("div:first").html()) {
	    var nc = $(node).parents("div:first").attr('class');
	    m$.ParaStyleBox().value  = nc;
	    $(node).parents("div:first").attr('name', "currentParaTUX" );
	    m$.CodeArea().value = $(node).parents("div:first").html();
	}

	else if($(node).parents("body:first").html()) {
	    var nc = $(node).parents("body:first").attr('class');
	    m$.ParaStyleBox().value  = nc;
	    $(node).parents("body:first").attr('name', "currentParaTUX" );
	    m$.CodeArea().value = $(node).parents("body:first").html();
	}

	else
	    {
		alert('There is no div or body element to highlight');
	    }

    }

    this.showNestedStyles = function() {
	var frame = m$.getActiveFrame();
	var doc = frame.contentDocument;
	var selection = frame.contentWindow.getSelection();
	var snode = selection.getRangeAt(0).startContainer;
	$(snode).parents("div[class]").each(function() { 
		m$.ParaStyleBox().value += "<" + $(this).attr("class"); 
	    }); 
    }

    this.getActiveFrame = function() {
	var frame;
	switch(m$.editMode) {
	case 0 : frame = m$.Browser(); break;
	case 1 : frame = m$.Editor(); break;
	case 2 : frame = m$.Scratch(); break;
	}
	return frame;
    }

    this.showParaStyle = function() {
	m$.removeHighlight();
	var frame = m$.getActiveFrame();
	var doc = frame.contentDocument;
	var selection = frame.contentWindow.getSelection();
	var snode = selection.getRangeAt(0).startContainer;
	var enode = selection.getRangeAt(0).endContainer;
	var psnode = snode.parentNode;
	var penode = enode.parentNode;
	if(snode.nodeName.toLowerCase() == 'p' && snode.innerHTML.toLowerCase() == '<br>') {
	    snode.innerHTML = '&nbsp;'; 
	}
	var nn = "";
	var ptag = "";
	/*--Highlight switched on here--*/
	if($(snode).parents("tr:first").html()) {
	    m$.CodeArea().value = $(snode).parents("tr:first").html();
	    $(snode).parents("tr:first").attr('name', "currentParaTUX" );
	    nn = "tr";
	    ptag = "tr";
	}
	else if($(snode).parents("p:first").html()) {
	    m$.CodeArea().value = $(snode).parents("p:first").html();
	    $(snode).parents("p:first").attr('name', "currentParaTUX" );
	    nn = $(snode).parents("p:first").attr("class");
	    ptag = "p";
	}
	else if($(snode).parents("div:first").html()) {
	    m$.CodeArea().value = $(snode).parents("div:first").html();
	    $(snode).parents("div:first").attr('name', "currentParaTUX" );
	    nn = $(snode).parents("div:first").attr("class");
	    ptag = "div";
	}
	else {
	    m$.CodeArea().value = "Couldn\'t get small enough parent node...";
	}

	/*--ParaStyle set here--*/
	var np = $(snode).parents("*:first")[0].nodeName.toLowerCase();
	if(np == "span" &&
	   $(snode).parents("span:first").attr("class")) 
	    { nn = $(snode).parents("span:first").attr("class"); }
	else if (np.match(/^m/)) { nn = np; }
	m$.ParaStyleBox().value = nn;

	/*----Selection is reset in math elements----*/

	if($(snode).parents("span").html()) {
	    selection.removeAllRanges();
	    var range = m$.Editor().contentDocument.createRange();
	    range.selectNode(psnode.parentNode);
	    selection.addRange(range);

	    /*----Reset all selection objects----*/   
	    snode = selection.getRangeAt(0).startContainer;
	    enode = selection.getRangeAt(0).endContainer;
	    psnode = snode.parentNode;
	    penode = enode.parentNode;
	}

	/*---CodeArea selection calculated and set here---*/
	/*---Start node and selection start----*/
	var phtml = "";
	if(psnode.nodeName.toLowerCase() == ptag) {
	    phtml = m$.preNode(snode,"");
	    if(m$.getPref("showCodeWindow") == "1") {
		m$.CodeArea().selectionStart = phtml.length + selection.getRangeAt(0).startOffset;
	    }
	}
	else {
	    phtml = m$.preNode(snode,"");
	    phtml = m$.upNode(psnode,phtml,ptag);
	    if(m$.getPref("showCodeWindow") == "1") {
		m$.CodeArea().selectionStart = phtml.length + selection.getRangeAt(0).startOffset;
	    }
	}
	/*---End node and selection end----*/
	if(penode.nodeName.toLowerCase() == ptag) {
	    phtml = m$.preNode(enode,"");
	    if(m$.getPref("showCodeWindow") == "1") {
		m$.CodeArea().selectionEnd = phtml.length + selection.getRangeAt(0).endOffset;
	    }
	}
	else {
	    phtml = m$.preNode(enode,"");
	    phtml = m$.upNode(penode,phtml,ptag);
	    if(m$.getPref("showCodeWindow") == "1") {
		m$.CodeArea().selectionEnd = phtml.length + selection.getRangeAt(0).endOffset;
	    }
	}
    }



    this.upNode = function(cnode,prehtml,ptag) {
	var pnode = cnode.parentNode;
	var  otag = "";
	switch(cnode.nodeType) {
	case 1: otag = "<" + cnode.nodeName;
	    if(cnode.hasAttributes()) {
		var attrs = cnode.attributes;
		for(var i=0; i < attrs.length; i++) {
		    if(attrs[i].name.match(/^[a-z]+$/i)) {
			otag += " " + attrs[i].name + "='" + attrs[i].value + "'";
		    }
		}
	    }
	    otag += ">";
	    break;
	}
	prehtml += otag;
	prehtml = m$.preNode(cnode,prehtml);
	if(pnode && pnode.nodeName.toLowerCase() != ptag) {
	    prehtml = m$.upNode(pnode,prehtml,ptag);
	}
	else {
	    return prehtml;
	}
	return prehtml;
    }

    this.preNode = function(cnode,prehtml) {
	var pnode = cnode.previousSibling;
	if(pnode) {
	    switch(pnode.nodeType) {
	    case 1: var otag = "<" + pnode.nodeName;
		if(pnode.hasAttributes()) {
		    var attrs = pnode.attributes;
		    for(var i=0; i < attrs.length; i++) {
			if(attrs[i].name.match(/^[a-z]+$/i)) {
			    otag += " " + attrs[i].name + "='" + attrs[i].value + "'";
			}
		    }
		}
		otag += ">";
		var etag = "</" + pnode.nodeName + ">";
		var pHTML = "";
		if(pnode.innerHTML) {
		    pHTML = pnode.innerHTML;
		}
		else {
		    pHTML = m$.InnerHTML(pnode);
		}
		prehtml = otag + pHTML + etag + prehtml;
		prehtml = m$.preNode(pnode,prehtml);
		break;

	    case 3: prehtml = pnode.nodeValue + prehtml;
		prehtml = m$.preNode(pnode,prehtml);
		break;

	    case 7: prehtml = "<?" + pnode.nodeName + " " + pnode.nodeValue + "?>" + prehtml;
		prehtml = m$.preNode(pnode,prehtml);
		break;

	    case 8: prehtml = "<!--" + pnode.nodeValue + "-->" + prehtml;
		prehtml = m$.preNode(pnode,prehtml);
		break;

	    default: break;
	    }
	}
	else {
	    return prehtml;
	}
	return prehtml;
    }

    this.InnerHTML = function(node) {
	var text = "";
	var cnodes = node.childNodes;
	for(var i=0; i < cnodes.length; i++) {
	    var cnode = cnodes[i];
	    switch(cnode.nodeType) {
	    case 1: var otag = "<" + cnode.nodeName;
		if(cnode.hasAttributes()) {
		    var attrs = cnode.attributes;
		    for(var j=0; j < attrs.length; j++) {
			if(attrs[j].name.match(/^[a-z][a-z\-]+$/i)) {
			    otag += " " + attrs[j].name + "='" + attrs[j].value + "'";
			}
		    }
		}
		otag += ">";
		var etag = "</" + cnode.nodeName + ">";
		text += otag + m$.InnerHTML(cnode) + etag;
		break;

	    case 3: text += cnode.nodeValue;
		break;

	    case 7: text += "<?" + cnode.nodeName + " " + cnode.nodeValue + "?>";
		break;

	    case 8: text += "<!--" + cnode.nodeValue + "-->";
		break;

	    }
	}
	return text;
    }


    this.addMathvariant = function() {
	var selection = m$.Editor().contentWindow.getSelection();
	var node = selection.anchorNode.parentNode;
	if(node.nodeName.toLowerCase().match(/^m[ion]$/)) {
	    var mstr = m$.ParaStyleBox().value.match(/@(.+)$/);
	    var mv = mstr[0].replace(/@/,"");
	    $(node).attr("mathvariant", mv);
	    var doc = m$.Editor().contentDocument;
	    //m$.convert2math(doc,cPara());
	}
    }




    this.showFindDialog = function() {
	m$.Editor().contentWindow.find();
    }

    this.insertText = function() {
	if(m$.focused == "code") {
	    m$.insertTextInCodeArea();
	}
	else{
	    m$.insertMarkup();
	}
    }

    this.insertTextInCodeArea = function() {
	var txtarea = m$.CodeArea();
	if(txtarea.selectionStart) {
	    var text = "";
	    var scrollPos = txtarea.scrollTop;
	    var strPos = 0;
	    strPos = txtarea.selectionStart;
	    var endPos = 0;
	    endPos = txtarea.selectionEnd;
	    var front = (txtarea.value).substring(0,strPos);
	    var back = (txtarea.value).substring(endPos,txtarea.value.length);
	    var seltxt =  (txtarea.value).substring(strPos,endPos);
	    /*----Wrap tag around text----*/
	    if(m$.gid("markup-fragment").value.match(/^\<[a-z]/))  {
		var atext = m$.gid("markup-fragment").value.match(/^\<([a-z]+)$/i);
		var tag = atext[0].replace(/^\</,"");
		text = "<" +tag +">" + seltxt  + "</" +tag +">";
	    }
	    /*----Wrap parenthesis around MathML fragment----*/
	    else if(m$.gid("markup-fragment").value.match(/^([\(\[\{]+[\)\]\}]+)$/))  {
		var ofen = m$.gid("markup-fragment").value.replace(/^([\(\[\{]+)([\)\]\}]+)$/,"$1");
		var efen = m$.gid("markup-fragment").value.replace(/^([\(\[\{]+)([\)\]\}]+)$/,"$2");
		text =  m$.UTN28textToMathML(ofen) + seltxt  +  m$.UTN28textToMathML(efen);
	    }
	    /*----Convert to MathML fragment----*/
	    else {
		text = m$.gid("markup-fragment").value;
		text = m$.UTN28textToMathML(text);
	    }
	    txtarea.value=front+text+back;
	    strPos = strPos + text.length; 
	    txtarea.focus();
	    txtarea.scrollTop = scrollPos;
	    txtarea.selectionStart = strPos;
	    txtarea.selectionEnd = strPos;
	}
    }



    this.extractLabel = function(text) {
	var rgxp = new XRegExp("\\P{L}+","g");
	text = text.replace(rgxp,"_");
	text = text.replace(/_and_/,"_");
	return text;
    }

    this.applyXref = function() {
	var doc = m$.Editor().contentDocument.body;
	var docHTML = "";
	$(doc).find(".Paragraph,.paragraph").each(
						  function () { 
						      docHTML += "<p class=\"Paragraph\">" + $(this).html() + "</p>";
						  });
	//---------------------Numbered references----------------------//
	var xrgxp = new XRegExp("\\[(?:[1-9][0-9]*[a-z]?\\p{P}?\\s*)+\\]","g");	
	var matches = docHTML.match(xrgxp);
	if(matches) {
	    for (var i=0; i<matches.length; i++) {
		var mat = matches[i];
		var res = mat.replace(/([0-9]+)/g,"<a href='#bib$1' class='bibxref'>$1</a>");
		docHTML = docHTML.replace(mat,res);
	    }
	}

	//---------------------Implicit name and date references----------------------//
	var rgxp = new RegExp("\\(([^<>0-9\\)]+)([,]?\\s+)([0-9]{4}[a-z]?)\\)","g");
	matches = docHTML.match(rgxp);
	if(matches) {
	    for (var i=0; i<matches.length; i++) {
		var mat = matches[i];
		if(mat.match(rgxp)) {
		    var s1 = RegExp.$1; var s2 = RegExp.$2; var s3 = RegExp.$3;
		    var res = "(<a href='#bib_" + m$.extractLabel(s1) + s3 + "'  class='bibxref'>" + s1 + s2 + s3 + "</a>)";
		    docHTML = docHTML.replace(mat,res);
		}
	    }
	}
	//---------------------Explicit name and date references----------------------//
	xrgxp = new XRegExp("((?:(?:[A-Z]\\p{L}+|and)\\p{P}?\\s+)+)\\(([0-9]{4}[a-z]?)\\)","g");
	matches = docHTML.match(xrgxp);
	if(matches) {
	    for (var i=0; i<matches.length; i++) {
		var mat = matches[i];
		if(mat.match(xrgxp)) {
		    var s1 = RegExp.$1; var s2 = RegExp.$2;
		    var res = "<a href='#bib_" + m$.extractLabel(s1) + s2 + "'  class='bibxref'>" + s1  + "(" + s2 + ")</a>";
		    docHTML = docHTML.replace(mat,res);
		}
	    }
	}
	docHTML = docHTML.replace(/<p\s+[^<>]+>/g,"");
	var strArray = docHTML.split("</p>");
	$(doc).find(".paragraph, .Paragraph").each(
						   function (i) { 
						       $(this).html(strArray[i]);
						   });

    }

    this.quitMuLTiFlow = function(aForceQuit) {
	var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].
	getService(Components.interfaces.nsIAppStartup);

	// eAttemptQuit will try to close each XUL window, but the XUL window can cancel the quit
	// process if there is unsaved data. eForceQuit will quit no matter what.
	var quitSeverity = aForceQuit ? Components.interfaces.nsIAppStartup.eForceQuit :
	Components.interfaces.nsIAppStartup.eConsiderQuit;
	appStartup.quit(quitSeverity);
    }




    this.LaTeXToUTN28 = function(text) {
	//text = text.replace(//,"&$1;")
	return text;
    }


    this.UTN28textToMathML = function(text) {

	var math = false;
	if(text.match(/\$/)) {
	    math = true;
	    text = text.replace(/\$/g,"");
	}
	text = text.replace(/\"([^\"]+)\"/g,"<mtext>$1</mtext>");

	var rgxp = new XRegExp("(\\p{S}+)","g");
	text = text.replace(rgxp,"<mo>$1</mo>");

	rgxp = new XRegExp("(\\&?\\p{L}+;?)","g");
	text = text.replace(rgxp,"<mi>$1</mi>");

	rgxp = new XRegExp("(\\p{N}+)","g");
	text = text.replace(rgxp,"<mn>$1</mn>");

	text = text.replace(/(<\/?)<mi>(mo|mn|mtext)<\/mi>(>)/g,"$1$2$3");

	text = text.replace(/([\{]+)\1/g,"<mfenced open='&lcub;'><mrow>");
	text = text.replace(/([\(]+)\1/g,"<mfenced open='&lpar;'><mrow>");
	text = text.replace(/([\[]+)\1/g,"<mfenced open='&lbrk;'><mrow>");

	text = text.replace(/([\}\)\]]+)\1/g,"</mrow></mfenced>");

	text = text.replace(/([\{\(\[]+)/g,"<mrow>");
	text = text.replace(/([\}\)\]]+)/g,"</mrow>");

	text = text.replace(/<mfenced open='\&lcub;'>/g,"<mfenced open='{'>");
	text = text.replace(/<mfenced open='\&lpar;'>/g,"<mfenced open='('>");
	text = text.replace(/<mfenced open='\&lbrk;'>/g,"<mfenced open='['>");
	/* more stupid fixes...*/
	text =  text.replace(/<mo>(\_|\^)<\/mo>/g,"$1");

	text = text.replace(/(<\/(?:mfenced|mrow)>)\/(<(?:mfenced|mrow))/g,"$1<mfrac class='utnFix'><mi>xxx</mi><mi>xxx</mi></mfrac>$2");

	text = text.replace(/\_/g,"<msub class='utnFix'><mi>xxx</mi><mi>xxx</mi></msub>");
	text = text.replace(/\^/g,"<msup class='utnFix'><mi>xxx</mi><mi>xxx</mi></msup>");

	if(math) {
	    text = "<math>" + text + "</math>";
	}

	return text;
    }


    this.getPopAuthorInMendeley =  function() {
	var author_url = 'http://www.mendeley.com/oapi/stats/authors?consumer_key=47a6d716ae40f188f436977f2b0d908f04e374110';
	var str = "";
	$.ajax({
		type: "GET",
		    url: author_url,
		    async: false,
		    dataType: "json",
		    success: function(data) {
		    $.each(data,function() {
			    var name = this.name;
			    var pub_url = "http://www.mendeley.com/oapi/documents/authored/" + name + "?consumer_key=47a6d716ae40f188f436977f2b0d908f04e374110";
			    $.ajax({
				    type: "GET",
					url: pub_url,
					async: false,
					dataType: "json",
					success: function(ddata) {
					str = str + "<li><p>name: " + name + "<br> No. of documents: " + ddata.documents.length + "<br> document-title: " + ddata.documents[0].title + "</p></li>";
				    }
				});
			});
		}
	    });
	return str;
    }

    this.markAllHyphenatedWords = function() {

	$(m$.Editor().contentDocument).find("*").contents()
	.filter( function() { return this.nodeType == 3; } )
	.replaceWith(function () { return this.nodeValue.replace(/(?=\b)([a-z]+\-[a-z]+)(?=\b)/gi,"<hyph>$1</hyph>")
	    });
    }

    this.markAllSentenceBreaks = function() {
	$(m$.Editor().contentDocument).find("*").contents()
	.filter( function() { return this.nodeType == 3; } )
	.replaceWith(function () {
		var txt = this.nodeValue;
		if(this.parentNode.nodeName.match(/^(p|td)$/i)) {
		    txt = txt.replace(/([^A-Z][.])([\s\r\n]+[A-Z])/g,"$1<br/>$2");
		}
		return txt;
	    });
    }

    this.markAllPersonNames = function() {

	$(m$.Editor().contentDocument).find("*").contents()
	.filter( function() { 
		return this.nodeType == 3; 
	    })
	.replaceWith(function () {
		var txt = this.nodeValue;
		txt = txt.replace(/(?=\b)([A-Z][a-z]+\s+(?:(?:von|der|de)\s+)?[A-Z][a-z]+)(?=\b)/g,"<pn>$1</pn>");
		//txt = txt.replace(rgxp,"<pn>$1</pn>");
		return txt;
	    });
    }

    this.LaTeXMLFilter = function() {
	m$.mapClassToTag("div.navbar;");
	m$.mapClassToTag("span.bold.italic;b>i", "span.italic;i", "span.bold;b", "span.typewriter;tt", "span.smallcaps;sm");
	m$.mapClassToTag("h1.title;p.ArticleTitle","div.abstract>h6;p.AbstractTitle","div.personname;p.Authors","div.abstract>p.p;p.AbstractPara");
	m$.mapClassToTag("h2.section-title;p.SectionA","h3.section-title;p.SectionB","h4.section-title;p.SectionC");
	m$.mapClassToTag("div.table>div.caption;p.TableCaption","div.figure>div.caption;p.FigCaption","h2.bibliography-title;p.References","ul.biblist;div.biblist","div.bibblock;span.RefItem","li.bibitem;p.BibItem");
    }

    this.HTMLFilter = function() {
	m$.mapClassToTag("h1;p.SectionA","h2;p.SectionB","h3;p.SectionC","h4;p.SectionD","h5;p.SectionE","h6;p.SectionF","address;p.Affiliation","em;i","strong;b");
    }

    this.mapClassToTag = function() {
	var tags;
	var html;
	for(var i = 0; i < arguments.length; i++) {
	    var arg = arguments[i];
	    var _class = arg.replace(/;.*$/,"");
	    var tags = arg.replace(/^[^;]+;/,"").split(">");
	    var doc = m$.Editor().contentDocument;
	    if($(doc).find(_class).length > 0) { 
		$(doc).find(_class).replaceWith(function () {
			html = $(this).html();
			for(var j=0; j < tags.length; j++) {
			    var etag = tags[j];
			    var otag = etag.replace(/[.]([^.]+)/g," class='$1'");
			    if(etag=="") { html = ""; }
			    else {
				html = "<" + otag + ">" + html + "</" + etag + ">"
				    }
			}
			return html;
		    });
	    }
	}
    }


    this.styleTableColumn = function() {

	var cols = prompt("Table Column Alignment(s):","").split(",");
	for(var i=0; i<cols.length; i++) {
	    var col = cols[i];
	    var colnum = col.replace(/^([0-9]+).*$/,"$1");
	    var colalign = col.replace(/^[0-9]+(.*)$/,"$1");
	    var align = colalign;
	    switch(colalign) {
	    case "l": align="left"; break; 
	    case "r": align="right"; break; 
	    case "c": align="center"; break; 
	    case "j": align="justify"; break;
	    default: align="char"; break;
	    }
	    var doc = m$.Editor().contentDocument;
	    var jtable = $(doc).find("tr[name=currentParaTUX]").parents("table");
	    jcol = jtable.find("td:nth-col(" + colnum + ")");
	    jcol.attr("align",align);
	    if(align=="char") {
		jcol.textAlign(colalign).attr("char",colalign);
	    }
	}

    }


    this.removeTableColumn = function() {

	var cols = prompt("Columns to Remove:","").split(",");
	var scols = "";
	for(var i=0; i<cols.length; i++) {
	    if(i==0) {
		scols += m$.expandNumRange(cols[i]);
	    }
	    else {
		scols += "," + m$.expandNumRange(cols[i]);
	    }
	}
	cols = scols.split(",");
	cols.sort(function(a, b) {
		return b[0] - a[0];
	    });

	for(var i=0; i<cols.length; i++) {
	    var col = cols[i];
	    if(col.match(/^[0-9]+$/)) {
		var doc = m$.Editor().contentDocument;
		var jtable = $(doc).find("tr[name=currentParaTUX]").parents("table");
		jcol = jtable.find("td:nth-col(" + col + ")" + "," + "th:nth-col(" + col + ")");
		jcol.remove();
	    }
	}
    }

    this.removeTableRow = function() {

	var rows = prompt("Columns to Remove:","").split(",");
	var srows = "";
	for(var i=0; i<rows.length; i++) {
	    if(i==0) {
		srows += m$.expandNumRange(rows[i]);
	    }
	    else {
		srows += "," + m$.expandNumRange(rows[i]);
	    }
	}
	rows = srows.split(",");
	rows.sort(function(a, b) {
		return b[0] - a[0];
	    });

	for(var i=0; i<rows.length; i++) {
	    var row = rows[i];
	    if(row.match(/^[0-9]+$/)) {
		var doc = m$.Editor().contentDocument;
		var jtable = $(doc).find("tr[name=currentParaTUX]").parents("table");
		jrow = jtable.find("tr:nth-child(" + row + ")");
		jrow.remove();
	    }
	}
    }

    this.addTableColumn = function() {

	var cols = prompt("Add column after:","").split(",");
	var scols = "";
	for(var i=0; i<cols.length; i++) {
	    if(i==0) {
		scols += m$.expandNumRange(cols[i]);
	    }
	    else {
		scols += "," + m$.expandNumRange(cols[i]);
	    }
	}
	cols = scols.split(",");
	cols.sort(function(a, b) {
		return a[0] - b[0];
	    });

	for(var i=0; i<cols.length; i++) {
	    var col = m$.expandNumRange(cols[i]);
	    if(col.match(/^[0-9]+$/)) {
		var doc = m$.Editor().contentDocument;
		var jtable = $(doc).find("tr[name=currentParaTUX]").parents("table");
		jcol = jtable.find("td:nth-col(" + col + ")" + "," + "th:nth-col(" + col + ")");
		jcol.after(function () {
			var tag = m$.nodeName;
			var otag = "<" + tag + ">";
			var etag = "</" + tag + ">";
			return otag + "xx" + etag;
		    });
	    }
	}
    }

    this.addTableRow = function() {

	var rows = prompt("Add row after:","").split(",");
	var srows = "";
	for(var i=0; i<rows.length; i++) {
	    if(i==0) {
		srows += m$.expandNumRange(rows[i]);
	    }
	    else {
		srows += "," + m$.expandNumRange(rows[i]);
	    }
	}
	rows = srows.split(",");
	rows.sort(function(a, b) {
		return a[0] - b[0];
	    });

	for(var i=0; i<rows.length; i++) {
	    var row = rows[i];
	    if(row.match(/^[0-9]+$/)) {
		var doc = m$.Editor().contentDocument;
		var jtable = $(doc).find("tr[name=currentParaTUX]").parents("table");
		jcol = jtable.find("tr:nth-child(" + row + ")");
		jcol.after(function () {
			var cols =m$.innerHTML;
			return "<tr>" +  cols + "</tr>";
		    });
	    }
	}
    }

    this.expandNumRange = function(s) {
	var start = parseInt(s.replace(/^([0-9]+)-([0-9]+)$/,"$1"));
	var end = parseInt(s.replace(/^([0-9]+)-([0-9]+)$/,"$2"));
	if(start > end) { var st = start; start = end; end = st; }
	s  = "";
	for (var i=start; i<end+1; i++) {
	    if(i==start) { s += i; }
	    else { s += "," + i; }
	}
	return s;
    }

    this.setPref = function(pref,value) {
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	var branch = prefs.getBranch("extensions.multiflow.");
	var rf = Components.classes["@mozilla.org/pref-localizedstring;1"]
	.createInstance(Components.interfaces.nsIPrefLocalizedString);

	rf.data = value;
	branch.setComplexValue(pref, Components.interfaces.nsISupportsString,rf);
    }

    this.getPref = function(pref) {
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	var branch = prefs.getBranch("extensions.multiflow.");
	return branch.getComplexValue(pref, Components.interfaces.nsISupportsString).data;
    }
    
    /*---end-of-multiflow--*/
}

