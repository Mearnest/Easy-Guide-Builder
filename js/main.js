// Override window.alert to show a nicer jQuery UI dialog instead.
function alert(text, elem) {
	var dialog = $("#dialog");
	
	dialog.dialog("option", "title", "Notice");
	dialog.html("<p>" + text + "</p>");
	
	if (elem) {
		dialog.dialog( "option", "position", { my: "center", at: "top", of: elem});
	}
	else {
		dialog.dialog( "option", "position", { my: "center", at: "middle", of: $(window)});
	}
	
	dialog.dialog("open");
}


function showPDF(url) {
	// Close the existing dialog.
	$("#dialog").dialog( "close" );
	var dialog = $("#dialog-pdf");
	
	dialog.dialog("option", "width", 900);
	dialog.dialog("option", "height", 550);
	
	dialog.html("<iframe src='" + url + "'></iframe>");
	dialog.dialog( "option", "position", { my: "center", at: "middle", of: $(window)});
	
	dialog.dialog("open");
}


function showInstructions() {
	var dialog = $("#dialog-instructions");
	
	dialog.dialog("option", "width", 900);
	dialog.dialog("option", "height", 550);
	dialog.dialog( "option", "position", { my: "center", at: "top", of: $("div.steps")});
	dialog.dialog("open");
	$("#dialog-instructions").scrollTop("0"); // make sure it's scrolled to the top
}


function setPicture(filepath, pictureType) {
	setPicture.img.attr("src", filepath);
	// localStorage.setItem(id, filepath);
}


// Add scrollto element method to jQuery.
$.fn.scrollTo = function( target, options, callback ) {
	if (typeof options == 'function' && arguments.length == 2) { 
		callback = options; options = target; 
	}
	var settings = $.extend({
		scrollTarget  : target,
		offsetTop     : 50,
		duration      : 500,
		easing        : 'swing'
	}, options);
	
	return this.each(function() {
		var scrollPane = $(this);
		var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
		var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
		scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function() {
		 if (typeof callback == 'function') { callback.call(this); }
		});
	 });
}


function setIconTitles() {
	$("div.step .title span").each(function(index, elem) {
		var step = $(this).attr("data-step");
		var text = $(this).text();
		$("div.icon[data-step=" + step + "] span").text(text);
	});
}


function recalculateHeights(num) {
	/* if (num == 2) {
		$("main").height("954px");
		$(".sidebar").height("420px");
	}
	else if (num == 5) {
		$("main").height("1720px");
		$(".sidebar").height("1188px");
	}
	else {
		$("main").height("1322px");
		$(".sidebar").height("788px");
	} */
}

function setHeaderTitle(selection) {
	$(".title[contenteditable=true]", selection).each(function(index) {
		var text = $(this).text();
		$(".title:not([contenteditable=true])", selection).text(text);
	});
}


// Load saved values from local storage into the the Easy Builder
function loadFromLocalStoarge() {
	$("button.reset").show();
	
	// Loop through browser's local storage and restore saved values.
	// Need to store default values in the data-default attribute.
	for (prop in localStorage) {
		var elem = $("#" + prop);
		var val = localStorage[prop];
		
		if (val === "") {
			continue;
		}
		if (elem.is("img")) {
			elem.attr("data-default", elem.attr("src"));
			elem.attr("src", val);
		}
		else if (elem.is("div")) {
			// hide / show
		}
		else {
			elem.attr("data-default", elem.html());
			elem.html(val);
		}	
	}
	
	// Set the icon titles based on the step names.
	setIconTitles();
	
	$("button.step").removeClass("btn-default");
	$("button.step").addClass("btn-primary");
	
	var step, steps, obj, icon, isVisible;
	
	// Loop through the steps and save the information for 
	// any step which is visible.
	$("div.step").each(function(index, elem) {
		step = $(elem).attr("data-step");
		obj = localStorage.getItem("step" + step);
		obj = JSON.parse(obj);
		icon = $("div.icon[data-step='" + step + "']");
		button = $("button.step[data-step='" + step + "']");
		
		try {
			if (obj.visible) {
				$(elem).removeClass("hidden");
				icon.removeClass("hidden");
			}
			else {
				$(elem).addClass("hidden");
				icon.addClass("hidden");
			}
		}
		catch (e) {
			console.log(e, step, obj, icon, button);
		}
	});
	
	// Determine which button should be the default based on the number of existing steps.
	steps = localStorage.getItem("steps");
	button = $("button.step[data-step='" + steps + "']");
	button.removeClass("btn-primary");
	button.addClass("btn-default");
	recalculateHeights(steps);
	setHeaderTitle($("div.lesson-type"));
	setHeaderTitle($("div.lesson-title"));
}


