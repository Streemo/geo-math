GeoMath = {}
GeoMath.TWOPI = 2*Math.PI
GeoMath.RADPERDEG = Math.PI/180
GeoMath.DEGPERRAD = 180/Math.PI

GeoMath.setUnits = function(type){
	if (!type || type !== "US"){
		this.RADIUSEARTH = 6378.1
		this.UNITSPERDEG = 111.3
		this._units = "SI"
	} else {
		this.RADIUSEARTH = 3963.1676
		this.UNITSPERDEG = 69.1703
		this._units = "US"
	}
}

GeoMath.setUnits();

GeoMath.getUnits = function(){
	return this._units;
}

GeoMath.randomReal = function(min,max){
	return ( Math.random() * (max-min) ) + min
}

GeoMath.toRadians = function(degrees){
	return degrees * this.RADPERDEG
}

GeoMath.toDegrees = function(radians){
	return radians * this.DEGPERRAD
}

GeoMath.toCanonicalCoords = function(/*enter lat,lng or mc */){
	if (arguments.length > 1){
		return {lat: arguments[0], lng: arguments[1]};
	} else {
		var mcc = argument[0].coordinates;
		return {lat: mcc[1], lng: mcc[0]}
	}
}

GeoMath.toMongoCoords = function(/*enter lat,lng or cc */){
	var mc = {type: "Point"};
	if (arguments.length > 1){
		mc.coordinates = [arguments[1], arguments[0]];
	} else {
		var cc = argument[0];
		mc.coordinates = [cc.lng, cc.lat];
	}
	return mc;
}

GeoMath.distance = function(cc1, cc2){
	var gamma = Math.cos(this.toRadians(cc1.lat+cc2.lat)/2);
	var dLng = ( cc1.lng - cc2.lng ) * gamma;
	var dLat = ( cc1.lat - cc2.lat );
	var dTheta = this.toRadians( Math.sqrt( dLat*dLat + dLng*dLng ) );
	return this.RADIUSEARTH * dTheta;
}

GeoMath.randomCoords = function(cc, max, min){
	min = min || 0;
	var dR_rand = this.randomReal(min,max) / this.UNITSPERDEG;
	var theta_rand = this.TWOPI*Math.random()
	var dLat = dR_rand * Math.sin(theta_rand);
	var gamma = 1 / Math.cos(this.toRadians(cc.lat + dLat/2))
	var dLng = dR_rand * Math.cos(theta_rand) * gamma;
	return {
		lat: cc.lat + dLat,
		lng: cc.lng + dLng
	}
}