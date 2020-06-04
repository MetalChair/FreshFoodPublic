var lat = 37.41;
var lon = 8.82 ;
var map;

$(document).ready(function(){
    map = new ol.Map({
        target: 'map-container',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([lat, lon]),
          zoom: 4
        })
      });

      navigator.geolocation.getCurrentPosition(function(location) {
        lat = location.coords.latitude;
        lon = location.coords.longitude;
        setMapCenter(lat,lon);
      });
})


//Sets the map center to the given lat and lon
function setMapCenter(lat, lon){
    console.log(lat, lon);
    map.getView().animate({zoom: 12},{center: ol.proj.fromLonLat([lon,lat])},queryForStores);
}

function queryForStores(){
    var glbox = map.getView().calculateExtent(map.getSize()); // doesn't look as expected.
    var box = ol.proj.transformExtent(glbox,'EPSG:3857','EPSG:4326');
    console.log(box);
    var queryString = buildQueryString(box);
    console.log(queryString);
    $.ajax({
        dataType: "json",
        url: "https://www.overpass-api.de/api/interpreter",
        method: "GET",
        data: {data: queryString}
    }).done(function( msg ) {
        var stores = msg.elements;
        for(var i = 0; i < Math.min(stores.length, 25); i++){
            var layer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [
                        new ol.Feature({
                            geometry: new ol.geom.Point(ol.proj.fromLonLat([stores[i].lon, stores[i].lat]))
                        })
                    ]
                })
            });
            map.addLayer(layer);
            console.log("added layer");
        }
    });
}

//So the OSM Overpass query machine is rather convoluted
//This is a single use function that literally jsut builds a query within
//The bounds of the current map
//don't judge me
function buildQueryString(extent){
    var q = "";
    q += "[out:json][timeout:25]; \n"
    q += "( \n"
    q += "node[\"shop\"=\"supermarket\"]" + getExtentString(extent) + ";\n";
    q += "way[\"shop\"=\"supermarket\"]" + getExtentString(extent) + ";\n";
    q += "relation[\"shop\"=\"supermarket\"]" + getExtentString(extent) + ";\n";
    q += ");\n";
    q += "out body;\n"
    q += ">;\n"
    q += "out skel qt;\n"
    return q;
}

//returns the current lat and lon square of the map as a string
function getExtentString(extent){
    return "(" + extent[1] + "," + extent[0] + "," + extent[3] + "," + extent[2] + ")";
}