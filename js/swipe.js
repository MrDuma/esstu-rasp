$(window).load(function() {
	var numWeek = weekInfo();
	var now = new Date();
	var nD = now.getDay() - 1;
	swipegoryUpdate(0);
	if(numWeek = 2) {
		if($('title').text() == '2') {
			swipegoryUpdate(nD, true);
		}
	} else {
		if($('title').text() != '2') {
			swipegoryUpdate(nD, true);
		}
	}
});
var autoAdjustHeight = false;
$('nav a').on('mousedown', function(e){
	e.preventDefault();
	var goTo = $(this).parent().index();
	swipegoryUpdate(goTo);
});
$("ul.panes").swipe({
	swipeStatus:function(event, phase, direction, distance, duration, fingerCount) {    
		var translateString = 'translate3d(0px, 0px, 0px)';
		var transitionDuration = $('nav li.cur').css('transitionDuration');
		var speed = transitionDuration;    
		if(phase == 'move') {
				speed = '0ms';      
			if(direction == 'left') {
				translateString = 'translate3d(-' + distance + 'px, 0px, 0px)';
				$('.panes li.cur').css('marginLeft', '-'+ distance +'px');
			} else if(direction == 'right') {
				translateString = 'translate3d(' + distance + 'px, 0px, 0px)';
				$('.panes li.cur').css('marginLeft', distance +'px');
			}
				$('nav li.cur').css({ 
				transitionDuration: speed
			}); 
		} else if (phase == 'end') {   
			var marginLeft = $('nav li.cur').css('marginLeft');
			$('nav li.cur').attr('style', '').css('marginLeft', marginLeft);
			$('.panes li.cur').attr('style', '');
		}
	}, swipeLeft:function(event, direction, distance, duration, fingerCount) {
		var goTo = $('nav li.cur').index();
		goTo++;
		swipegoryUpdate(goTo); 
	}, swipeRight:function(event, direction, distance, duration, fingerCount) {
		var goTo = $('nav li.cur').index();
		goTo--;
		swipegoryUpdate(goTo); 
	},
	threshold: 50,
	triggerOnTouchEnd: false,
	allowPageScroll: "vertical",
	excludedElements: "button, input, select, textarea, .noSwipe"
});
function swipegoryUpdate(goTo) {
	var listItems = $('nav li');
	var panes = $('.panes');
	var prev = goTo - 1;
	var next = goTo + 1;  
	if(goTo >= 0 && goTo < listItems.length) {   
		listItems.removeClass('prev').removeClass('cur').removeClass('next').removeClass('before').removeClass('after');
		$('li', panes).removeClass('prev').removeClass('cur').removeClass('next').removeClass('before').removeClass('after');
		listItems.each(function(i) {
			var li = $(this);
			var pane = $('li:eq('+i+')', panes);
      
			li.attr('style', '');

			if(i == prev) {
				li.addClass('prev');
				li.css('margin-left', '0');      
				pane.addClass('prev');
			} else if(i == next) {
				li.addClass('next');
				li.css('margin-left', '-' + li.outerWidth() + 'px');
				pane.addClass('next');
			} else if(i < goTo) {
				li.addClass('before');
				li.css('margin-left', '-' + li.outerWidth() + 'px');
				pane.addClass('before');
		    } else if(i == goTo) {
				li.addClass('cur');
				var marginLeft = li.outerWidth() / 2;
				li.css('margin-left', '-' + marginLeft + 'px');
				pane.addClass('cur');
				if(autoAdjustHeight == true) {
					$('.swipegory').css('height', pane.outerHeight() + li.outerHeight());
				}
			} else if(i > goTo) {
				li.addClass('after');
				li.css('margin-left', '0');
				pane.addClass('after');
			}
		});    
	}
}
function swipegoryUpdate(goTo, now) {
	var listItems = $('nav li');
	var panes = $('.panes');
	var prev = goTo - 1;
	var next = goTo + 1;  
	if(goTo >= 0 && goTo < listItems.length) {   
		listItems.removeClass('prev').removeClass('cur').removeClass('next').removeClass('before').removeClass('after');
		$('li', panes).removeClass('prev').removeClass('cur').removeClass('next').removeClass('before').removeClass('after');
		listItems.each(function(i) {
			var li = $(this);
			var pane = $('li:eq('+i+')', panes);
      
			li.attr('style', '');

			if(i == prev) {
				li.addClass('prev');
				li.css('margin-left', '0');      
				pane.addClass('prev');
			} else if(i == next) {
				li.addClass('next');
				li.css('margin-left', '-' + li.outerWidth() + 'px');
				pane.addClass('next');
			} else if(i < goTo) {
				li.addClass('before');
				li.css('margin-left', '-' + li.outerWidth() + 'px');
				pane.addClass('before');
		    } else if(i == goTo) {
				if(now) {
					li.find('a').addClass('now');
				}
				li.addClass('cur');
				var marginLeft = li.outerWidth() / 2;
				li.css('margin-left', '-' + marginLeft + 'px');
				pane.addClass('cur');
				if(autoAdjustHeight == true) {
					$('.swipegory').css('height', pane.outerHeight() + li.outerHeight());
				}
			} else if(i > goTo) {
				li.addClass('after');
				li.css('margin-left', '0');
				pane.addClass('after');
			}
		});    
	}
}
function delta(year) {
	var date = new Date();
	var newYear = new Date(year, 0, 1);
	return (Math.floor((date.getTime() - newYear.getTime()) / 1000 / 60 / 60 / 24));
}
function newYearDays() {
	var date = new Date();
	var Y = date.getFullYear();
	var delta1 = delta(Y);
}
var calStartDOW = 1;
function getWeekNum(day, month, year) {
	if (calStartDOW == 0) day++;
	month++;
	var a = Math.floor((14 - month) / 12);
	var y = year + 4800 - a;
	var m = month + 12 * a - 3;
	var J = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) -
	Math.floor(y / 100) + Math.floor(y / 400) - 32045;
	d4 = (((J + 31741 - (J % 7)) % 146097) % 36524) % 1461;
	var L = Math.floor(d4 / 1460);
	var d1 = ((d4 - L) % 365) + L;
	var week = Math.floor(d1 / 7) + 1;
	if (week < 10) week = '0' + week;
	return week;
}
function numWeekSep(Y) {
	var date1 = new Date(Y, 9 - 1, 1);
	var wd1 = date1.getDay();
	var nw1 = getWeekNum(1, 9 - 1, Y);
	if (wd1 == 0 || wd1 == 6) nw1++;
	return nw1;
}
function weekInfo() {
	var date = new Date();
	var Y = date.getFullYear();
	var M = date.getMonth();
	var D = date.getDate();
	var NW = getWeekNum(D, M, Y);
	var returnNum = 0;
	if (M > 8 - 1) {
		var nw1 = numWeekSep(Y);
		var num = NW - nw1 + 1;
		if (num > 0 && num < 19) {
			if (NW % 2 == 0) {
				returnNum = 2;
			} else {
				returnNum = 1;
			}
		}
	} else if (M < 7 - 1) {
		var NED = 20;
		var nw1 = numWeekSep(Y - 1);
		var nw2 = getWeekNum(28, 12 - 1, Y - 1);
		var w28 = nw2 - nw1 + 1;
		var date2 = new Date(Y - 1, 12 - 1, 28);
		var wd28 = date2.getDay();
		var t28 = date2.getTime();
		while (!(wd28 == 1 && w28 == NED)) {
			t28 += 1000 * 60 * 60 * 24;
			date2.setTime(t28);
			wd28 = date2.getDay();
			if (wd28 == 1) w28++;
		}
		var date3 = new Date();
		date3.setTime(t28);
		var y2 = date3.getFullYear();
		var m2 = date3.getMonth();
		var d2 = date3.getDate();
		var nw2 = getWeekNum(d2, m2, y2);
		var num = NW - nw2 + 1;
		if (num > 0 && num < 21) {
			if (NW % 2 == 0) {
				returnNum = 2;
			} else {
				returnNum = 1;
			}
		}
	}
	return returnNum;
};