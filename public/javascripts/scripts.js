//Verschillende globale variabelen die later nodig zijn bij bepaalde functies

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var id;
var arrayData = [];
var numberarray = [];
// Initialize Firebase
var config = {
  apiKey: "AIzaSyCmeDbv8eGM8sPlpIGBiT6fxJJD-wujSBM",
  authDomain: "gppthermometer.firebaseapp.com",
  databaseURL: "https://gppthermometer.firebaseio.com",
  projectId: "gppthermometer",
  storageBucket: "",
  messagingSenderId: "639524050247"
};
firebase.initializeApp(config);
var database = firebase.database();
var ids = [];
var element;
var list;
var entry;
var dataString = [];
var features = [];
var isshow = localStorage.getItem('isshow');

//Deze functie zorgt ervoor dat de website ook in IE werkt. Het is een polyfill van includes. Wel wordt het afgeraden om IE te gebruiken, omdat de website niet
//optimaal werkt in IE.

if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;
      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }
      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;
      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        // c. Increase k by 1.
        // NOTE: === provides the correct "SameValueZero" comparison needed here.
        if (o[k] === searchElement) {
          return true;
        }
        k++;
      }
      // 8. Return false
      return false;
    }
  });
}

//Deze functie kijkt met welke browser de website wordt geopend en laat de niet supported pagina zien als dit een browser is die niet ondersteund wordt.
//De browsers die niet ondersteund worden zijn Internet Explorer elke versie, Safari elke versie en Alle versies van mobiele browsers.

/*function detectIE() {
var ua = window.navigator.userAgent;
var msie = ua.indexOf('MSIE ');
if (msie > 0) {
  // IE 10 of ouder
  window.location = "unsupportedbrowser.html";
  return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
}
var trident = ua.indexOf('Trident/');
if (trident > 0) {
  // IE 11
  var rv = ua.indexOf('rv:');
  window.location = "unsupportedbrowser.html";
  return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
}
//Safari
if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
  window.location = "unsupportedbrowser.html";
}
//andere browsers
return false;
}*/

//Hier wordt er door de gebruiker uitgelogd of ingelogd als er nog geen gebruiker is ingelogd

function logOut() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut().then(function() {
      window.location = "/";
    }).catch(function(error) {
    });
  } else {
    window.location = "login.html";
  }
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user && user.emailVerified == true) {
    document.getElementById("displayName").innerHTML = "Welkom " + user.displayName;
  } else {
    document.getElementById("Logoutbutton").textContent = "Inloggen"
  }
});

//In deze functie wordt er een cookie aangemaakt met een unieke token die gelinkt staat aan de gebruiker. Als er een punt wordt gekocht wordt dit cookie
//meegstuurd om op de backend te kunnen checken welke gebruiker het is.

function betaalLink() {
  var x = document.getElementById("snackbar");
  firebase.auth().onAuthStateChanged(function(user) {
    firebase.auth().currentUser.getIdToken( /* forceRefresh */ true).then(function(idToken) {
      var cookie = document.cookie = "idToken=" + idToken;
      if (typeof ids !== 'undefined' && ids.length > 0) {
        location.href = "create?description=" + ids;
      } else {
        x.innerHTML = "Er zitten geen punten in de winkelwagen";
        x.className = "show";
        setTimeout(function() {
          x.className = x.className.replace("show", "");
        }, 2500);
        return;
      }
    });
  });
}

//Deze functie wordt aangeroepen als de winkelwagen wordt geopend er wordt dan per item dat in de winkelwagen zit een span element gemaakt met een id. Ook wordt
//de sessie leeg gehaald als de punten die in de winkelwagen zaten zijn gekocht.

