//makehurricane.js - given a geoJson polyline feature, starting radius in km, 
//and increment in km, uses turf.js to return a hurricane path as a geoJson polygon feature.

var makeHurricane = function(feature, startRadius, increment) {
  var points=feature.geometry.coordinates;
  var numPoints=feature.geometry.coordinates.length;

  var segments = [];
  var radius = startRadius;

  //create segments for each pair of points
  for(var i=1;i<numPoints;i++) {
    segments.push(makeSegment(points[i-1],radius,points[i],radius + increment));
    radius += increment;  
  }

  //union together all segments
  var hurricane;
  segments.forEach(function(segment,i) {
      (i==0 ? hurricane = segment : hurricane = turf.union(hurricane, segment));
  });

  return hurricane;

  //pass in two geoJson point features and two radii, create buffer for each point, convex hull all
  function makeSegment(coord0, radius0, coord1, radius1) {

    var feature0 = turf.point(coord0);
    var feature1 = turf.point(coord1);

    var buffer0 = turf.buffer(feature0, radius0, 'kilometers');
    var buffer1 = turf.buffer(feature1, radius1, 'kilometers');

    return convex(buffer0.features[0],buffer1.features[0]);
  }

  //pass in two geoJson polygon features, create one big featurecollection of points,
  //convex hull the featurecollection.  returns a "segment" of the hurricane
  function convex(polygon0,polygon1) {
    var points = [];

    polygon0.geometry.coordinates[0].map(function(coord) {
      points.push(turf.point(coord));
    })

    polygon1.geometry.coordinates[0].map(function(coord) {
      points.push(turf.point(coord));
    })

    var collection = turf.featurecollection(points);
    var hull = turf.convex(collection);

    return hull;
  }
}