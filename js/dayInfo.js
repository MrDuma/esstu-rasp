var numWeek = weekInfo();
var date = new Date();
var day = date.getDay();
var nameDay = '';
switch (day) {
	case 1:
		nameDay = 'monday';
		break
	case 2:
		nameDay = 'tuesday';
		break
	case 3:
		nameDay = 'wednesday';
		break
	case 4:
		nameDay = 'thursday';
		break
	case 5:
		nameDay = 'friday';
		break
	case 6:
		nameDay = 'saturday';
		break
}
if(numWeek = 2) {
	if($('title').text() == '2') {
		$('a[href="#'+nameDay+'"]').text($('a[href="#'+nameDay+'"]').text() + ' (тек.)');
	}
} else {
	if($('title').text() != '2') {
		$('a[href="#'+nameDay+'"]').text($('a[href="#'+nameDay+'"]').text() + ' (тек.)');
	}
}