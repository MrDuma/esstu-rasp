$(window).load(function() {
   weekInfo();
});
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
				$('a[href="#tab2"]').tab('show');
				$('a[href="#tab2"]').text('2 неделя (тек.)');
				returnNum = 2;
			} else {
				$('a[href="#tab1"]').tab('show');
				$('a[href="#tab1"]').text('1 неделя (тек.)');
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
				$('a[href="#tab2"]').tab('show');
				$('a[href="#tab2"]').text('2 неделя (тек.)');
				returnNum = 2;
			} else {
				$('a[href="#tab1"]').tab('show');
				$('a[href="#tab1"]').text('1 неделя (тек.)');
				returnNum = 1;
			}
		}
	}
	return returnNum;
};