function openwagen(span) {
  var i;
  for (i=0;i<ids.length;i++){
  if (numberarray.includes(ids[i])) {
    sessionStorage.clear();
    ids = [];
    $('#ids').load(document.URL +  ' #ids');
    document.getElementById("totaalbedrag").innerHTML = "€ 0";
  }
}
  document.getElementById('modal').style.display = 'block';
  list = document.getElementById('ids');
  ids.forEach(function(entry) {
    element = document.createElement('span');
    element.setAttribute("id", "" + list.children.length);
    element.innerHTML = entry + " " + "<button class='w3-button w3-small w3-ripple w3-hover-none w3-hover-text-red' style='padding:inherit; vertical-align: text-top;' onclick='removeItem(this)'>&times;</button>" + "<br>";
    document.getElementById("ids").appendChild(element);
  });
}

//Deze functie wordt aangeroepen als er een item uit de winkelwagen wordt verwijderd. De array met punten die in de wagen zitten wordt opgehaald en het geselecteerd
//punt wordt uit de array en de wagen verwijderd. Hierna wordt de open en close wagen functies nog een keer aangeroepen om de winkelwagen te updaten.

function removeItem(span) {
  var pp = span.parentNode.parentNode;
  var p = span.parentNode;
  var position = p.getAttribute('id');
  var retrieveArray = sessionStorage.id;
  var arr = retrieveArray.split(",");
  pp.removeChild(p);
  ids.splice(position, 1);
  arr.splice(position, 1);
  sessionStorage.setItem('id', arr);
  closewagen();
  openwagen();
  if (typeof ids !== 'undefined' && ids.length > 0) {
    document.getElementById("totaalbedrag").innerHTML = "€ " + 20 * ids.length;
  } else {
    document.getElementById("totaalbedrag").innerHTML = "€ 0";
  }
}

//Deze functie sluit de winkelwagen

function closewagen() {
  document.getElementById('modal').style.display = 'none'
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }
}

//In deze functie wordt er een punt toegevoegd aan de array en de session zodat je de punten in de winkelwagen behoudt als je naar een andere pagina gaat.
//Er worden meldingen gegeven aan de gebruiker als er een punt wordt toegevoegd of er al in zit.

function toevoegen() {
  var x = document.getElementById("snackbar");
  if (!ids.includes(id)) {
    ids.push(id);
    sessionStorage.setItem('id', ids);
    if (typeof ids !== 'undefined' && ids.length > 0) {
      document.getElementById("totaalbedrag").innerHTML = "€ " + 20 * ids.length;
    } else {
      document.getElementById("totaalbedrag").innerHTML = "€ 0";
    }
    x.innerHTML = "Punt is toegevoegd aan de winkelwagen";
    x.className = "show";
    setTimeout(function() {
      x.className = x.className.replace("show", "");
    }, 2500);
    return;
  } else {
    x.innerHTML = "Punt zit al in de winkelwagen";
    x.className = "show";
    setTimeout(function() {
      x.className = x.className.replace("show", "");
    }, 2500);
    return;
  }
}

//In deze functie wordt er uit de database opgehaald welke punten de gebruiker die is ingelogd heeft gekocht. Deze punten worden in een array gezet en
//deze array wordt aangepast zodat hij makkelijk uit te lezen is.

firebase.auth().onAuthStateChanged(function(user) {
  if (firebase.auth().currentUser) {
    var userId = firebase.auth().currentUser.uid;

    firebase.database().ref('/users/' + userId + "/payments/").once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnapShot) {
        childkey = childSnapShot.key;
        childData = childSnapShot.val();
        jsonData = JSON.stringify(childData);
        popString = jsonData.split("PuntID").pop();
        dataString = popString.slice(3, -23);
        arrayData.push(dataString);
        numberarray.push(Number(dataString));
      });
    });
  }
});

//In deze functie wordt er gekeken wat de tijd nu is en worden de punten die meer dan een jaar geleden gekocht zijn verwijderd uit de database.

