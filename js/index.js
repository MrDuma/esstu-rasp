$(document).ready(function() {
	setTimeout(function() {
		if(localStorage.length !== 0){
			window.location = "timetable.html";
		}else{
			window.location = "find.html";
		}
	}, 2000);
});