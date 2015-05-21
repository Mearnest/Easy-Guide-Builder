<?php
	 // print_r($_POST);
	 // print_r($_FILES);
	
	 $file = NULL;
	 
	 if (array_key_exists("picture", $_FILES)) {
		$file = $_FILES["picture"];
	 }
	 else {
		exit;
	 }
	 
	$max_size = 3500000;
	$allowedExts = array("gif", "GIF", "jpeg", "JPEG", "jpg", "JPG", "png", "PNG");
	$file_type = $file["type"];
	
	$temp = explode(".", $file["name"]);
	$extension = end($temp);
	$filepath = NULL;
	
	print_r(array('file' => $file, 'max_size' => $max_size, 'allowedExts' => $allowedExts, 
		'file_type' => $file_type, 'temp' => $temp, 'extension' => $extension, 'filepath' => $filepath));

	if ((($file_type == "image/gif")
		|| ($file_type== "image/jpeg")
		|| ($file_type== "image/jpg")
		|| ($file_type== "image/pjpeg")
		|| ($file_type== "image/x-png")
		|| ($file_type== "image/png"))
		&& ($file["size"] < $max_size)
		&& in_array($extension, $allowedExts)) {
			if ($file["error"] > 0) {
				$msg = $file["error"];
				echo "<h2>". $file["error"] ."</h2>";
				echo "<script>window.top.alert($msg);</script>";
			} 
			else {
				// echo "Upload: " . $file["name"] . "<br>";
				// echo "Type: " .$file_type. "<br>";
				// echo "Size: " . ($file["size"] / 1024) . " kB<br>";
				// echo "Temp file: " . $file["tmp_name"] . "<br>";
				
				// if (file_exists("upload/" . $file["name"])) {
					// echo $file["name"] . " already exists. ";
				// } 
				// echo "Stored in: " . "upload/" . $file["name"];

				move_uploaded_file($file["tmp_name"], "upload/" . $file["name"]);
				$filepath = "/upload/" . $file["name"];
				echo "<h2>Uploaded file: ". $file["name"] ."</h2>";
				echo "<script>window.top.setPicture('$filepath');</script>";
		}
	} 
	else {
		if ($file["size"] > $max_size)  {
			$msg = "'Image is larger than maximum size of $max_size.'";
			echo "<h2>$msg</h2>";
			echo "<script>window.top.alert($msg);</script>";
		}
		else {
			$msg = "'The file type $file_type is not an accepted image.'";
			echo "<h2>$msg</h2>";
			echo "<script>window.top.alert($msg); window.top.setPicture('/img/Placeholder.png');</script>";
		}
	}
?>