firebase.auth().onAuthStateChanged(function(user) {
  if (firebase.auth().currentUser) {
    var userId = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref('/users/' + userId + "/payments/");
    var now = Date.now();
    var cutoff = now - 365.2425 * 24 * 60 * 60 * 1000; // Een jaar is precies 365,2425 dagen lang https://en.wikipedia.org/wiki/Year
    var old = ref.orderByChild('Time').endAt(cutoff).limitToLast(1);
    var listener = old.on('child_added', function(snapshot) {
      snapshot.ref.remove();
    });
  }
});

//Dit is de hoofdfunctie van de site deze functie haalt doormiddel van ajax de data op van de database en leest deze data uit. De uitgelezen data wordt
//aan features gelinkt die op de kaart gezet gaan worden. Zo heeft elke feature zijn eigen coordinaten en data.

$.ajax({
  url: 'https://raw.githubusercontent.com/Meesgieling/GPP-Thermometer/master/data.json?token=ALZ4i1rNBnRGyq5Uk3a4b_G6fAFlh8Lfks5bK28jwA%3D%3D', //http://172.16.29.41:8080/geoserver/geluidregister/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geluidregister:c207_geluidproductieplafonds&maxFeatures=61000&outputFormat=application%2Fjson
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

//Deze functie wordt aangeroepen als er op een punt aan de rand van de kaart geklikt wordt waardoor de popup niet volledig te zien is dan zoomt deze
//functie naar de popup toe.

var overlay = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 1
  }
});

//Deze functie komt van de Geocoder plugin die gebruikt wordt om een zoek functie in de kaart te zetten. De variabelen zijn aangepast zodat de plugin goed
// past bij de website.

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

//In deze functie wordt er een vector gemaakt van alle features die er zijn ingeladen

var source = new ol.source.Vector({
  features: features
});

//In deze functie worden de punten uit de vector geclusterd als ze binnen de distance van elkaar liggen.

var clusterSource = new ol.source.Cluster({
  distance: 6,
  source: source
});

//In deze functie wordt er een Open Street Map gemaakt waarop de punten worden laten zien.

var raster = new ol.layer.Tile({
  source: new ol.source.OSM({
  })
});

//In deze functie wordt de opmaak van de punten bepaald. Als een punt in een cluster zit of als een punt niet in een cluster zit en niet is gekocht
//wordt het punt blauw gemaakt. Als een punt wel is gekocht wordt er gekeken naar de geluidruimte om te kijken welke kleur het punt moet worden gemaakt. Ook
//wordt er gekeken of een punt in de winkelwagen zit en wordt de kleur aangepast als dat zo is.

var styleCache = {};
var clusters = new ol.layer.Vector({
  source: clusterSource,
  style: function(feature) {
    var size = feature.get('features').length;
    var featurelist = feature.N.features;
    if (featurelist.length > 0) {
      for (var i = 0, ii = featurelist.length; i < ii; ++i) {
        var id = featurelist[i].N.id;
        var geluidruimte = featurelist[i].N.geluidruimte;
      }
    }
    var style = styleCache[size];
    if (size == 1 && arrayData.includes(JSON.stringify(id)) == true) {
      //GROEN
      if (geluidruimte > 0.5) {
        style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 10,
            stroke: new ol.style.Stroke({
              color: '#fff'
            }),
            fill: new ol.style.Fill({
              color: 'green'
            })
          }),
          text: new ol.style.Text({
            text: geluidruimte.toString(),
            fill: new ol.style.Fill({
              color: '#fff'
            }),
            font: '9px sans-serif'
          })
        });
        styleCache[size] = style;
      }
      //GEEL
      if (geluidruimte > 0 && geluidruimte < 0.5) {
        style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 10,
            stroke: new ol.style.Stroke({
              color: '#fff'
            }),
            fill: new ol.style.Fill({
              color: 'yellow'
            })
          }),
          text: new ol.style.Text({
            text: geluidruimte.toString(),
            fill: new ol.style.Fill({
              color: '#fff'
            })
          })
        });
        styleCache[size] = style;
      }
      //ROOD
      if (geluidruimte < 0) {
        style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 10,
            stroke: new ol.style.Stroke({
              color: '#fff'
            }),
            fill: new ol.style.Fill({
              color: 'red'
            })
          }),
          text: new ol.style.Text({
            text: geluidruimte.toString(),
            fill: new ol.style.Fill({
              color: '#fff'
            })
          })
        });
        styleCache[size] = style;
      }
    } else if(size == 1 && ids.includes(id)){
      style = (new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          stroke: new ol.style.Stroke({
            color: '#fff'
          }),
          fill: new ol.style.Fill({
            color: 'orange'
          })
        })
      }));
    }
    else {
      //BLAUW
      style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          stroke: new ol.style.Stroke({
            color: '#fff'
          }),
          fill: new ol.style.Fill({
            color: '#3f51b5'
          })
        })
      });
      styleCache[size] = style;
    }
    return style;
  }
});

