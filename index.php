<?php

  $compileFile = false;
  if(isset($_GET["compile"])) $compileFile = $_GET["compile"] == "true";

  function getFileUrls($htmlUrl){

        $file = fopen($htmlUrl,"r");
        $text = fread($file,filesize($htmlUrl));
        fclose($file);

        $text = trim($text);
        $t = explode("var scripts = [",$text)[1];
        $t = explode("]",$t)[0];
        $t = implode("",explode("\n",$t));
        $t = implode("",explode('"',$t));
        $t = implode("",explode(" ",$t));
        $t = explode(",",trim($t));
        return $t;
  }

  $urls = getFileUrls("AllFiles.js");

  $len = count($urls);
  $allFiles = "";

   $urlList = "";

  for($i=0;$i<$len;$i++){

      $name = trim($urls[$i]);

      $file = fopen($name,"r");
      $text = fread($file,filesize($name));
      fclose($file);
      $allFiles .= $text."\n\n";
      $urlList .= "<script src = '".$name."' ></script>";

  }

  $file = fopen("App.js","r");
  $text = fread($file,filesize("App.js"));
  fclose($file);

  //echo $text."<br>";
  $allFiles .= $text."\n\n";




  //echo $allFiles;
  $file = fopen("project.js","w");
  fwrite($file,$allFiles);
  fclose($file);

  //-------

  $file = fopen("_index.html","r");
  $text = fread($file,filesize("_index.html"));
  fclose($file);

  if($compileFile == false){

     $urlList .= "<script src = 'App.js' ></script>";
     $text = implode($urlList,explode('<script src="project.js"></script>',$text));
  }

  echo $text;

?>