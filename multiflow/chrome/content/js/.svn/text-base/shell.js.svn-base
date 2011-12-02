var cmd$ = new shellCmd();
function shellCmd() {
    function runShellCommand(cmd,args) {
	var file = Components.classes["@mozilla.org/file/local;1"]
	    .createInstance(Components.interfaces.nsILocalFile);
	file.initWithPath(cmd);
	if(file.exists()) {
	    var process = Components.classes["@mozilla.org/process/util;1"]
		.createInstance(Components.interfaces.nsIProcess);
	    process.init(file);
	    process.run(true, args, args.length);
	}
	else {
	    alert(cmd + " doesn't exist; please update the correct path to the binary in the Settings menu");
	}
    }

    function runPerl(args) {
	var perlPath = m$.getMuLTiFlowPref("perlPath");
	cmd$.runShellCommand(perlPath,args);
    }

    function runAbiword(args) {
	var abiwordPath = m$.getMuLTiFlowPref("abiwordPath");
	runShellCommand(abiwordPath,args);
    }

    function runLaTeXML(args) {
	var latexmlPath = m$.getMuLTiFlowPref("latexmlPath");
	runShellCommand(latexmlPath,args);
    }

    function runLaTeXMLpost(args) {
	var latexmlpostPath = m$.getMuLTiFlowPref("latexmlPath") + "post";
	runShellCommand(latexmlpostPath,args);
    }

}