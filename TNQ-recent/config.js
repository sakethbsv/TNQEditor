/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.addExternal('fmath_formula', 'plugins/fmath_formula/', 'plugin.js');


CKEDITOR.editorConfig = function( config )
{
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.height=400;
	var pl1,pl2,pl3;
	pl1 = 'fmath_formula';
	pl2 = 'sample';
	pl3 = 'upload';
	//config.extraPlugins = 'fmath_formula';
	
       // Add the button to toolbar
	config.toolbar = [ 
	['Templates', 'Styles','Format','Font','FontSize','TextColor','BGColor','Maximize','Image'], 
	['Source'], 
	['Bold','Italic','Underline','Strike','-','Subscript','Superscript','-','fmath_formula','sample','upload'], 
	['Table','HorizontalRule'], 
	['NumberedList','BulletedList','-','Outdent','Indent','Blockquote','preview',]
	]

config.extraPlugins = 'fmath_formula,sample,upload';
//config.extraPlugins = 'upload';
	config.contentsCss='http://localhost/fmath_formula-demo-plugin-CKEditor-v3.6.1-b1020/css/tux.css';
	config.font_names='ESSTIXThirteenRegular/ESSTIXThirteenRegular:'+config.font_names;
	
};
