
var Utils = {
	ajax: function(url, data, callback, type){
		type = type === undefined ? 'post' : type;
		$.ajax({
			url: url,
			data: data,
			type: type,
			success: function(data){
				if (callback !== undefined) {
					callback(data);
				}
			}
		});
	},
	get: function(url, data, callback){
		this.ajax(url, data, callback, 'get');
	},
	animateFade: function(el, opacity){
		el.stop().animate({'opacity': opacity}, 400, 'easeOutExpo');
	},
};

function log(message) {
    console.log(message);
};

function guid() {
	function s4() {
    	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  	}
  	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

$.fn.getCSSNumericValue = function(property){
    return parseInt(this.css(property), 10);
};

$.fn.setWidth = function(value){
    $(this).css('width', value);
    return this;
};

$.fn.setHeight = function(value){
    $(this).css('height', value);
    return this;
};

$.fn.setLeft = function(value) {
	$(this).css('left', value);
    return this;
};

$.fn.setTop = function(value) {
	$(this).css('top', value);
    return this;
};

$.fn.centerAlign = function(){
    $(this).css({
        'left': '50%',
        'margin-left': -$(this).getCSSNumericValue('width')/2,
    });
    return this;
};

$.fn.observe = function(eventName, callback) {
    return this.each(function(){
        var el = this;
        $(document).on(eventName, function(){
            callback.apply(el, arguments);
        })
    });
};
