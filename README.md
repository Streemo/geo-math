# geo-math

~ < 10^2 lines.

**Goal**: Provide a minimal set of commonly needed geolocation functions using the small angle approximation; two main methods, and a handful of trivial (but useful) utility methods.

**What About Large Distances?**: Distances on the order of city or state level will not need exact formulas to get accurate results. We gain performance by sacrificing unnecessary precision. 

**Underneath**: Cache commonly used values, make assumptions about input to speed up calculations, make the small angle approximation whenever possible, include corrections for nontrivial longitudinal squeezing, which is dependent on latitude.

**Tip**: Please only use this if you do not deal with large distance scales.

---
## Full API

Global Object: `GeoMath`

Main methods: `distance`, `randomCoords`

Meta methods: `setUnits`, `getUnits`

Basic utility methods: `randomReal`, `toRadians`, `toDegrees`, `toCanonicalCoords`, `toMongoCoords`, `toMiles`, `toKm`

```
//canonical coords
var cc = {
	lat: Number,
	lng: Number
}

//mongo coords
var mc = {
	type: "Point",
	coordinates: [Number,Number]
}
```

## Main Methods:

### Distance between two points.
```
//only takes two canonical coordinates.
//dist is returned in either km or miles, dep. on GeoMath.setUnits.

var dist = GeoMath.distance(cc1, cc2)

```

### Random coordinates on earth.

```
var pointOnEarth = GeoMath.randomCoords();
```

### Random coordinates in a circle around your location.
```
//you can get a random coordinate pair around another one.

var max_dist = 10 

var cc_random = GeoMath.randomCoords(cc_center, max_dist);
```

### Random coordinates in an annulus around your location.
```
//can ask for a random coord around a center point, at least a certain min_dist away.

var min_dist = 2
var max_dist = 5

var cc_random = GeoMath.randomCoords(cc_center, max_dist, min_dist)
```

## Utility methods:

#### Setting units, default is SI.
```
//set units to SI, input/output in mi.

GeoMath.setUnits("SI")

//set units to US, input/output in mi.

GeoMath.setUnits("US")
```
#### Converting lat/lng or MongoDB coords to canonincal form.
```
//define canonical form as: {lat: Number, lng: Number}
//both snippets return canonical coordinates.

GeoMath.toCanonicalCoords(48.664, -76.234)
var mongoDBloc= {
  type: "Point",
  coordinates: [-76.234, 48.664]
}

GeoMath.toCanonicalCoords(mongoDBloc)
```

Using `GeoMath.toMongoCoords` is similar.

#### Self Explanatory methods.
You can use `GeoMath.randomReal(min,max)` to get a random real number between `min` and `max`.
You can use `GeoMath.getUnits()` to return the current units `GeoMath` is using. Functions are provided to convert between degrees and radians and between km and miles.
