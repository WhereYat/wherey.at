var WhereYat = function(options) {
	var defaults = {
		className: '.whereyat',
		classPrefix: 'yat-',
		latitudeData: 'yatLat',
		longitudeData: 'yatLong',
		distances: {
			'xs': 75,
			'sm': 200,
			'md': 750,
			'lg': 1250
		}
	};
	this.options = jQuery.extend({}, defaults, options);
	this.nodes = [];
	this.parse();
	this.render();
};

WhereYat.prototype.locate = function() {
	var _this = this;
	jQuery.ajax({
		method: 'GET',
		url: 'https://ip.wherey.at/',
		success: function(data, status, jqXHR) {
			_this.location = {
				lat: data.latitude,
				lng: data.longitude
			};
			_this.render();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			// something went wrong
			// TODO: add fallback?
			// TODO: render error state
		}
	});
};

WhereYat.prototype.parse = function() {
	var _this = this;
	jQuery(_this.options.className).each(function(){
		_this.nodes.push(this);
	});
};

WhereYat.prototype.render = function() {
	var _this = this;
	if (_this.location === undefined) {
		_this.locate();
		return;
	}
	jQuery(_this.nodes).each(function(){
		var $el = jQuery(this)
		, location = {
			lat: $el.data(_this.options.latitudeData),
			lng: $el.data(_this.options.longitudeData)
		}
		, distance = _this.distance(location, _this.location)
		, distanceClass = 'xl';
		for (var klass in _this.options.distances) {
			if (_this.options.distances[klass] >= distance) {
				distanceClass = klass;
				break;
			}
		}
		$el.addClass(_this.options.classPrefix + distanceClass);
	});
};

WhereYat.prototype.distance = function(from, to, unit) {
	var lat1 = from.lat
	,	lat2 = to.lat
	,	lon1 = from.lng
	,	lon2 = to.lng
	,	radlat1 = Math.PI * lat1/180
	,	radlat2 = Math.PI * lat2/180
	,	radlon1 = Math.PI * lon1/180
	,	radlon2 = Math.PI * lon2/180
	,	theta = lon1-lon2
	,	radtheta = Math.PI * theta/180
	,	dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") {
		dist = dist * 1.609344;
	}
	if (unit=="N") {
		dist = dist * 0.8684;
	}
	return dist;
};