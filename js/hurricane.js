//makehurricane.js - given a geoJson polyline feature, starting radius in km, 
//and increment in km, uses turf.js to return a hurricane path as a geoJson polygon feature.

var multiplier = .05;

var makeTrack = function(featureCollection, property) {

  var points=featureCollection.features;
  var numPoints=points.length;

  var segments = [];

  //create segments for each pair of points
  for(var i=1;i<numPoints;i++) {
    segments.push(makeSegment(points[i-1],points[i])); 
  }

  //union together all segments
  var hurricane;
  segments.forEach(function(segment,i) {
      (i==0 ? hurricane = segment : hurricane = turf.union(hurricane, segment));
  });

  return hurricane;

  //pass in two geoJson point features and two radii, create buffer for each point, convex hull all
  function makeSegment(feature0, feature1) {


    // var feature0 = turf.point(coord0);
    // var feature1 = turf.point(coord1);

    if(feature0.properties[property] == 0) {
     feature0.properties[property] = .0001; 
    } 

    if(feature1.properties[property] == 0) {
     feature1.properties[property] = .0001; 
    } 


    var buffer0 = turf.buffer(feature0, feature0.properties[property] * multiplier , 'kilometers');
    var buffer1 = turf.buffer(feature1, feature1.properties[property] * multiplier , 'kilometers');

    // L.geoJson(buffer0).addTo(map);
    // L.geoJson(buffer1).addTo(map);


    hull = convex(buffer0.features[0],buffer1.features[0])

  

    return hull ;
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