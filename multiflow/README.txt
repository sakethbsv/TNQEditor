MuLTiflow Version 1.0 dated July 2010, Copyright @ S.K.Venkatesan, B. Manoponni and G.K.Venkatesan (TNQ Books and Journals, Chennai: http://www.tnq.co.in, skvenkat@tnq.co.in or suki.venkat@gmail.com)
Licensed under GPL version 3 (see COPYING.txt)
 

*************************************************************
                      Installation Notes                     
*************************************************************


Standalone MuLTiFlow application
-------------------------------------------------------------

We support standalone MuLTiFlow application as a Debian Package.


---------------------------------------------------------------------
For standalone debugging use:
$ multiflow -jsconsole
For debuuging on Firefox set these options (using about:config URL):
javascript.options.showInConsole
javascript.options.strict
nglayout.debug.disable_xul_cache
browser.dom.window.dump.enabled
----------------------------------------------------------------

How to use MuLTiFlow as a Firefox add-on
-------------------------------------------------------------

(i) Open multiflow.xpi using Firefox Browser File->Open command and Install MuLTiFlow extension

(ii) Restart Firefox

(iii) In Firefox click on the menu, Tools->MuLTiFlow Editor

(iv) MuLTiFlow editor/browser will now open in its own independent window

(v) MuLTiFlow comes with its own browser (ctrl+q toggle for browser/editor), so you can even close Firefox that triggered MuLTiFlow and use it for Browsing instead of Firefox.



User Notes
-------------------------------------------------------------

(i) BugZilla entry is yet to be created... so report bugs to skvenkat@tnq.co.in or suki.venkat@gmail.com

Developer Notes
-------------------------------------------------------------

(i) MuLTiFlow menu is at  chrome/content/editor.xul

(ii) Most of the Javascript coding is in chrome/content/js/editor.js

(iii) multiflow.xpi is a zip of the files+folders in the SVN trunk


Acknowledgments
-----------------
(i) Amartyo Banerjee (amartyo@gmail.com) convinced me beyond doubt that MuLTiFlow must be released under GPL v3 and taught me all the open source conventions.
(ii) Simon Pepping (sam.pepping@gmail.com) provided the Dutch, German and French translations apart from other useful contributions.


