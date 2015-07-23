# geo-math

~ < 10^2 lines.

**Goal**: Provide a minimal set of commonly needed geolocation functions using the small angle approximation, two main methods, 6 utility methods.

**What About Large Distances?**: Distances on the order of city or state level will not need exact formulas to get accurate results. We gain performance by sacrificing unnecessary precision. 

**Underneath**: Cache commonly used values, make assumptions about input to speed up calculations, make the small angle approximation whenever possible, include corrections for nontrivial longitudinal squeezing, which is dependent on latitude.

**Tip**: Please only use this if you do not deal with large distance scales.

---
## Full API

Global Object: `GeoMath`

Meta methods: `setUnits`, `getUnits`

Utility methods: `randomReal`, `toRadians`, `toDegrees`, `toCanonicalCoords`, `toMongoCoords`, `distance`, `randomCoords`

####Setting units, default is SI.
```
//set units to SI, input/output in mi.

GeoMath.setUnits("SI")

//set units to US, input/output in mi.

GeoMath.setUnits("US")
```
####Converting lat/lng or MongoDB coords to canonincal form.
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

####Converting lat/lng or canonical coords to MongoDB form.
This is analagous to the above code, but we use `GeoMath.toMongoCoords` instead.


####Distance between two points.
```
//only takes two canonical coordinates.
//dist is returned in the units you have chosen.

var dist = GeoMath.distance(cc1, cc2)

```

####Random coordinates in a circle around your location.
```
//you can get a random coordinate pair around another one.
//km or miles, dep. on your set units

var max_dist = 10 

var cc_random = GeoMath.randomCoords(cc_center, max_dist);
```

####Random coordinates in an annulus around your location.
```
//in my case, I need to ask for a random coordinate around cc_center, which is at least min_dist away from cc_center.
//km or miles, dep. on your set units

var min_dist = 2
var max_dist = 5

var cc_random = GeoMath.randomCoords(cc_center, max_dist, min_dist)
```

#### Utility functions need in the other functions.
You can use `GeoMath.randomReal(min,max)` to get a random real number between `min` and `max`.
You can use `GeoMath.getUnits()` to return `"SI"` or `"US"` depending on the units GeoMath is currently using.
Finally, functions are provided to convert between degrees and radians.
