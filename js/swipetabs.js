 $(function() {
        $(".tab-content").swiperight(function() {
				  var $tab = $('#tablist .active').prev();
            if ($tab.length > 0)
                $tab.find('a').tab('show');
			  
        });
        $(".tab-content").swipeleft(function() {
            var $tab = $('#tablist .active').next();
            if ($tab.length > 0)
                $tab.find('a').tab('show');
			
        });
    });
	
		