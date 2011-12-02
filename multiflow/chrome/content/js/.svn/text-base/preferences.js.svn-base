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
var p$ = new MuLTiFlowPreferences();
function MuLTiFlowPreferences() {
    this.prefInit = function() {

	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	var branch = prefs.getBranch("extensions.multiflow.");
	p$.pgid("showCodeWindow").value = branch.getComplexValue("showCodeWindow", Components.interfaces.nsISupportsString).data;;
	p$.pgid("perlPath").value = branch.getComplexValue("perlPath", Components.interfaces.nsISupportsString).data;
	p$.pgid("abiwordPath").value = branch.getComplexValue("abiwordPath", Components.interfaces.nsISupportsString).data;
	p$.pgid("latexmlPath").value = branch.getComplexValue("latexmlPath", Components.interfaces.nsISupportsString).data;
	p$.pgid("columns").value = branch.getComplexValue("columns", Components.interfaces.nsISupportsString).data;
	p$.pgid("styleTheme").value = branch.getComplexValue("styleTheme", Components.interfaces.nsISupportsString).data;
	window.addEventListener("close",p$.restartApp, false);
    }


    this.pgid = function(id) {

	return window.document.getElementById(id);
    }

    this.restartApp = function() {

	if(window.name != 'Preferences-XUL') {
	    window.close();
	    startMuLTiFlowEditor();
	}
	else {
	    // Restart application
	    var appStartup = Components.classes["@mozilla.org/toolkit/app-startup;1"]
	    .getService(Components.interfaces.nsIAppStartup);
	
	    appStartup.quit(Components.interfaces.nsIAppStartup.eRestart |
			    Components.interfaces.nsIAppStartup.eForceQuit);
	}
    }

    this.startMuLTiFlowEditor = function() {
	var features = "chrome=yes,alwaysLowered=no,alwaysRaised=no,centerscreen=yes,dependent=no,dialog=no,menubar=yes,modal=no,minimizable=yes,resizable=yes,width=1024,height=700";
	var url = "chrome://multiflow/content/editor.xul";
	window.open(url, "_blank", features);
    }

}
