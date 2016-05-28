<?php
if($_POST){

	//echo $data = $_POST['sourceCode'];
	$data = (string)$_POST['sourceCode'];
	//$data = "Hello";
	$file = fopen("../ProjectDir/Solutions.java","w");
	fwrite($file,$data);
	fclose($file);
}else{
	echo "string";
}
?>
