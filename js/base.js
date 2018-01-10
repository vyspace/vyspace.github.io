(function($) {
	function getAjax(tmpl, id, pn) {
		var def = $.Deferred();
		$.ajax({
			type: 'GET',
			url: 'tmpl/' + tmpl,
			dataType: 'text',
			success: function(tmp){
				var pageParams = {};
				pageParams[pn] = true;
				var html = template.render(tmp, pageParams);
				document.getElementById(id).innerHTML = html;
				def.resolve();
			},
			error: function(){
				console.error('template ajax error!');
			}
		});
		return def;
	}
	function getPageName() {
		var str = location.pathname;
		if(/\w+\.html$/.test(str)) {
			arr = /(\w+)\.html$/.exec(str);
			if(arr && arr.length > 1) {
				return arr[1];
			}
			else {
				return null;
			}
		}
		else {
			return 'index';
		}

	}
	var pageName = getPageName();
	if(pageName) {
		getAjax('header.art', 'header', pageName).then(function(){
			//alert(pageName)
		})
	}
})(jQuery);