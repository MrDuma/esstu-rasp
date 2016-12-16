$(document).ready(function() {
	$("#sidebar-toggle").click(function() {
		if($(".menu.active").length == 0) {
			$(".menu").addClass("active");
			$("#mask").addClass("active");
		} else {
			$(".menu").removeClass("active");
			$("#mask").removeClass("active");
		}
	});
	$("#mask").click(function() {
		if($(".menu.active").length == 0) {
			$(".menu").addClass("active");
			$("#mask").addClass("active");
		} else {
			$(".menu").removeClass("active");
			$("#mask").removeClass("active");
		}
	});
	$(".menu-switch").click(function() {
		window.location = "switch.html";
	});
	$(".menu-home").click(function() {
		window.location = "timetable.html";
	});
});