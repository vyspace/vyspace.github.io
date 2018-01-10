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
		var	str = location.pathname.split('.')[0],
			arr = /\w+/.exec(str);
		if(arr && arr.length > 0) {
			return arr[0];
		}
		else {
			return null
		}

	}
	var pageName = getPageName();
	if(pageName) {
		document.title = 'vyspace-' + pageName;
		getAjax('header.art', 'header', pageName).then(function(){
			//alert(pageName)
		})
	}
})(jQuery);