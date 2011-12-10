<?php
//header("Location: localhost/editor/backup.html");
if ((($_FILES["file"]["type"] != "image/gif")
|| ($_FILES["file"]["type"] != "image/jpeg")
|| ($_FILES["file"]["type"] != "image/pjpeg")))
  {
  if ($_FILES["file"]["error"] > 0)
    {
    //echo "Return Code: " . $_FILES["file"]["error"] . "<br />";
    }
  else
    {
    //echo "Upload: " . $_FILES["file"]["name"] . "<br />";
    //echo "Type: " . $_FILES["file"]["type"] . "<br />";
    //echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br />";
    //echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br />";

    if (file_exists("upload/" . $_FILES["file"]["name"]))
      {
      //echo $_FILES["file"]["name"] . " already exists. ";
      }
    else
      {
      move_uploaded_file($_FILES["file"]["tmp_name"],
      "upload/" . $_FILES["file"]["name"]);
      //echo "Stored in: " . "upload/" . $_FILES["file"]["name"] . "<br />";
      //echo "wtf";
      //echo $_FILES["file"]["name"];
      $uploaded_file = $_FILES["file"]["name"];
      }
    }
  }
else
  {
  //echo "Invalid file";
  }

//exec('mkdir saketh');
//echo exec('whoami');
//exec(chmod -R 777 /var/www);
//echo "wtf1";
$cmd = "abiword --to=html" . " " . "/var/www/fmath_formula-demo-plugin-CKEditor-v3.6.1-b1020/upload/" . $_FILES["file"]["name"];
//echo "this is the cmd:" . $cmd;
exec($cmd);
//echo "wtf2";

//chmod ( $uploaded_file, 0644 );
//exec(chmod ($uploaded_file, 0644));
//echo exec('pdftohtml /var/www/ileupload/1.pdf');
?>
<html>
<head>
	<title>CKEditor Site</title>
	<script type="text/javascript" src="ckeditor.js"></script>
</head>
<body>


<!--<button id="button1" onclick="onclickhandler()">Insert</button>-->




		<textarea cols="80" id="editor1" name="editor1" rows="10">
			<p>
					This is some example text that you can edit inside the <strong>CKEditor editor</strong>.<br>
					Click on <img src="/plugins/CKEditor/plugins/fmath_formula/fmath_formula.jpg" border="0" align="middle"><b>"Add MathML Formula"</b> button to insert an equation.<br><br><br>

			</p>
		</textarea>
        <button id="MathMLbutton" onclick="onclickhandler()">getMathML</button>
	<button id="editMath" onclick="editmathhandler()">editMath</button>
		<script type="text/javascript">
		//<![CDATA[

			CKEDITOR.replace( 'editor1',
				{
					fullPage : true
				});

		//]]>
		</script>
        <script type="text/javascript">
		function editmathhandler(){
			//alert('edit math has been clicked');
			str1 = parent.CKEDITOR.plugins.get('fmath_formula').getCurrentMathML();
			CKEDITOR.instances.editor1.getCommand('fmath_formula').exec();
			var iframe = document.getElementById('iframeMathmlEditorcke_1');
			var innerDoc = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;
			innerDoc['editML'].setMathML(str1);
		}

		var ei1;
		function onclickhandler(){
			alert('button has been clicked');
		//var formulaSwf = getSWF('MathMLEq4');
		//formulaSwf.setMathML('<mrow><mo>&#x20A8;</mo><mo>&#x2181;</mo><mo selected="true">&angmsdaf;</mo></mrow>');
		//var formulaSwf = getSWF('MathMLEq1');
		//var mathML = editor1.getMathML();
		//alert(mathML);
		var editor_data = CKEDITOR.instances.editor1.getData();
		//alert(editor_data);
		//ei1 = CKEDITOR.instances.editor1;
		//alert(ei1);
		try{
		//var math_data = CKEDITOR.instances.editor1.getCurrentMathML();
		var math_data = parent.CKEDITOR.plugins.get('fmath_formula').getCurrentMathML();
		alert(math_data);}
		catch(e){alert('error:\n'+e)};
		}
		var put_math1 = '<mrow><mo selected="true">&beth;</mo></mrow>';
		var put_math2 = 'mrow><msup><mtext>e</mtext><msup mathsize="12"><mtext>x</mtext><mtext selected="true">x</mtext></msup></msup></mrow>';
		var iframe = document.getElementById('iframeMathmlEditorcke_1');
		//iframeMathmlEditorcke_1
		var innerDoc = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;
		innerDoc.getElementById('editML')
		</script>


</body>
</html>
