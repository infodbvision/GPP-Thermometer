var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var features = [];

$.ajax({
  url: 'https://raw.githubusercontent.com/Meesgieling/performance/master/data.json?token=ALZ4i6neXfWUZpGXNpmo7EJwXSV843BCks5a8WJDwA%3D%3D', //http://172.16.29.41:8080/geoserver/geluidregister/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geluidregister:c207_geluidproductieplafonds&maxFeatures=61000&outputFormat=application%2Fjson
  dataType: 'json',
  async: false,
  success: function(json1) {
    $.each(json1, function(key, data) {
      if (key == 'features') {
        $.each(data, function(k, v) {
          if (v.type == 'Feature') {
            if (v.geometry.coordinates.length > 1) {
              features[k] = new ol.Feature({
                geometry: new ol.geom.Point(v.geometry.coordinates),
                id: v.properties.id,
                artikel: v.properties.artikel,
                Xcoordinaat: v.properties.point_x,
                Ycoordinaat: v.properties.point_y,
                Zcoordinaat: v.properties.point_z,
                gpp: v.properties.gpp,
                dagen_totaal: v.properties.dagen_totaal,
                alle_percentages: v.properties.alle_percentages,
                aantal_dagen: v.properties.aantal_dagen,
                gpp_realtime: v.properties.gpp_realtime,
                recent_bes: v.properties.recent_bes,
                beg_dat: v.properties.beg_dat,
                gpp_realtime: v.properties.gpp_realtime,
                geluidruimte: v.properties.geluidruimte,
                gpp_vrsp: v.properties.gpp_vrsp,
                percentage_fout: v.properties.percentage_fout,
                laatste_meting: v.properties.laatste_meting
              });
            }
          }
        });
      }
    });
  }
});

var overlay = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 1
  }
});
closer.onclick = function() {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

var geocoder = new Geocoder('nominatim', {
  provider: 'osm',
  lang: 'nl-NL',
  autoComplete: true,
  autoCompleteMinLength: 3,
  placeholder: 'Vul hier uw postcode of adres in',
  targetType: 'text-input',
  limit: 7,
  countrycodes: 'nl',
  keepOpen: false,
  preventDefault: false
});

/*
var layers = [
new ol.layer.Tile({
source: new ol.source.OSM()
}),
new ol.layer.Image({
extent: [-13884991, 2870341, -7455066, 6338219],
source: new ol.source.ImageWMS({
url: 'http://172.16.29.41:8080/geoserver/geluidregister/wms?service=WMS&version=1.1.0&request=GetMap&layers=geluidregister:c207_geluidproductieplafonds&styles=&bbox=394143.1875,6578046.5,804491.3125,7063132.5&width=649&height=768&srs=EPSG:900913&format=application/openlayers',
params: {'LAYERS': 'geluidregister:c207_geluidproductieplafonds'},
ratio: 1,
serverType: 'geoserver'
})
})
];*/

var source = new ol.source.Vector({
features: features
});

var clusterSource = new ol.source.Cluster({
distance: 6,
source: source
});

var raster = new ol.layer.Tile({
source: new ol.source.OSM({
  preload: 8
})
});

var styleCache = {};
var clusters = new ol.layer.Vector({
source: clusterSource,
style: function(feature) {
  var size = feature.get('features').length;
  var style = styleCache[size];
  if (!style) {
    style = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 10,
        stroke: new ol.style.Stroke({
          color: '#fff'
        }),
        fill: new ol.style.Fill({
          color: 'teal'
        })
      }),
      text: new ol.style.Text({
        text: size.toString(),
        fill: new ol.style.Fill({
          color: '#fff'
        })
      })
    });
    styleCache[size] = style;
  }
  return style;
}
});

var map = new ol.Map({
target: 'map',
layers: [raster, clusters],
overlays: [overlay],
view: new ol.View({
  center: [568744.996128, 6816229.956732],
  zoom: 8,
  minZoom: 8,
  maxZoom: 16,
})
});

