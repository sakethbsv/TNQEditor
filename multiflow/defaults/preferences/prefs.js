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
/* debugging prefs */
pref("browser.dom.window.dump.enabled", true);
pref("javascript.options.showInConsole", true);
pref("javascript.options.strict", true);
pref("nglayout.debug.disable_xul_cache", true);
pref("nglayout.debug.disable_xul_fastload", true);

pref("toolkit.defaultChromeURI", "chrome://multiflow/content/editor.xul");
/*--Initialize settings here--*/
pref("extensions.multiflow.styleTheme","Black-on-Wheat");
pref("extensions.multiflow.columns","1");
pref("extensions.multiflow.showCodeWindow","1");
pref("extensions.multiflow.perlPath","/usr/bin/perl");
pref("extensions.multiflow.abiwordPath","/usr/bin/abiword");
pref("extensions.multiflow.latexmlPath","/usr/local/bin/latexml");
pref("extensions.multiflow.docTitle","Multiflow Document");
pref("extensions.multiflow.author","Bourbaki");
pref("extensions.multiflow.recentFile","");



/* Ignore OS locale setting */
pref("intl.locale.matchOS", "false");
/* Default locale */
pref("general.useragent.locale", "en-US");
/* Allow scripts to close window */
pref("dom.allow_scripts_to_close_windows", true);
pref('accessibility.browsewithcaret', true);