//In deze functie wordt de map gemaakt met de OSM map en de clusters van de punten erop ook wordt er een center, zoom, minzoom en maxzoom geset.

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

//Dit is een erg lange functie waarin op een klik wordt gekeken waar er op de kaart is geklikt als dit op een punt is die niet geclusterd is wordt alle data
//van dit punt opgehaald en weergeven in het informatie vakje aan de rechterkant van de website. Als er niet voor dit punt betaald is wordt er neppe data laten zien
//als er wel betaald is wordt de echte data laten zien.

map.on('singleclick', function(evt) {
  overlay.setPosition(undefined);
  map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
    var coordinate = evt.coordinate;
    var featurelist = feature.N.features;
    //Hier wordt de data van het geselecteerd punt opgehaald
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
          //Hier komt de echte data als er betaald is voor een punt
          if (arrayData.includes(JSON.stringify(id))) {
            var voorbeeld = document.getElementById("voorbeeld");
            voorbeeld.style.display = "none";
            document.getElementById("id").innerHTML = id;

            document.getElementById("artikel").innerHTML = artikel;
            document.getElementById("Xcoordinaat").innerHTML = Xcoordinaat;
            document.getElementById("Ycoordinaat").innerHTML = Ycoordinaat;
            document.getElementById("Zcoordinaat").innerHTML = Zcoordinaat + " m";
            document.getElementById("gpp").innerHTML = gpp + " dB";
            if (!recent_bes) {
              document.getElementById("recent_bes").innerHTML = "--";
            } else {
              document.getElementById("recent_bes").innerHTML = '<a href="http://www.rijkswaterstaat.nl/apps/geoservices/rwsnl/download//geluidsregister/' + recent_bes + '" target="_blank">' + recent_bes.replace('besluiten/', '') + '</a>';
            }
            if (artikel == '11.45 lid 1') {
              document.getElementById("pcw").innerHTML = "1.50 dB"
            } else {
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

            if (!laatste_meting) {
              document.getElementById("laatste_meting").innerHTML = "--";
            } else {
              datumString2 = laatste_meting;
              var meetDatum = new Date(datumString2.substr(0, 4), parseInt(datumString2.substr(5, 2)) - 1, datumString2.substr(8, 2));
              meetDatumString = meetDatum.toLocaleDateString();
              document.getElementById("laatste_meting").innerHTML = meetDatumString;
            }
            //Hier wordt er gekeken naar de datum wanneer het punt is gekocht en wordt dit getoond
            firebase.auth().onAuthStateChanged(function(user) {
              if (firebase.auth().currentUser) {
                var userId = firebase.auth().currentUser.uid;

                firebase.database().ref('/users/' + userId + "/payments/").once('value').then(function(snapshot) {
                  snapshot.forEach(function(childSnapShot) {
                    childkey = childSnapShot.key;
                    childData = childSnapShot.val();
                    jsonData = JSON.stringify(childData);
                    popString = jsonData.split("PuntID").pop();
                    dataString = popString.slice(3, -23);
                    arrayData.push(dataString);
                    popString = jsonData.split("Time").pop();
                    datumstring = popString.slice(2, -1);
                    arrayData.push(datumstring);
                    if (dataString == id) {
                      d = new Date(datumstring * 1);
                      document.getElementById("datumaankoop").innerHTML = d.toLocaleDateString();
                      var vervald = new Date(Number(d) + 365.2425 * 24 * 60 * 60 * 1000);
                      document.getElementById("vervaldatum").innerHTML = vervald.toLocaleDateString();
                    }
                  });
                });
              }
            });
            //Hier wordt het juiste tabje blauw gemaakt
            var i;
            var tablinks;
            var x = document.getElementsByClassName("tabs");
            for (i = 0; i < x.length; i++) {
              x[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablink");
            for (i = 0; i < x.length; i++) {
              tablinks[i].className = tablinks[i].className.replace(" w3-indigo", "");
            }
            document.getElementById("Geluid").style.display = "block";
            document.getElementById("Geluidbutton").className += " w3-indigo";

            var dagen = [];
            var hekje = '#';
            var aapje = '@';
            var streepje = '-';

            var percentages = [];
            //Dit is de berekening voor het verloop van de geluidproductie van een punt
            for (var c = 1; c <= parseInt(dagen_totaal); c++) {
              percentageArray = alle_percentages.split(hekje);
              dagpercentage = percentageArray[c - 1].split(aapje);
              gppper = dagpercentage[1];
              voorspelddb = (10 * Math.log(((c * 1.0) / (parseInt(aantal_dagen) * 1.0)) * (Math.pow(10, (parseFloat(gpp_realtime) / 10)))) / Math.log(10)).toFixed(2);
              voorspeldper = (Math.pow(10, (parseFloat(voorspelddb) / 10)) / Math.pow(10, (parseFloat(gpp) / 10)) * 100).toFixed(2);
              if (parseFloat(gppper) == -1) {
                voorspeldper = voorspeldper;
              }
              if (parseFloat(gppper) != -1) {
                voorspeldper = null;
              }
              if (parseFloat(gppper) == -1) {
                gppper = null;
              }
              if (parseFloat(gppper) != -1) {
                gppper = gppper;
              }
              var gppperdatum = dagpercentage[0];
              var gppperdatumArray = gppperdatum.split(streepje);
              var gppperjaar = gppperdatumArray[0];
              var gpppermaand = gppperdatumArray[1];
              var gppperdag = gppperdatumArray[2];
              percentages.push([new Date(parseInt(gppperjaar), parseInt(gpppermaand) - 1, parseInt(gppperdag)), parseFloat(gppper), 100, parseFloat(voorspeldper)]);
            }

            google.charts.load('current');
            google.charts.setOnLoadCallback(drawChart);
            //Deze functie maakt de Google Chart die wordt laten zien als er op een punt wordt geclickt die is betaald.
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
              dateTicks.push(new Date(parseInt(gppperjaar), 0, 1));
              dateTicks.push(new Date(parseInt(gppperjaar), 1, 1));
              dateTicks.push(new Date(parseInt(gppperjaar), 2, 1));
              dateTicks.push(new Date(parseInt(gppperjaar), 3, 1));
              dateTicks.push(new Date(parseInt(gppperjaar), 4, 1));
              dateTicks.push(new Date(parseInt(gppperjaar), 5, 1));
              dateTicks.push(new Date(parseInt(gppperjaar), 6, 1));
              dateTicks.push(new Date(parseInt(gppperjaar), 7, 1));
              dateTicks.push(new Date(parseInt(gppperjaar), 8, 1));
              dateTicks.push(new Date(parseInt(gppperjaar), 9, 1));
              dateTicks.push(new Date(parseInt(gppperjaar), 10, 1));
              dateTicks.push(new Date(parseInt(gppperjaar), 11, 1));

              var options = {
                title: 'GPP Realtime Percentage',
                series: {
                  2: {
                    lineDashStyle: [2, 2],
                    color: '64B8F8'
                  }
                },
                vAxis: {
                  title: '%',
                  ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                  viewWindow: {
                    max: 100,
                    min: 0
                  }
                },
                hAxis: {
                  title: 'Maand',
                  format: 'MMM',
                  ticks: dateTicks,
                  gridlines: {
                    count: 12
                  }
                },
                legend: {
                  position: 'top'
                },
                width: document.getElementById('tabid').getBoundingClientRect().width,
                height: 400,
                chartArea: {
                  'width': '80%',
                  'height': '80%'
                }
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
                  formatter = new google.visualization.DateFormat({
                    pattern: 'MMM'
                  });

                function indentText(month) {
                  for (var t = 0; t < texts.length; t++) {
                    if (texts[t].textContent == month) {
                      texts[t].setAttribute('x', parseInt(texts[t].getAttribute('x')) + indent);
                      return;
                    }
                  }
                }
                for (var i = 0; i < dateTicks.length; i++) {
                  indentText(formatter.formatValue(dateTicks[i]));
                }
              })
              wrapperper.draw();
              //Hier wordt de popup gemaakt als je op een punt klikt die is betaald
              var x = document.getElementById("popup");
              x.style.minWidth = "200px";
              content.innerHTML = 'U bent geabonneerd op dit punt'
              overlay.setPosition(coordinate);
            }
            //Dit is de voorbeeld data als er nog niet is betaald
          } else {
            var voorbeeld = document.getElementById("voorbeeld");
            voorbeeld.style.display = "block";
            document.getElementById("id").innerHTML = id;
            document.getElementById("artikel").innerHTML = artikel;
            document.getElementById("Xcoordinaat").innerHTML = Xcoordinaat;
            document.getElementById("Ycoordinaat").innerHTML = Ycoordinaat;
            document.getElementById("Zcoordinaat").innerHTML = Zcoordinaat + " m";
            document.getElementById("gpp").innerHTML = "60 dB";
            if (!recent_bes) {
              document.getElementById("recent_bes").innerHTML = "--";
            } else {
              document.getElementById("recent_bes").innerHTML = '<a href="http://www.rijkswaterstaat.nl/apps/geoservices/rwsnl/download//geluidsregister/' + recent_bes + '" target="_blank">' + recent_bes.replace('besluiten/', '') + '</a>';
            }
            if (artikel == '11.45 lid 1') {
              document.getElementById("pcw").innerHTML = "1.50 dB"
            } else {
              document.getElementById("pcw").innerHTML = "0.00 dB"
            }

            document.getElementById("gpp_realtime").innerHTML = "61 dB";
            document.getElementById("geluidruimte").innerHTML = "3 dB";
            document.getElementById("gpp_vrsp").innerHTML = "58 dB";
            document.getElementById("percentage_fout").innerHTML = "1.04 %";

            datumString = beg_dat;
            var beginDatum = new Date(datumString.substr(0, 4), parseInt(datumString.substr(5, 2)) - 1, datumString.substr(8, 2));
            beginDatumString = beginDatum.toLocaleDateString();

            document.getElementById("beg_dat").innerHTML = beginDatumString;

            document.getElementById("laatste_meting").innerHTML = "01-01-2019";
            document.getElementById("datumaankoop").innerHTML = "--";
            document.getElementById("vervaldatum").innerHTML = "--";

            var i;
            var tablinks;
            var x = document.getElementsByClassName("tabs");
            for (i = 0; i < x.length; i++) {
              x[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablink");
            for (i = 0; i < x.length; i++) {
              tablinks[i].className = tablinks[i].className.replace(" w3-indigo", "");
            }
            document.getElementById("Geluid").style.display = "block";
            document.getElementById("Geluidbutton").className += " w3-indigo";

            google.charts.load('current', {
              'packages': ['corechart']
            });
            google.charts.setOnLoadCallback(drawChart);
            //Deze Google Charts is simpeler omdat er geen berekeningen gedaan hoeven te worden.
            function drawChart() {

              var data = new google.visualization.DataTable();
              data.addColumn('date', 'dag');
              data.addColumn('number', 'Realtime');
              data.addColumn('number', 'GPP');
              data.addColumn('number', 'Voorspelling');
              data.addRows([
                [new Date(2018, 0, 1), 1, 100, null],
                [new Date(2018, 1, 6), 10, 100, null],
                [new Date(2018, 2, 3), 20, 100, null],
                [new Date(2018, 3, 21), 30, 100, null],
                [new Date(2018, 4, 7), 40, 100, null],
                [new Date(2018, 5, 8), 50, 100, null],
                [new Date(2018, 6, 3), 60, 100, null],
                [new Date(2018, 7, 15), 70, 100, 70],
                [new Date(2018, 8, 28), null, 100, 80],
                [new Date(2018, 9, 17), null, 100, 86],
                [new Date(2018, 10, 6), null, 100, 94],
                [new Date(2018, 11, 18), null, 100, 100],
              ]);

              var options = {
                title: 'GPP Realtime Percentage',
                series: {
                  2: {
                    lineDashStyle: [2, 2],
                    color: '64B8F8'
                  }
                },
                vAxis: {
                  title: '%',
                  ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                  viewWindow: {
                    max: 100,
                    min: 0
                  }
                },
                hAxis: {
                  title: 'Maand',
                  format: 'MMM',
                  gridlines: {
                    count: 12
                  }
                },
                legend: {
                  position: 'top'
                },
                width: document.getElementById('tabid').getBoundingClientRect().width,
                height: 400,
                chartArea: {
                  'width': '80%',
                  'height': '80%'
                }
              };

              var chart = new google.visualization.LineChart(document.getElementById('linechart_material'));

              chart.draw(data, options);
              overlay.setPosition(coordinate);

            }
            //Hier wordt de text en de knop van de popups gezet afhankelijk of er een gebruiker is ingelogd of niet, ook wordt de knop in de winkelwagen aangepast
            //van registreren naar betalen als er een gebruiker is ingelogd.
            if (firebase.auth().currentUser) {
              var x = document.getElementById("popup");
              x.style.minWidth = "0px";
              content.innerHTML = '<button class="w3-btn w3-ripple w3-indigo" onclick="toevoegen()" style="border-radius: 10px;">Toevoegen aan winkelwagen</button>';

              var y = document.getElementById("buybutton");
              y.innerHTML = '<button style="border-radius: 10px; float:right; margin-right:16px" class="w3-btn w3-ripple w3-indigo" onclick="betaalLink()">Kopen</button>';
            } else {
              var x = document.getElementById("popup");
              x.style.minWidth = "0px";
              content.innerHTML = '<button class="w3-btn w3-ripple w3-indigo" onclick="toevoegen()" style="border-radius: 10px;">Toevoegen aan winkelwagen</button>';

              var y = document.getElementById("buybutton");
              y.innerHTML = '<button style="border-radius: 10px; float:right; margin-right:16px" class="w3-btn w3-ripple w3-indigo" onclick="GotoRegister()">Registreren</button>';
            }
          }
          //Hier wordt de rechterkant van de pagina op klikbaar en opacity van 1 gezet als er op een punt is geklikt.
          var overlap = document.getElementById("overlap");
          var Locatie = document.getElementById("Locatie");
          var Wetgeving = document.getElementById("Wetgeving");
          var Geluid = document.getElementById("Geluid");
          var bar = document.getElementById("bar");
          overlap.style.display = "none";
          Geluid.style.opacity = 1;
          bar.style.opacity = 1;
          Locatie.style.opacity = 1;
          Wetgeving.style.opacity = 1;
          Geluid.style.pointerEvents = "auto";
          bar.style.pointerEvents = "auto";
          Locatie.style.pointerEvents = "auto";
          Wetgeving.style.pointerEvents = "auto";
        } else {
          //Als er op meer dan 1 punt wordt geklikt wordt dit laten zien.
          var x = document.getElementById("popup");
          x.style.minWidth = "200px";
          content.innerHTML = 'U heeft ' + featurelist.length + ' punten aangeklikt. Voor meer informatie zoom in en klik één punt aan.';
          overlay.setPosition(coordinate);
        }

      }
    }
  })
});

