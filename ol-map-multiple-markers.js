var straitSource = new ol.source.Vector({ wrapX: true });
var straitsLayer = new ol.layer.Vector({
    source: straitSource
});

var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),
        straitsLayer
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([21.002902, 52.228850]),
        maxZoom: 18,
        zoom: 2
    })
});

// Popup showing the position the hovered marker
var container = document.getElementById('popup');
var popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 450
    }
});
map.addOverlay(popup);

// Popup showing the position the user clicked
var containerClick = document.getElementById('popupClick');
var popupClick = new ol.Overlay({
    element: containerClick,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});
map.addOverlay(popupClick);

// Popup part
var content = document.getElementById('popup-content');
var contentClick = document.getElementById('popup-content-click');
var selected = null;

// Hover popup
map.on('pointermove', function (evt)
{
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feat, layer) {
        return feat;
    });
    if (map.hasFeatureAtPixel(evt.pixel) === true)
    {
        if(selected != feature)
        {
            // Event coordinates
            // popup.setPosition(evt.coordinate);
            // Lon Lat coordinates
            var postion = ol.proj.transform([feature.get('lon'),feature.get('lat')], 'EPSG:4326', 'EPSG:3857');
            content.innerHTML = feature.get('desc');
            popup.setPosition(postion);
        }
    }
    else
    {
        popup.setPosition(undefined);
    }

});

// Click popup
map.on('click', function (evt)
{
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feat, layer) {
        selected = feat;
        return feat;
    });
    if (map.hasFeatureAtPixel(evt.pixel) === true)
    {
        // Event coordinates
        // popup.setPosition(evt.coordinate);
        // Lon Lat coordinates
        var postion = ol.proj.transform([feature.get('lon'),feature.get('lat')], 'EPSG:4326', 'EPSG:3857');
        contentClick.innerHTML = feature.get('desc');
        popupClick.setPosition(postion);
    }
    else
    {
        selected = null;
        popupClick.setPosition(undefined);
    }
});

// Popup content
function ToolTip(desc)
{
    return '<div class="ol-tooltip">'+
        '<img src="'+desc.img+'">' +
        '<div class="info">'+
            '<div class="ol-tooltip-job"> <a href="'+desc.link+'"> '+desc.job+' </a> </div>'+
            '<div class="ol-tooltip-salary">'+desc.salary+'</div>'+
            '<div class="ol-tooltip-company">'+desc.name+'</div>'+
        '</div>'+
    '</div>';
}

// Data from database here :)
var data = [{"Lon":20.423771205611732,"Lat":51.312306306284796, "Desc": {"icon": "img/icons/icon-cpp.png", "img": "img/icons/icon-star.png", "link": "http://woo.xx", "name": "Microsoft Sp.z.o.o", "salary": "6K - 15k PLN", "job": "Backend Developer"}},{"Lon":138.83696330321376,"Lat":34.82803186343469, "Desc": {"icon": "img/icons/icon-js.png", "img": "img/icons/icon-star.png", "link": "http://woo.xx", "name": "ALiance Forever Sp.z.o.o", "salary": "9K - 15k PLN", "job": "Js Developer"}},{"Lon":-40.44607585856028,"Lat":-7.328655246981256, "Desc": {"icon": "img/icons/icon-coin.png", "img": "img/icons/icon-coin.png", "link": "http://woo.xx", "name": "FunnyG Sp.z.o.o", "salary": "11K - 15k PLN", "job": "Bitcoin Developer"}},{"Lon":-83.26297726701098,"Lat":32.452601633323226, "Desc": {"icon": "img/icons/icon-php.png", "img": "img/icons/icon-star.png", "link": "http://woo.xx", "name": "Comercial Zoo Sp.z.o.o", "salary": "7000 - 9000 PLN", "job": "Php Developer"}},{"Lon":-120.9344508712306,"Lat":37.2251403205222, "Desc": {"icon": "img/icons/icon-def.png", "img": "img/icons/icon-star.png", "link": "http://woo.xx", "name": "Google Sp.z.o.o", "salary": "15000 - 25000 PLN", "job": "UI Designer"}},{"Lon":-61.77952129376579,"Lat":53.652271089831004, "Desc": {"icon": "img/icons/icon-net.png", "img": "img/icons/icon-star.png", "link": "http://woo.xx", "name": "Facebook Sp.z.o.o", "salary": "17000 - 35000 PLN", "job": "UI Designer"}},{"Lon":-2.6245917163009893,"Lat":51.94948976542784, "Desc": {"icon": "img/icons/icon-html.png", "img": "img/icons/icon-star.png", "link": "http://woo.xx", "name": "MoovSpace Sp.z.o.o", "salary": "7000 - 25000 PLN", "job": "UI Designer"}},{"Lon":21.423771205611732,"Lat":50.312306306284796, "Desc": {"icon": "img/icons/icon-js.png", "img": "img/icons/icon-star.png", "link": "http://woo.xx", "name": "Moovle", "salary": "9000- 15000 PLN", "job": "Full Stack Developer"}}];

// Create markers function
// icon.imageDiv.className += "name"
function addPointGeom(data) {
    data.forEach(function(item) { //iterate through array...

        var longitude = item.Lon, latitude = item.Lat, desc = item.Desc;

        var MarkerIcon = new ol.style.Icon({
            anchor: [0.5, 50],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: desc.icon
            ,scale: 0.5
        });

        var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857')),
            type: 'Point',
            desc: ToolTip(desc),
            lon: longitude,
            lat: latitude
            // desc: '<pre> <b>Waypoint Details </b> ' + '<br>' + 'Latitude : ' + latitude + '<br>Longitude: ' + longitude + '</pre>'
        }),
        iconStyle = new ol.style.Style({
            image: MarkerIcon
        });
        iconFeature.setStyle(iconStyle);
        straitSource.addFeature(iconFeature);
    });
}

// Add markers now
addPointGeom(data);