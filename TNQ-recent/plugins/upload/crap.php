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
    echo "Upload: " . $_FILES["file"]["name"] . "<br />";
    echo "Type: " . $_FILES["file"]["type"] . "<br />";
    echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br />";
    echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br />";

    if (file_exists("upload/" . $_FILES["file"]["name"]))
      {
    echo $_FILES["file"]["name"] . " already exists. ";
$uploaded_file = $_FILES["file"]["name"];
echo "ytf" . $uploaded_file;
      }
    else
      {
      move_uploaded_file($_FILES["file"]["tmp_name"],
      "upload/" . $_FILES["file"]["name"]);
    echo "Stored in: " . "upload/" . $_FILES["file"]["name"] . "<br />";
    echo "wtf";
    echo $_FILES["file"]["name"];
     $uploaded_file = $_FILES["file"]["name"];
echo "ytf";
echo $uploaded_file;
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
echo "wtf1";
$cmd = "abiword --to=html" . " " . "/var/www/full_tnq/editor/ckeditor/plugins/upload/upload/" . $_FILES["file"]["name"];
echo "this is the cmd:" . $cmd;
exec($cmd);
echo "wtf2";
$uploaded_file = '"' . $_FILES["file"]["name"] . '"';
//chmod ( $uploaded_file, 0644 );
//exec(chmod ($uploaded_file, 0644));
//echo exec('pdftohtml /var/www/ileupload/1.pdf');
?>
<html>
<head>
<textarea id="seditor1" name="seditor1">Initial value.</textarea>
</head>
<body>
<?php echo"
<script>
alert(\"Hi\");
function(){};
var path = " . $uploaded_file .";". "var f = path.replace(/[.][a-z]+$/,\"\");
path = \"upload/\" + f + \".html\";
alert(path);
function ahah(url, target) {
  document.getElementById(target).innerHTML = ' Fetching data...';
  if (window.XMLHttpRequest) {
    req = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    req = new ActiveXObject(\"Microsoft.XMLHTTP\");
  }
  if (req != undefined) {
    req.onreadystatechange = function() {ahahDone(url, target);};
    req.open(\"GET\", url, true);
    req.send(\"\");
  }
}  

function ahahDone(url, target) {
  if (req.readyState == 4) { // only if req is \"loaded\"
    if (req.status == 200) { // only if \"OK\"
      document.getElementById(target).innerHTML = req.responseText;
    } else {
      document.getElementById(target).innerHTML=\"Upload sum file \";
    }
  }
}

function load(name, div) {
	ahah(name,div);
	return false;
}   
alert(\"begin\");
//load(path,'seditor1');
alert(\"end\");

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
   CKEDITOR.dialog.getCurrent().removeListener(\"ok\", okListener);
};

CKEDITOR.dialog.getCurrent().on(\"ok\", okListener);
</script>"; ?>
</body>
</html>
