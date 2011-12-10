<?php

if ((($_FILES["file"]["type"] != "image/gif")
|| ($_FILES["file"]["type"] != "image/jpeg")
|| ($_FILES["file"]["type"] != "image/pjpeg")))
  {
  if ($_FILES["file"]["error"] > 0)
    {
    echo "Return Code: " . $_FILES["file"]["error"] . "<br />";
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
      }
    else
      {
      move_uploaded_file($_FILES["file"]["tmp_name"],
      "upload/" . $_FILES["file"]["name"]);
      echo "Stored in: " . "upload/" . $_FILES["file"]["name"] . "<br />";
      //echo "wtf";
      echo $_FILES["file"]["name"];
      }
    }
  }
else
  {
  echo "Invalid file";
  }

//exec('mkdir saketh');
echo exec('whoami');

//exec(chmod -R 777 /var/www);
exec('abiword --to=html /var/www/editor/upload/tenSigmas.doc');
//echo exec('pdftohtml /var/www/ileupload/1.pdf');
?> 
