$(document).ready(function() {
	var active = localStorage.getItem('activeGroup');
	var retrievedObject = localStorage.getItem('groups');
	var nameGroups = JSON.parse(retrievedObject);
	var timeTable = new Object();
	timeTable.firstWeek = new Object();
	timeTable.secondWeek = new Object();
	var nameWeekDay = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	var nameClassDay = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
	for (var key in nameGroups) {
		if(active == key) {
			$(".codrops").append('<div class="listOfGroup active"><div class="el">' + key + '<div class="act">Активно</div></div><div class="icon-spinner11" style="margin-top:-39px !important"></div></div>');
		} else {
			$(".codrops").append('<div class="listOfGroup"><div class="el">' + key + '</div><div class="delete"><span class="bar"></span><span class="bar"></span></div><div class="icon-spinner11"></div></div>');
		}
	}
	$("#addGroup").click(function() {
		window.location = "find.html";
	});
	$(".listOfGroup .el").click(function() {
		if(!$(this).parent().hasClass('active')) {
			localStorage.setItem('activeGroup', $(this).text());
		}
		window.location = "timetable.html";
	});
	$(".listOfGroup .delete").click(function() {
		localStorage.removeItem('timeTable'+$(this).parent().text());
		var retrievedObject = localStorage.getItem('groups');
		nameGroups = JSON.parse(retrievedObject);
		delete nameGroups[$(this).parent().text()];
		localStorage.setItem('groups', JSON.stringify(nameGroups));
		window.location = "switch.html";
	});

	$(".listOfGroup .icon-spinner11").click(function() {
		$(".showbox").show();
		reFresh(nameGroups);
	});
	function reFresh(obj) {
			for (var item in nameGroups) {
				var b = obj[item].tabCell + 1;
				var c = obj[item].tabRow + 1;
				var tableGroup = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="http://portal.esstu.ru/' + obj[item].tableName + '/raspisan.htm" and xpath="//table/tbody/tr[position() = ' + c + ']/td[position() = ' + b + ']"') + '&format=json';
				$.getJSON(tableGroup, function(data, status, errorThrown) {
					if (status === 'success') {
						if (data.query.results.td.p.a.font.content.indexOf(obj.nameOfGroup) != -1) {
							var itemGroup = groups[data.query.results.tr[c].td[b].p.a.font.content];
							itemGroup.linkOfGroup = data.query.results.tr[c].td[b].p.a.href;        
							localStorage.setItem('groups', JSON.stringify(obj));
							var urlOfGroup = 'http://portal.esstu.ru/' + nameGroup[item].tableName + '/' + nameGroup[item].linkOfGroup;
							console.log(urlOfGroup);
							parseFeed(urlOfGroup, obj.nameOfGroup);
						} else {
							var urlOfGroup = 'http://portal.esstu.ru/' + nameGroup[item].tableName + '/' + nameGroup[item].linkOfGroup;
							console.log(urlOfGroup);
							parseFeed(urlOfGroup, obj.nameOfGroup);
						}
					} else if (status === 'error' || status === 'parsererror') {
						alert('Ошибка! Попробуйте позже!');
					}
				});
			};
			$(".showbox").hide();
        }
	function parseFeed(url, nameOfGroup) {
		var query = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + url + '" and xpath="//table/tbody/tr"') + '&format=json';
		$.getJSON(query, function(data, status, errorThrown) {
			if (status === 'success') {
				var itemDay = data.query.results.tr;
				if (data.query.results == null) {
					alert('Ошибка! Попробуйте позже!');
				};
				itemDay.forEach(
					function(item, i, itemDay) {
						var itemWeekDay;
						if (i >= 2 & i <= 7) {
							var itemWeekDay = timeTable.firstWeek[nameWeekDay[i-2]] = new Object;
						} else if (i >= 8 & i <= 13) {
							var itemWeekDay = timeTable.secondWeek[nameWeekDay[i-8]] = new Object;
						}
						
						if(i >= 2 & i <= 13) {
							for (var j = 1; j <= 6; j++) {
								var itemPara = item.td[j].p.font.content;
								var itemClassDay = itemWeekDay[nameClassDay[j-1]] = new Object;
								var classroom = itemPara.substring(itemPara.indexOf('а.'), itemPara.length);
								var temp = itemPara.split(' ');
								var resulttemp = []
								temp.forEach(
									function(item, i, temp) {
										if (temp[i] === temp[i].toUpperCase() & isNaN(temp[i])) {
											resulttemp.push(temp[i]);
										}
									}
								);
								var teacher = resulttemp[0] + ' ';
								for (var k = 1; k < resulttemp.length; k++) {
									teacher = teacher + resulttemp[k];
									if(k+1 != resulttemp.length) {
										teacher = teacher + ' ';
									}
								}
								while(itemPara.substring(0, 1) == ' ') {
									itemPara = itemPara.substring(1, itemPara.length);
								}
								if (itemPara.substring(0, 4) ==  'лек.') {
									itemPara = itemPara.substring(4, itemPara.indexOf('а.'));
									addClass(itemClassDay, "ЛК", "lecture", classroom, teacher, itemPara.substring(0, itemPara.indexOf(teacher)));
								} else if (itemPara.substring(0, 4) ==  'лаб.') {
									itemPara = itemPara.substring(4, itemPara.indexOf('а.'));
									addClass(itemClassDay, 'ЛБ', "laboratory", classroom, teacher, itemPara.substring(0, itemPara.indexOf(teacher)));
								} else if (itemPara.substring(0, 3) ==  'пр.') {
									itemPara = itemPara.substring(3, itemPara.indexOf('а.'));
									addClass(itemClassDay, 'ПР', "practice", classroom, teacher, itemPara.substring(0, itemPara.indexOf(teacher)));
								} else if (itemPara.indexOf('ФИЗКУЛЬТУРА') != -1) {
									itemPara = itemPara.substring(0, itemPara.indexOf('а.'));
									addClass(itemClassDay, 'ФК', "physical-edu", classroom, teacher, 'ФИЗКУЛЬТУРА');
								};
							}
						}
					}
				);
				localStorage.setItem('timeTable'+nameOfGroup, JSON.stringify(timeTable));
				window.location = "timetable.html";
			} else if (status === 'error' || status === 'parsererror') {
				alert('Не удалось получить данные');
			}
			$(".showbox").hide();
		});
	}
	function addClass(itemClassDay, nameClass, nameClassCss, classroom, teacher, name) {
		itemClassDay.clas = nameClass;
		itemClassDay.classcss = nameClassCss;
		itemClassDay.classroom = classroom;
		itemClassDay.teacher = teacher;
		itemClassDay.name = name;
	}
});