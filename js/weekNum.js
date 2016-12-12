function goodwordform(k, w, o1, o2, o5) { //Корректное склонение окончания слова
	if ((k % 100 > 10 && k % 100 < 20) || k % 10 > 4 || k % 10 == 0) w += o5;
	else if (k % 10 == 1) w += o1;
	else w += o2;
	return w;
}

function delta(year) { //Разница в днях текущей даты с новым годом для года year
	var date = new Date();
	var newYear = new Date(year, 0, 1);
	return (Math.floor((date.getTime() - newYear.getTime()) / 1000 / 60 / 60 / 24));
}

function newYearDays() { //Выводим инфо о ближайших Новых годах
	var date = new Date();
	var Y = date.getFullYear();
	var delta1 = delta(Y);
}

var calStartDOW = 1; //С чего начинать неделю, в США день 0 (Вс), в мире день 1 (Пн)

function getWeekNum(day, month, year) { //Корректно определяем номер недели в году
	if (calStartDOW == 0) day++; //Чтоб работало и для США :)
	month++; //в JS месяцы нумеруются с нуля!
	var a = Math.floor((14 - month) / 12);
	var y = year + 4800 - a;
	var m = month + 12 * a - 3;
	var J = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) -
	Math.floor(y / 100) + Math.floor(y / 400) - 32045;
	d4 = (((J + 31741 - (J % 7)) % 146097) % 36524) % 1461;
	var L = Math.floor(d4 / 1460);
	var d1 = ((d4 - L) % 365) + L;
	var week = Math.floor(d1 / 7) + 1;
	if (week < 10) week = '0' + week; //Лидирующий ноль для недель 1-9
	return week;
}

function numWeekSep(Y) { //Найти номер недели начала учебного года для года Y
	var date1 = new Date(Y, 9 - 1, 1);
	var wd1 = date1.getDay();
	var nw1 = getWeekNum(1, 9 - 1, Y);
	if (wd1 == 0 || wd1 == 6) nw1++; //Если 1 сент. - Сб или Вс, начнём со след. Пн
	return nw1;
}

function weekInfo() { //Выводим инфо о номере недели в году и семестре
	var date = new Date();
	var Y = date.getFullYear();
	var M = date.getMonth();
	var D = date.getDate();
	var NW = getWeekNum(D, M, Y);
	var returnNum = 0;
	//Ниже - "неуниверсальная" часть функции
	//Определяем неделю начала учебного года и номер недели в осеннем семестре
	if (M > 8 - 1) { //осенний семестр - с 1 сентября, если оно не Сб или Вс, тогда со след. Пн
		var nw1 = numWeekSep(Y);
		var num = NW - nw1 + 1; //номер недели семестра
		if (num > 0 && num < 19) { //Показываем не дольше 18 недель
			if (NW % 2 == 0) {
				$('a[href="#tab2"]').tab('show');
				$('a[href="#tab2"]').text('2 неделя (тек.)');
				returnNum = 2;
			} else { //Верхняя/нижняя (нечетная/четная)
				$('a[href="#tab1"]').tab('show');
				$('a[href="#tab1"]').text('1 неделя (тек.)');
				returnNum = 1;
			} //определяется номером недели по ISO
		}
	} else if (M < 7 - 1) { //весенний семестр - NED недель спустя, но не раньше января и кончится не позже июля
		var NED = 20;
		var nw1 = numWeekSep(Y - 1);
		//Ищем, когда прошло NED недель с начала учебного года (следующий Пн):
		var nw2 = getWeekNum(28, 12 - 1, Y - 1); //28 дек. гарантированно относится к прошлому году
		var w28 = nw2 - nw1 + 1;
		var date2 = new Date(Y - 1, 12 - 1, 28);
		var wd28 = date2.getDay();
		var t28 = date2.getTime();
		while (!(wd28 == 1 && w28 == NED)) { //ищем Пн, наступивший NED недель спустся после начала осеннего семестра
			t28 += 1000 * 60 * 60 * 24; //прибавить сутки
			date2.setTime(t28);
			wd28 = date2.getDay();
			if (wd28 == 1) w28++;
		}
		//Это будет начало весеннего семестра:
		var date3 = new Date();
		date3.setTime(t28);
		var y2 = date3.getFullYear();
		var m2 = date3.getMonth();
		var d2 = date3.getDate();
		var nw2 = getWeekNum(d2, m2, y2);
		var num = NW - nw2 + 1; //номер недели семестра
		if (num > 0 && num < 21) { //Показываем не дольше 20 недель
			if (NW % 2 == 0) {
				$('a[href="#tab2"]').tab('show');
				$('a[href="#tab2"]').text('2 неделя (тек.)');
				returnNum = 2;
			} else { //Верхняя/нижняя (нечетная/четная)
				$('a[href="#tab1"]').tab('show');
				$('a[href="#tab1"]').text('1 неделя (тек.)');
				returnNum = 1;
			} //определяется номером недели по ISO
		}
	}
	return returnNum;
};
$(window).load(function() {
   weekInfo();
});