map.on('singleclick', function(evt) {
map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
  var coordinate = evt.coordinate;
  var featurelist = feature.N.features;
  if (featurelist.length > 0) {
    for (var i = 0, ii = featurelist.length; i < ii; ++i) {
      id = featurelist[i].N.id;
      artikel = featurelist[i].N.artikel;
      Xcoordinaat = featurelist[i].N.Xcoordinaat;
      Ycoordinaat = featurelist[i].N.Ycoordinaat;
      Zcoordinaat = featurelist[i].N.Zcoordinaat.toFixed(2);
      dagen_totaal = featurelist[i].N.dagen_totaal;
      alle_percentages = featurelist[i].N.alle_percentages;
      aantal_dagen = featurelist[i].N.aantal_dagen;
      gpp = featurelist[i].N.gpp.toFixed(2);
      gpp_realtime = featurelist[i].N.gpp_realtime;
      recent_bes = featurelist[i].N.recent_bes;
      beg_dat = featurelist[i].N.beg_dat;
      gpp_realtime = featurelist[i].N.gpp_realtime;
      geluidruimte = featurelist[i].N.geluidruimte;
      gpp_vrsp = featurelist[i].N.gpp_vrsp;
      percentage_fout = featurelist[i].N.percentage_fout;
      laatste_meting = featurelist[i].N.laatste_meting;
      if (featurelist.length < 2) {
        document.getElementById("id").innerHTML = id;
        document.getElementById("artikel").innerHTML = artikel;
        document.getElementById("Xcoordinaat").innerHTML = Xcoordinaat;
        document.getElementById("Ycoordinaat").innerHTML = Ycoordinaat;
        document.getElementById("Zcoordinaat").innerHTML = Zcoordinaat + " m";
        document.getElementById("gpp").innerHTML = gpp + " dB";
        if(!recent_bes){
            document.getElementById("recent_bes").innerHTML = "--";
        } else{
        document.getElementById("recent_bes").innerHTML = '<a href="http://www.rijkswaterstaat.nl/apps/geoservices/rwsnl/download//geluidsregister/'+ recent_bes + '" target="_blank">' + recent_bes.replace('besluiten/','') + '</a>';
        }
        if(artikel == '11.45 lid 1'){
          document.getElementById("pcw").innerHTML = "1.50 dB"
        } else{
          document.getElementById("pcw").innerHTML = "0.00 dB"
        }

        document.getElementById("gpp_realtime").innerHTML = gpp_realtime + " dB";
        document.getElementById("geluidruimte").innerHTML = geluidruimte + " dB";
        document.getElementById("gpp_vrsp").innerHTML = gpp_vrsp + " dB";
        document.getElementById("percentage_fout").innerHTML = percentage_fout + " %";

        datumString = beg_dat;
        var beginDatum = new Date(datumString.substr(0, 4), parseInt(datumString.substr(5, 2)) - 1, datumString.substr(8, 2));
        beginDatumString = beginDatum.toLocaleDateString();

        document.getElementById("beg_dat").innerHTML = beginDatumString;

        if(!laatste_meting){
            document.getElementById("laatste_meting").innerHTML = "--";
        } else{
          datumString2 = laatste_meting;
          var meetDatum = new Date(datumString2.substr(0, 4), parseInt(datumString2.substr(5, 2)) - 1, datumString2.substr(8, 2));
          meetDatumString = meetDatum.toLocaleDateString();
          document.getElementById("laatste_meting").innerHTML = meetDatumString;
        }

        var i;
        var tablinks;
        var x = document.getElementsByClassName("tabs");
        for (i = 0; i < x.length; i++) {
          x[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablink");
      for (i = 0; i < x.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" w3-blue", "");
      }
        document.getElementById("Geluid").style.display = "block";
        document.getElementById("Geluidbutton").className += " w3-blue";

        var dagen = [];
                var hekje = '#';
                var aapje = '@';
                var streepje = '-';

                var percentages = [];

            for (var c = 1; c <= parseInt(dagen_totaal); c++)
            {
                    percentageArray = alle_percentages.split(hekje);
                    dagpercentage = percentageArray[c - 1].split(aapje);
                    gppper = dagpercentage[1];
                    voorspelddb = (10 * Math.log10(((c * 1.0) / (parseInt(aantal_dagen) * 1.0)) * (Math.pow(10, (parseFloat(gpp_realtime) / 10))))).toFixed(2);
                    voorspeldper = (Math.pow(10, (parseFloat(voorspelddb) / 10)) / Math.pow(10, (parseFloat(gpp) / 10)) * 100).toFixed(2);
                    if (parseFloat(gppper) == -1){voorspeldper = voorspeldper;}
                    if (parseFloat(gppper) != -1){voorspeldper = null;}
                    if (parseFloat(gppper) == -1){gppper = null;}
                    if (parseFloat(gppper) != -1){gppper = gppper;}
                    var gppperdatum = dagpercentage[0];
                    var gppperdatumArray = gppperdatum.split(streepje);
                    var gppperjaar = gppperdatumArray[0];
                    var gpppermaand = gppperdatumArray[1];
                    var gppperdag = gppperdatumArray[2];
                    percentages.push ([new Date(parseInt(gppperjaar), parseInt(gpppermaand) - 1, parseInt(gppperdag)), parseFloat(gppper) , 100, parseFloat(voorspeldper)]);
            }

        google.charts.load('current');
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {

          var data = new google.visualization.DataTable();
          data.addColumn('date', 'dag');
          data.addColumn('number', 'Realtime');
          data.addColumn('number', 'GPP');
          data.addColumn('number', 'Voorspelling');
          data.addRows(
            percentages
          );
          var dateTicks = [];
              dateTicks.push( new Date(parseInt(gppperjaar), 0, 1));
              dateTicks.push( new Date(parseInt(gppperjaar), 1, 1));
              dateTicks.push( new Date(parseInt(gppperjaar), 2, 1));
              dateTicks.push( new Date(parseInt(gppperjaar), 3, 1));
              dateTicks.push( new Date(parseInt(gppperjaar), 4, 1));
              dateTicks.push( new Date(parseInt(gppperjaar), 5, 1));
              dateTicks.push( new Date(parseInt(gppperjaar), 6, 1));
              dateTicks.push( new Date(parseInt(gppperjaar), 7, 1));
              dateTicks.push( new Date(parseInt(gppperjaar), 8, 1));
              dateTicks.push( new Date(parseInt(gppperjaar), 9, 1));
              dateTicks.push( new Date(parseInt(gppperjaar), 10, 1));
              dateTicks.push( new Date(parseInt(gppperjaar), 11, 1));

          var options = {
            title: 'GPP Realtime Percentage',
            series: {2:{lineDashStyle: [2, 2], color: '64B8F8'}},
            vAxis: {
              title: '%',
              ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
              viewWindow:{ max:100, min:0}},
              hAxis: {
              title: 'Maand',
              format: 'MMM',
              ticks: dateTicks,
              gridlines: {count: 12}},
              legend: { position: 'top' },
              width: document.getElementById('tabid').getBoundingClientRect().width,
              height: 400,
              chartArea: {'width': '80%', 'height': '80%'}
            };
            var wrapperper = new google.visualization.ChartWrapper({
              chartType: 'LineChart',
              dataTable: data,
              options: options,
              containerId: 'linechart_material'
            });

            google.visualization.events.addListener(wrapperper, 'ready', function() {
                var indent = 18,
                texts = document.querySelectorAll('text'),
                formatter = new google.visualization.DateFormat({pattern: 'MMM'});

            function indentText(month) {
        for (var t=0;t<texts.length;t++) {
          if (texts[t].textContent == month) {
            texts[t].setAttribute('x', parseInt(texts[t].getAttribute('x'))+indent);
            return;
          }
        }
      }
      for (var i=0;i<dateTicks.length;i++) {
        indentText(formatter.formatValue(dateTicks[i]));
      }
    })
            wrapperper.draw();
          }
      } else {
        content.innerHTML = 'U heeft ' + featurelist.length + ' punten aangeklikt. Voor meer informatie zoom in en klik één punt aan.';
        overlay.setPosition(coordinate);
      }

    }
  }
})
});

map.addControl(geocoder);

function openTab(evt, Tabname) {
  var i;
  var tablinks;
  var x = document.getElementsByClassName("tabs");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" w3-blue", "");
}
  document.getElementById(Tabname).style.display = "block";
  evt.currentTarget.className += " w3-blue";
}
