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
	
</head>
<body>


<!--<button id="button1" onclick="onclickhandler()">Insert</button>-->


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	
	<meta content="text/html; charset=utf-8" http-equiv="content-type" />
	<script type="text/javascript" src="ckeditor.js"></script>
</head>
<body>
	
<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post"
enctype="multipart/form-data">
<label for="file">Filename:</label>
<input type="file" name="file" id="file" />
<br />
<input type="submit" name="submit" value="Submit" onClick="filename()"/>
</form>
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
<script type="text/javascript">
function filename(){
var oForm = document.forms[0];
var fname = oForm.elements["file"].value;
//alert(fname);
//alert("before");
var f = fname.replace(/[.][a-z]+$/,"");
//alert("after");
var path = "upload/" + f + ".html";
//alert(path);

}

function ahah(url, target) {
  document.getElementById(target).innerHTML = ' Fetching data...';
  if (window.XMLHttpRequest) {
    req = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    req = new ActiveXObject("Microsoft.XMLHTTP");
  }
  if (req != undefined) {
    req.onreadystatechange = function() {ahahDone(url, target);};
    req.open("GET", url, true);
    req.send("");
  }
}  

function ahahDone(url, target) {
  if (req.readyState == 4) { // only if req is "loaded"
    if (req.status == 200) { // only if "OK"
      document.getElementById(target).innerHTML = req.responseText;
    } else {
      document.getElementById(target).innerHTML="Upload sum file ";
    }
  }
}

function load(name, div) {
	ahah(name,div);
	return false;
}

function onclickhandler(){
//alert("here");
//load('upload/tenSigmas.html','editor1');
//alert("next");
}
//alert(path);
var path = '<?php echo $_FILES["file"]["name"] ?>';
var f = path.replace(/[.][a-z]+$/,"");
path = 'upload/' + f + ".html";
//alert(path);
//load(path,'editor1');
load(path,'editor1');
//document. getElementById("editor1"). innerHTML = "from page";
</script>

</body>
</html>
