//set common constants

GeoMath = {};
GeoMath.TWOPI = 2*Math.PI;
GeoMath.RADPERDEG = Math.PI/180;
GeoMath.DEGPERRAD = 180/Math.PI;
GeoMath.MILEPERKM = 1.609344;
GeoMath.KMPERMILE = 0.621371192237334;

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

//init common constants in SI units

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

GeoMath.toMiles = function(km){
	return km * this.MILEPERKM
}

GeoMath.toKm = function(miles){
	return miles * this.KMPERMILE
}

GeoMath.toCanonicalCoords = function(/*enter lat,lng or mc */){
	//takes either mongoDB coordinates, or comma sep. lat, lng arguments.
	//returns coordinates in canonical form.
	if (arguments.length > 1){
		return {lat: arguments[0], lng: arguments[1]};
	} else {
		var mcc = arguments[0].coordinates;
		return {lat: mcc[1], lng: mcc[0]}
	}
}

GeoMath.toMongoCoords = function(/*enter lat,lng or cc */){
	//similar to above, but returns mongoDB coords.
	var mc = {type: "Point"};
	if (arguments.length > 1){
		mc.coordinates = [arguments[1], arguments[0]];
	} else {
		var cc = arguments[0];
		mc.coordinates = [cc.lng, cc.lat];
	}
	return mc;
}



/*
	The thing which is approximate here is dTheta, but it is a very small angle, since...
	
	Assume that d/R_earth << 1. cc1 and cc2 can be approximated as lying on a 2D plane.
	Then, calculate dist. between two 2d vectors normally, but add a correction factor
	gamma which accounts for long. squeezing (taking the squeeze correction at midpoint).
	Then return the arc length.
*/
GeoMath.distance = function(cc1, cc2){
	var gamma = Math.cos(this.toRadians(cc1.lat+cc2.lat)/2);
	//this is ok due to small angle (or equiv. small dist) approx.
	var dLng = ( cc1.lng - cc2.lng ) * gamma;
	var dLat = ( cc1.lat - cc2.lat );
	var dTheta = this.toRadians( Math.sqrt( dLat*dLat + dLng*dLng ) );
	return this.RADIUSEARTH * dTheta;
}




/*
	Take our center coords, cc, and increment it by a random dVector
	that falls within the given radial range.

	1. First calculate a random radial distance from center coords.
	2. Then calculate a random angle about the center coords.
	  
	I altered the formula by using a midpoint approximation for gamma.
	Not only is this more accurate than defaulting to the initial point to calculate
	longitudinal squeezing, but it gets rid of the singular points at the poles :)
	Santa can use our app!
*/
GeoMath.randomCoords = function(cc, max, min){
	//if no center is given, generate a random point on earth.
	if (!cc){
		return {lat: this.randomReal(-90,90), lng: this.randomReal(-180,180)}
	}
	//annulus of inner radius 0 === whole circle of outer radius max.
	min = min || 0;
	//random dVector magnitude
	var dR_rand = this.randomReal(min,max) / this.UNITSPERDEG;
	//random dVector direction
	var theta_rand = this.TWOPI*Math.random()
	//convert dVector to dX and xY (lng and lat) coords
	var dLat = dR_rand * Math.sin(theta_rand);
	var gamma = 1 / Math.cos(this.toRadians(cc.lat + dLat/2))
	var dLng = dR_rand * Math.cos(theta_rand) * gamma;
	return {
		lat: cc.lat + dLat,
		lng: cc.lng + dLng
	}
}