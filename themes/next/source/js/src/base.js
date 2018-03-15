(function ($) {
    $(document).ready(function() {
    	Pace.on('done', function() {
    		$('#theHeadBand').css({'background':'#222'})
    	})
    });
})(jQuery);