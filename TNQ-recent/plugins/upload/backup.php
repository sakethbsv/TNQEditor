
<html>
<head>
	<title>Sample CKEditor Site</title>
	<script type="text/javascript" src="/ckeditor/ckeditor.js"></script>
</head>
<body>
<form action="crap.php" method="post"
enctype="multipart/form-data">
<label for="file">Filename:</label>
<input type="file" name="file" id="file" />
<br />
<input type="submit" name="submit" value="Submit" onClick="filename()"/>
</form>
<textarea id="seditor1" name="seditor1">Initial value.</textarea>
<!--<button id="button1" onclick="onclickhandler()">Insert</button>

	<form method="post">
		<p>
			My Editor:<br />
			
			<script type="text/javascript">
				CKEDITOR.replace( 'editor1' );
			</script>
		</p>
		<p>
			<input type="submit" />
		</p>
	</form>
-->
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
/*
var CKEDITOR = window.parent.CKEDITOR;

var okListener = function(ev) {
	//alert(source);
	//var crap = svgCanvas.svgCanvasToString();
var text = document.getElementById(seditor1).innerHTML;
alert(text);
	//alert(crap)   
	//this._.editor.insertHtml(svgCanvas.svgCanvasToString());
  this._.editor.insertHtml(text);
  //this._.editor.insertElement(crap);
 //this._.editor.insertText(crap);
   CKEDITOR.dialog.getCurrent().removeListener("ok", okListener);
};

CKEDITOR.dialog.getCurrent().on("ok", okListener);
*/
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
alert(path);

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
alert("begin");
load(path,'seditor1');
alert("end");
//load(path,'editor1');
//load(path,'editor1');
//document. getElementById("editor1"). innerHTML = "from page";
//alert("1");
//$("#tool_source").click(function () {
//$("#tool_source_cancel").click(function(){alert($("#svg_source_textarea").html())});
//$("#tool_source_cancel").click(function(){alert($("#svg_source_container").html())});
//svgEditor.html();
//alert($("#svg_source_textarea").html());




</script>
</body>
</html>
