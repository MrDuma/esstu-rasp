$(document).ready(function() {
	var nameTable;
	$(".selLabel").click(function() {
		$('.dropdown').toggleClass('active');
		$('.dropdown').css("z-index", 9);
		$(".dropdown-list li").show();
	});
	$(".dropdown-list li").click(function() {
		nameTable = $(this).children().attr('id')
		$('.selLabel').text($(this).text());
		$('.dropdown').removeClass('active');
	});
	$("#setTable").click(function() {
		findTable();
	});
	var groups = new Object;
	var listOfGroup = new Object;
	var timeTable = new Object();
	timeTable.firstWeek = new Object();
	timeTable.secondWeek = new Object();
	var nameWeekDay = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	var nameClassDay = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
	function findTable() {
		$(".showbox").show();
		var name = document.getElementById('group').value;
		if(name == '') {
			$(".showbox").hide();
			alert('Введите номер группы!');
		}
		var tableGroup
		if (nameTable === 'bakalavriat') {
			tableGroup = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fportal.esstu.ru%2Fbakalavriat%2Fraspisan.htm%22and%20xpath%3D%22%2F%2Ftable%2Ftbody%2Ftr%22&format=json&diagnostics=true&callback=';
		} else if (nameTable === 'spezialitet') {
			tableGroup = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fportal.esstu.ru%2Fspezialitet%2Fraspisan.htm%22and%20xpath%3D%22%2F%2Ftable%2Ftbody%2Ftr%22&format=json&diagnostics=true&callback=';
		} else {
			$(".showbox").hide();
			alert('Выберите направление!');
		};
		$.getJSON(tableGroup, function(data, status, errorThrown) {
			if (status === 'success') {
				if (data.query.results == null) {
					$(".showbox").hide();
					alert('Ошибка! Попробуйте позже!');
				};
				$(".codrops").text('');
				var tableRow = data.query.results.tr;
				tableRow.forEach(
					function(itemRow, i, tableRow) {
						var tableCell = itemRow.td
						var n = 1;
						tableCell.forEach(
							function(itemCell, j, tableCell) {
								if ('a' in itemCell.p) {
									if ('content' in itemCell.p.a.font) {
										if (itemCell.p.a.font.content.indexOf(name) != -1) {
											var li = listOfGroup[i] = new Object;
											li['i'] = i;
											li['j'] = j;
											$(".codrops").append('<div class="listOfGroup" id = "' + i + '">' + itemCell.p.a.font.content + '</div>');
											n = n++;
										}
									}
								}
							}
						);
					}
				);
				$(".showbox").hide();
				if ($(".listOfGroup").text() == '') {
					alert('Группа не найдена :(');
				};
				$(".listOfGroup").click(function() {
					$(".showbox").show();
					var id = this.id;
					var idlist = listOfGroup[id];
					var i = idlist['i']
					var j = idlist['j']
					var retrievedObject = localStorage.getItem('groups');
					if(retrievedObject != null) {
						groups = JSON.parse(retrievedObject);
					}
					var itemGroup = groups[data.query.results.tr[i].td[j].p.a.font.content] = new Object;
					itemGroup.nameOfGroup = data.query.results.tr[i].td[j].p.a.font.content;
					itemGroup.linkOfGroup = data.query.results.tr[i].td[j].p.a.href;
					itemGroup.tableName = nameTable;
					itemGroup.tabRow = i;
					itemGroup.tabCell = j;
					localStorage.setItem('groups', JSON.stringify(groups));
					var urlOfGroup  = 'http://portal.esstu.ru/' + itemGroup.tableName + '/' + itemGroup.linkOfGroup;						
					parseFeed(urlOfGroup, itemGroup.nameOfGroup);
				});
			} else if (status === 'error' || status === 'parsererror') {
				alert('Ошибка! Попробуйте позже!');
			}
		});
	};
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
								var classroom = new Object;
								var numsymroom = itemPara.indexOf('а.');
								classroom[1] = itemPara.substring(numsymroom, itemPara.indexOf(' ',numsymroom));
								if (itemPara.indexOf('а.', numsymroom + 1) != -1) {
									if (classroom[1] != itemPara.substring(itemPara.lastIndexOf('а.'), itemPara.length))
									classroom[2] = itemPara.substring(itemPara.lastIndexOf('а.'), itemPara.length);
								}
								var temp = itemPara.split(' ');
								var resulttemp = []
								temp.forEach(
									function(item, i, temp) {
										if (temp[i] === temp[i].toUpperCase() & isNaN(temp[i])) {
											resulttemp.push(temp[i]);
										}
									}
								);
								var indexdot1 
								for (var index = 0; index < resulttemp.length; ++index) {
									if (resulttemp[index].indexOf('.') != -1) {
											indexdot1 = index;
											break;
										}
								};
								var teacher = new Object;
								teacher[1] = resulttemp[indexdot1 - 1] + ' ' + resulttemp[indexdot1];
								var indexdot2 = 0;
								for (var index = 0; index < resulttemp.length; ++index) {
									if (index > indexdot1) {
											if (resulttemp[index].indexOf('.') != -1) {
												indexdot2 = index;
											}
										}
								};
								if (indexdot2 != 0) {teacher[2] = resulttemp[indexdot2-1] + ' ' + resulttemp[indexdot2];};
								while(itemPara.substring(0, 1) == ' ') {
									itemPara = itemPara.substring(1, itemPara.length);
								}
								if (itemPara.substring(0, 4) ==  'лек.') {
									itemPara = itemPara.substring(4, itemPara.length);
									var name = new Object;
									name[1] = itemPara.substring(0, itemPara.indexOf(teacher[1]));
									if (teacher[2] != undefined) {
										name[2] = itemPara.substring(itemPara.indexOf(classroom[1]) + classroom[1].length, itemPara.indexOf(teacher[2]));
									}
									addClass(itemClassDay, "ЛК", "lecture", classroom, teacher, name);
								} else if (itemPara.substring(0, 4) ==  'лаб.') {
									itemPara = itemPara.substring(4, itemPara.length);
									var name = new Object;
									name[1] = itemPara.substring(0, itemPara.indexOf(teacher[1]));
									if (teacher[2] != undefined) {
										name[2] = itemPara.substring(itemPara.indexOf(classroom[1]) + classroom[1].length, itemPara.indexOf(teacher[2]));
									}
									addClass(itemClassDay, 'ЛБ', "laboratory", classroom, teacher, name);
								} else if (itemPara.substring(0, 3) ==  'пр.') {
									itemPara = itemPara.substring(3, itemPara.length);
									var name = new Object;
									name[1] = itemPara.substring(0, itemPara.indexOf(teacher[1]));
									if (teacher[2] != undefined) {
										name[2] = itemPara.substring(itemPara.indexOf(classroom[1]) + classroom[1].length, itemPara.indexOf(teacher[2]));
									}
									addClass(itemClassDay, 'ПР', "practice", classroom, teacher, name);
								} else if (itemPara.indexOf('ФИЗКУЛЬТУРА') != -1) {
									itemPara = itemPara.substring(0, itemPara.indexOf('а.'));
									addClass(itemClassDay, 'ФК', "physical-edu", classroom, 'ФКС', 'ФИЗКУЛЬТУРА');
								};
							}
						}
					}
				);
				localStorage.setItem('timeTable'+nameOfGroup, JSON.stringify(timeTable));
				localStorage.setItem('activeGroup', nameOfGroup);
				console.log(timeTable);
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