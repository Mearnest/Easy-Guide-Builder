<?php

// echo "<h1>Generate the PDF Now!</h1>";
// print_r($_POST);
// exit;

/***	Get the Submitted Easy Guide Values for this Lesson  ***/
$lesson_type = $_POST['lesson-type'];
$lesson_title = $_POST['lesson-title'];
$picture_header = $_POST['picture-header'];
$how_it_helps = $_POST['how-it-helps-title'];
$how_it_helps_description = $_POST['how-it-helps-description'];

$when_to_use = $_POST['when-to-use'];
$lesson_intro = $_POST['lesson-intro'];
$lesson_info = $_POST['lesson-info'];
$lesson_review = $_POST['lesson-review'];

$icon1 = $_POST['icon1'];
$icon2 = $_POST['icon2'];
$icon3 = $_POST['icon3'];
$icon4 = $_POST['icon4'];
$icon5 = $_POST['icon5'];

$step1 = json_decode($_POST['step1']);
$step2 = json_decode($_POST['step2']);
$step3 = json_decode($_POST['step3']);
$step4 = json_decode($_POST['step4']);
$step5 = json_decode($_POST['step5']);

$step1_picture = $_POST['step1-picture'];
$step1_title = $_POST['step1-title'];
$step1_description = $_POST['step1-description'];

$step2_picture = $_POST['step2-picture'];
$step2_title = $_POST['step2-title'];
$step2_description = $_POST['step2-description'];

$step3_picture = $_POST['step3-picture'];
$step3_title = $_POST['step3-title'];
$step3_description = $_POST['step3-description'];

$step4_picture = $_POST['step4-picture'];
$step4_title = $_POST['step4-title'];
$step4_description = $_POST['step4-description'];

$step5_picture= $_POST['step5-picture'];
$step5_title = $_POST['step5-title'];
$step5_description = $_POST['step5-description'];

require_once('/mpdf/mpdf.php');
$mpdf = new mPDF();
	
$html = <<<HTML
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Easy Guide Builder</title>
		
		<link href="/css/generate-pdf.css" rel="stylesheet">
	</head>
	<body>
		<div class="page">
			<div id="header">
				<div class="lesson-label">
					<h1>Easy Guide</h1>
				</div>
				<div class="lesson-type">
					<h2>Teaching $lesson_type</h2>
				</div>
				<div class="lesson-title">
					<h2 id="lesson-title">$lesson_title</h2>
				</div>
				<div>
					<img class="logo" src="/img/bfl-logo.png">
				</div>
			</div>
		
			<div id="easy-container">
				<div id="picture-container">
					<img id="picture-header" src="$picture_header">
				</div>
				
				<div id="right-container">
					<div class="structure">
						<h3>When to Use It</h3>
						<p class="description">$when_to_use</p>
					</div>
					
					<div class="train">
						<img id="lesson-intro" src="$lesson_intro"><img id="lesson-info" src="$lesson_info"><img id="lesson-review" src="$lesson_review">
						
						<br>
						<div class="intro">Introduction</div>
						<div class="info">New Information</div>
						<div class="review">Review</div>
					</div>
					
					<div class="left"></div>
					<div class="how-it-helps">
						<h3 id="how-it-helps-title" class="save">$how_it_helps</h3>
						<p id="how-it-helps-description" class="description save">$how_it_helps_description</p>
					</div>
				</div>
			</div>
			
			<div id="step-container">
				<div class="sidebar">
					<div class="icon" data-step="1">
						<div class="picture-icon">
							<img id="icon1" class="icon" src="$icon1">
						</div>
						<p class="title">1. $step1_title</p>
					</div>
					
					<div class="icon" data-step="2">
						<div class="picture-icon">
							<img id="icon2" class="icon" src="$icon2">
						</div>
						<p class="title">2. $step2_title</p>
					</div>
HTML;

if ($step3->visible) {
	$html .= <<<HTML
				<div class="icon" data-step="3">
					<div class="picture-icon">
						<img id="icon3" class="icon" src="$icon3">
					</div>
					<p class="title">3. $step3_title</p>
				</div>
HTML;
}

if ($step4->visible) {
	$html .= <<<HTML
				<div class="icon" data-step="4">
					<div class="picture-icon">
						<img id="icon4" class="icon" src="$icon4">
					</div>
					<p class="title">4. $step4_title</p>
				</div>
HTML;
}

$html .= <<<HTML
				</div> <!-- /.sidebar -->
				
				<div class="steps">
					<h2>The Steps</h2>
					<div id="step1" class="step">
						<div class="picture-step">
							<img class="step" src="$step1_picture">
						</div>
						<p id="step1-title" class="title">1. $step1_title</p>
						<p id="step1-description" class="description left">$step1_description</p>
					</div>
					
					<div id="step2" class="step">
						<div class="picture-step">
							<img class="step" src="$step2_picture">
						</div>
						<p id="step2-title" class="title">2. $step2_title</p>
						<p id="step2-description" class="description">$step2_description</p>
					</div>
HTML;

if ($step3->visible) {
	$html .= <<<HTML
				<div id="step3" class="step">
					<div class="picture-step">
						<img class="step" src="$step3_picture">
					</div>
					<p id="step3-title" class="title">3. $step3_title</p>
					<p id="step3-description" class="description left">$step3_description</p>
				</div>
				
HTML;
}

if ($step4->visible) {
	$html .= <<<HTML
				<div id="step4" class="step">
					<div class="picture-step">
						<img class="step" src="$step4_picture">
					</div>
					<p id="step4-title" class="title">4. $step4_title</p>
					<p id="step4-description" class="description">$step4_description</p>
				</div>
				
HTML;
}

if ($step5->visible) {
	$html .= <<<HTML
				</div> <!-- /.steps -->
				
				<div class="sidebar-5">
					<div class="icon" data-step="5">
						<div class="picture-icon">
							<img id="icon5" class="icon" src="$icon5">
						</div>
						<p class="title">5. $step5_title</p>
					</div>
				</div>
				
				<div class="steps-5">
					<div id="step5" class="step">
						<div class="picture-step">
							<img class="step" src="$step5_picture">
						</div>
						<p id="step5-title" class="title">5. $step5_title</p>
						<p id="step5-description" class="description left">$step5_description</p>
					</div> 
				</div>
HTML;
}


$html .= <<<HTML
				</div> <!-- /.steps -->
			</div>
			
		</div> <!-- /.page -->
		
		<div class="page">
			<div id="header">
				<div class="lesson-label">
					<h1>Easy Guide</h1>
				</div>
				<div class="lesson-type">
					<h2>Teaching $lesson_type</h2>
				</div>
				<div class="lesson-title">
					<h2 id="lesson-title">$lesson_title</h2>
				</div>
				<div>
					<img class="logo" src="/img/bfl-logo.png">
				</div>
			</div>
		</div>
	</body>
</html>
HTML;

$mpdf->WriteHTML($html);

$return_value = array(
	'lesson-title' => "$lesson_title",
	'picture-header' => "$picture_header",
	'step1-picture' => "$step1_picture",
	'pdf' => "/EasyGuide.pdf"
);

$mpdf->Output('EasyGuide.pdf', 'F');

echo json_encode($return_value);

	
?>