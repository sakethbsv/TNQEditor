CKEDITOR.plugins.add('upload',{
    requires: ['iframedialog'],
    init:function(a){
        CKEDITOR.dialog.addIframe('upload_dialog', 'Image sample', this.path + "backup.php",650,500,function(){/*oniframeload*/})
        var cmd = a.addCommand('upload', {exec:upload_onclick})
        cmd.modes={wysiwyg:1,source:1}
        cmd.canUndo=false
        a.ui.addButton('upload',{ label:'Upload a file', command:'upload', icon:this.path+'crap.png' })
    }
})

function upload_onclick(e)
{
    // run when custom button is clicked
    CKEDITOR.instances.editor1.openDialog('upload_dialog')
}
//editor.insertHtml(value);
/*CKEDITOR.plugins.add( 'sample',
{
	init: function( editor )
	{
		// Plugin logic goes here...
	}
});
editor.addCommand( 'sampleDialog', new CKEDITOR.dialogCommand( 'sampleDialog' ) );
editor.ui.addButton( 'sample',
{
	label: 'Insert a Link',
	command: 'sampleDialog',
	icon: this.path + 'megan.png'
});
*/
/*(function(){
     //The Code is written here, which will be executed when the button is clicked
     var a= {
     exec:function(editor){
		 alert("1");
       //      CKEDITOR.instances.txtDescrip.insertHtml("<img src='http://truelogic.org/simple/images/true.png' border=0 />");
     //CKEDITOR.instances.ID OF THE TEXTAREA.insertHtml("IMAGE URL");
     //above line inserts an IMG tag with the predefined url of the image which points to the truelogic logo
              }
},

//The actual button is defined/created here and the associated code is linked with it
b='sample';
CKEDITOR.plugins.add(b,{
    init:function(editor){
    editor.addCommand(b,a); // associating the executable code with the button
    editor.ui.addButton('sample',{
                                     label:'Insert image',
                                     icon: this.path + 'megan.png',
                          //defining the path of the icon image which will be displayed on the toolbar for this button
                          //easiest would be to have the icon image in the same folder as the plugin.js

                                     command:b
                             });
   }
});
})();
*/