$(function() {
	// initialize jQuery UI dialog
	$("#dialog").dialog({ autoOpen: false });
	$("#dialog-pdf").dialog({ autoOpen: false });
	$("#dialog-instructions").dialog({ autoOpen: false });
	
	if (localStorage.length > 0) {
		loadFromLocalStoarge();
	}
	
	$("button.print").click(function(event) {
		var steps = $("button.step.btn-default").attr("data-step");
		
		if (steps == 5) {
			$("body").append('<style type="text/css">  @media print { .sidebar {  height: 1000px !important;  } </style>');
		}
		
		window.print();
	});
	
	$("button.instructions").click(function(event) {
		 showInstructions();
	});
	
	
	$("button.pdf").click(function(event) {
		alert("Generating PDF ...");
		
		var postData = { };
		var id, obj, step, isVisible;
		
		$("div.step").each(function(index, elem) {
			step = $(elem).attr("data-step");
			isVisible =  !($(elem).hasClass("hidden"));
			
			obj = {};
			obj.visible = isVisible;
			
			if (isVisible) {
				obj.img = $("img", $(elem)).attr("src");
				obj.icon = $("img[data-step='" + step + "']").attr("src");
				obj.title = $(".title", $(elem)).text();
				obj.description  = $(".description", $(elem)).text();
			}
			
			obj = JSON.stringify(obj);
			postData["step" + step] = obj;
		});
		
		// Set the number of steps based on the step button which is selected.
		steps = $("button.step.btn-default").attr("data-step");
		postData["steps"] = steps;
		
		// Loop through all the elements with save class.
		$("*[class*='save']").each(function(index, elem) {
			id = $(elem).attr("id");
			
			// If this element has an id, it needs to be saved.
			if (id) {
				postData[id] = $(elem).attr("src") || $(elem).html();
			}
		});
		
		$.post("/generate-pdf.php", postData, function(data) {
			console.log(data);
			// $("body").append("<pre>" + data + "</pre>");
			data = JSON.parse(data);
			showPDF(data.pdf);
		});
	});
	
	
	$("button.save").click(function(event) {
		var postData = {};
		var id, step, steps, obj, isVisible, dataDefault;
		
		// Loop through the steps and save the information for 
		// any step which is visible.
		$("div.step").each(function(index, elem) {
			step = $(elem).attr("data-step");
			isVisible =  !($(elem).hasClass("hidden"));
			
			obj = {};
			obj.visible = isVisible;
			
			if (isVisible) {
				obj.img = $("img", $(elem)).attr("src");
				obj.icon = $("img[data-step='" + step + "']").attr("src");
				obj.title = $(".title span", $(elem)).text();
				obj.description  = $(".description", $(elem)).text();
			}
			
			obj = JSON.stringify(obj);
			postData["step" + step] = obj;
			localStorage.setItem("step" + step, obj);
		});
		
		// Set the number of steps based on the step button which is selected.
		steps = $("button.step.btn-default").attr("data-step");
		postData["steps"] = steps;
		localStorage.setItem("steps", steps);
		
		// Loop through all the elements with save class.
		$("*[class*='save']").each(function(index, elem) {
			id = $(elem).attr("id");
			dataDefault = $(elem).attr("data-default");
			
			// If this element has an id, it needs to be saved.
			if (id && dataDefault != "true") {
				postData[id] = $(elem).attr("src") || $(elem).html();
				localStorage.setItem(id, postData[id]);
			}
		});
		
		$.post("/test.php", postData, function(data) {
			console.log(data);
		});
		
		$(this).hide();
		$("button.reset").show();
		
		alert("Data saved. Next time your reload you browser this data will load with the Easy Guide.");
	});
	
	
	$("button.reset").click(function(event) {
		var defaultVal;
		
		// Loop through every element that has a save class.
		// Save class denotes an item for saving.
		$("*[class*='save']").each(function(index, elem) {
			defaultVal = $(elem).attr("data-default");
			
			// check to make sure this does have a default value to restore.
			if (defaultVal && defaultVal != "true") {
				// Image
				if ($(elem).attr("src")) {
					$(elem).attr("src", defaultVal);
				}
				// Text with pencil icon
				else {
					$(elem).html(defaultVal);
					$(elem).attr("data-default", "true");
				}
			}
		});
		
		$("div.steps button.step").removeClass("btn-default");
		$("div.steps button.step").addClass("btn-primary");
		
		$("div.steps button.step[data-step='3']").removeClass("btn-primary");
		$("div.steps button.step[data-step='3']").addClass("btn-default");
		
		$("div.step").removeClass("hidden");
		$("div.icon[data-step='4']").addClass("hidden");
		$("div.icon[data-step='5']").addClass("hidden");
		$("div.step[data-step='4']").addClass("hidden");
		$("div.step[data-step='5']").addClass("hidden");
		
		setIconTitles();
		
		var steps = 3;
		recalculateHeights(steps);
		
		$(this).hide();
		$("button.save").show();
	});
	
	
	// Check to see which parts of a lesson are checked (train car image is coloured).
	// Then set the Structure of a Lesson description to the appropriate text.
	function checkLessonParts() {
		var imgChecked = "-checked";
		var intro = $("img[data-part='intro']").attr("src").match(imgChecked);
		var info = $("img[data-part='info']").attr("src").match(imgChecked);
		var review = $("img[data-part='review']").attr("src").match(imgChecked);
		var partsText = $("div.structure p.description");
		
		if (intro && info && review) {
			partsText.text("Can be used in all parts of a lesson.");
		}
		else if (intro && info) {
			partsText.text("Can be used in the Introduction and New Information parts of a lesson.");
		}
		else if (intro && review) {
			partsText.text("Can be used in the Introduction and Review parts of a lesson.");
		}
		else if (info && review) {
			partsText.text("Can be used in the New Information and Review parts of a lesson.");
		}
		else if (intro) {
			partsText.text("Can be used in the Introduction part of a lesson.");
		}
		else if (info) {
			partsText.text("Can be used in the New Information part of a lesson.");
		}
		else if (review) {
			partsText.text("Can be used in the Review part of a lesson.");
		}
		else {
			partsText.text("Click the parts of a lesson this strategy can be used in.");
		}
	}
	
	// Toggle the part intro, info, or review part of the lesson 
	// when a user clicks on the corresponding train car image.
	$("div.train img").click(function(event) {
		var part = $(this).attr("data-part");
		var imgSrc = $(this).attr("src");
		var imgChecked = "-checked";
		var id = $(this).attr("id");
		
		if (imgSrc.match(imgChecked)) {
			$(this).attr("src", imgSrc.replace(imgChecked, ""));
			$(this).attr("title", "Click to Check");
		}
		else {
			$(this).attr("src", imgSrc.replace(part, part + imgChecked));
			$(this).attr("title", "Click to Uncheck");
		}
		
		// localStorage.setItem(id, $(this).attr("src"));
		
		checkLessonParts();
	});
	
	
	$("img.picture").click(function(event) {
		$("input.picture").click();
		setPicture.img = $(this);
	});
	
	$("input.picture").change(function(event) {
		setPicture.img.attr("src", "/img/upload.gif");
		$("form.easy-builder").submit();
		$("input.picture").val("");
	});
	
	
	// When focusing (click, touch or tab to) editable content, 
	// clear the field if it's the default value, and store that value for restoring the
	// default when the user leaves the field if they have not entered a value.
	function onContentFocus(event) {
		if ($(this).attr("data-default") === "true") {
			$(this).attr("data-default", $(this).html());
			$(this).text("");
		}
	}
	
	// When leaving (click, touch or tab out of) editable content, 
	// determine if the default text needs to be restored, or determine 
	// whether the user has exceeded the maximum word count.
	function onContentBlur(event) {
		var default_text = $(this).attr("data-default");
		var maxLength = $(this).attr("data-max");
		var text = $(this).text();
		var words = text.split(" ");
		var id = $(this).attr("id");
		var step = $(this).attr("data-step");
		
		// Check for resetting default text.
		if (default_text !== "true" && text === "") {
			$(this).attr("data-default", "true")
			$(this).html(default_text);
		}
		else {
			if (words.length > maxLength) {
				alert("You have reached the " + maxLength + " word maximum.", $(this));
				
				// Shorten words to maximum and add an ellipses.
				text = words.slice(0, maxLength-1).join(" ");
				text += " ...";
				$(this).text(text);
			}
			if (step) {
				// If this text has a step, set the corresponding icon title text.
				if (step) {
					if ($(this).parent().hasClass("title")) {
						$("div.icon[data-step=" + step + "] span").text(text);
						$("p.title[data-step=" + step + "]", "div.variation").text(text);
						$("button.variation[data-step=" + step + "]").text("Hide " + text);
					}
				}
			}
		}
		
		// Store this value in the browser's local storage so the user has access to it when coming back to the website, or after a page refresh.
		// localStorage.setItem(id, text);
	}
	
	// When a the title is changed for a step, check to see if the corresponding description
	// has the title in it's text. If so, then wrap it in a span for styling.
	function onStepTitleChange(event) {
		if ($(this).attr("data-default") === "true") {
			return;
		}
		
		var step = $(this).attr("data-step");
		var title = $("div.step span[data-step=" + step + "]");
		var description = $("div.step .description[data-step=" + step + "]");
		var titleText =  title.text();
		var words = description.text();
		var re = new RegExp("(" + titleText + ")", "ig");
		var re_span = new RegExp(/\<span\>/);
		
		if (words.match(re) && !words.match(re_span)) {
			// console.log("match");
			words = words.replace(re, '<span class="highlight">$1</span>');
			description.html(words);
		}
		else {
			description.html(words); // make sure span is removed
		}
	}
	
	// Set any html element with an attribute of contenteditable set to true
	$("*[contenteditable='true']").focus(onContentFocus);
	$("*[contenteditable='true']").blur(onContentBlur);
	
	$("div.step span[data-step]").blur(onStepTitleChange);
	$("div.step .description[data-step]").blur(onStepTitleChange);
	
	// When the lesson type is changed, update the list question to reflect the correct lesson type.
	$("#lesson-type").blur(function(event) {
		var questionList = $("li.question.list");
		var html = questionList.html();
		var lessonType = $(this).text().toLowerCase();
		
		html = html.replace("strategy", lessonType);
		questionList.html(html);
	});
	
	$("div.variation .title").blur(function(event) {
		var text = $(this).text();
		var step = $(this).attr("data-step");
		$("button.variation[data-step=" + step + "]").text("Hide " + text);
	});
	
	$("div.steps button.step").click(function(event) {
		var steps = $(this).attr("data-step");
		
		$("div.steps button.step").removeClass("btn-default");
		$("div.steps button.step").addClass("btn-primary");
		
		$(this).removeClass("btn-primary");
		$(this).addClass("btn-default");
		
		$("div.step, div.icon, div.variation").addClass("hidden");
		
		$("div.step").each(function(index, elem) {
			var num = index + 1;
			
			if (num > steps) return false;
			else {
				$(elem).removeClass("hidden");
			}
			
			recalculateHeights(num);
		});
		
		$("button.variation:not([data-step='other'])").addClass("hidden");
		
		$("div.variation").each(function(index, elem) {
			var num = index + 1;
			
			if (num > steps) return false;
			else {
				$(elem).removeClass("hidden");
				$("button.variation[data-step='" + num + "']").removeClass("hidden");
			}
			
			// recalculateHeights(num);
		});
		
		if (steps == 4) {
			$("button.variation[data-step='other']").hide();
		}
		else {
			$("button.variation[data-step='other']").show();
		}
		
		$("div.icon").each(function(index, elem) {
			if (index + 1 > steps) return false;
			else {
				$(elem).removeClass("hidden");
			}
		});
		
		if (steps < 5) {
			$("body").scrollTo($("div.steps"));
		}
		else {
			$("body").scrollTo($("div.step[data-step='5']"));
		}
		
		$("li.question.list ol li").remove();
		
		for(var i=0; i < steps; i++) {
			$("li.question.list ol").append("<li>____________________</li>");
		}

		replaceQuestionStepText(steps, $("li.question.list"))
	});
	
	function replaceQuestionStepText(steps, questionList) {
		var wordNums = ["zero", "one", "two", "three", "four", "five"];
		var word = wordNums[steps];
		var html = questionList.html();
		
		// Loop through and replace previous step word number with the current one.
		$(wordNums).each(function(index, elem) {
			if (html.match(elem)) {
				html = html.replace(elem, word);
				questionList.html(html);
			}
		});
	}
	
	function onHeaderTitleChange(selection) {
		$(".title[contenteditable=true]", selection).blur(function(event) {
			var text = $(this).text();
			$(".title:not([contenteditable=true])", selection).each(function(index, elem) {
				$(elem).text(text);
			});
		});
	}
	
	onHeaderTitleChange($("div.lesson-type"));
	onHeaderTitleChange($("div.lesson-title"));
	
	document.querySelector("p.variation").designMode = "on";
	$("button.command").click(function(event) {
		var cmd = $(this).attr("data-command");
		if (cmd === "insertHTML") {
			var url = prompt("Enter the url:");
			if (url) {
				var html = '<a href="' + url + '">' + url + '</a>';
				var content = $(this).next();
				content.html(content.html() + html);
				// document.execCommand(cmd, html);
			}
		}
		else {
			document.execCommand(cmd);
		}
		
		if ($(this).hasClass("btn-default")) {
			$(this).removeClass("btn-default");
			$(this).addClass("btn-primary");
		}
		else {
			$(this).removeClass("btn-primary");
			$(this).addClass("btn-default");
		}
	});
	
	$("button.variation").click(function(event) {
		var text = $(this).text();
		var step = $(this).attr("data-step");
		var div = $("div.variation[data-step='" + step + "']");
		
		if (step === "other" && !($(this).hasClass("btn-default"))) {
			$(this).addClass("btn-default");
			$(this).removeClass("btn-primary");
			div.removeClass("hidden");
			$(this).text(text.replace(/Add/, "Hide"));
		}
		else {
			$(this).toggleClass("btn-primary");
			
			if ($(this).hasClass("btn-primary")) {
				$(this).text(text.replace(/Hide/, "Show"));
				div.hide();
			}
			else {
				$(this).text(text.replace(/Show/, "Hide"));
				div.show();
			}
		}
		
		$("body").scrollTo($(this).offset().top);
	});
});