map.addControl(geocoder);

//In deze functie wordt de juiste tab geopend en de anderen afgesloten als er van tab wordt geswitched.

function openTab(evt, Tabname) {
  var i;
  var tablinks;
  var x = document.getElementsByClassName("tabs");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" w3-indigo", "");
  }
  document.getElementById(Tabname).style.display = "block";
  evt.currentTarget.className += " w3-indigo";
}

//Deze functie checkt wanneer de pagina volledig is geladen.

document.onreadystatechange = function(e) {
  if (document.readyState == "interactive") {
    var all = document.getElementsByTagName("*");
    for (var i = 0, max = all.length; i < max; i++) {
      set_ele(all[i]);
    }
  }
}

//Deze functie kijkt of de pagina helemaal is geladen en laad een laadbalk zien totdat de pagina volledig is geladen.

function check_element(ele) {
  var all = document.getElementsByTagName("*");
  var totalele = all.length;
  var per_inc = 100 / all.length;

  if ($(ele).on()) {
    var prog_width = per_inc + Number(document.getElementById("progress_width").value);
    document.getElementById("progress_width").value = prog_width;
    $("#bar1").animate({
      width: prog_width + "%"
    }, 10, function() {
      if (document.getElementById("bar1").style.width == "100%") {
        $(".progress").fadeOut("slow");
      }
    });
  } else {
    set_ele(ele);
  }
}

function set_ele(set_element) {
  check_element(set_element);
}

function GotoRegister() {
  window.location = "register.html";
}

//Deze functie wordt aangeroepen als de pagina wordt geladen. Eerst wordt de sessie verwijderd als er van de execute pagina afkomt omdat er dan betaald
//is voor de punten die in de winkelwagen zaten. Als de sessie niet wordt verwijderd worden de punten weer in de winkelwagen gezet. Ook wordt er gekeken
//of de gebruiker is ingelogd en wordt aan de hand daarvan bepaalde of er een registeer of betaal knop moet komen in de winkelwagen

window.onload = function() {
  //detectIE();
  var puntenids = sessionStorage.getItem('id');
  if(puntenids != null){
  var split = puntenids.split(",");
  }
  if (puntenids == ""){
   return;
  }
  if (typeof split !== 'undefined' && split.length > 0) {
    var i;
    for (i = 0; i < split.length; i++) {
      var number = parseInt(split[i]);
        ids.push(number);
    }
  }
  if (typeof ids !== 'undefined' && ids.length > 0) {
    document.getElementById("totaalbedrag").innerHTML = "€ " + 20 * ids.length;
  } else {
    document.getElementById("totaalbedrag").innerHTML = "€ 0";
  }
  firebase.auth().onAuthStateChanged(function(user) {
    if (firebase.auth().currentUser) {
      var y = document.getElementById("buybutton");
      y.innerHTML = '<button style="border-radius: 10px; float:right; margin-right:16px" class="w3-btn w3-ripple w3-indigo" onclick="betaalLink()">Kopen</button>';
    } else {
      var y = document.getElementById("buybutton");
      y.innerHTML = '<button style="border-radius: 10px; float:right; margin-right:16px" class="w3-btn w3-ripple w3-indigo" onclick="GotoRegister()">Registreren</button>';
    }
  });
}

//Hier wordt er gekeken of de gebruiker al eerder op de website is geweest. Als dat niet zo is wordt er een informatie veld laten zien.

function Overinfo(){
    if (isshow== null) {
        localStorage.setItem('isshow', 1);
        // Show popup here
        $('#overinfoid').hide();
        $('#tabid').show();
    }
}
if(isshow == 1){
  $('#overinfoid').hide();
  $('#tabid').show();
}
