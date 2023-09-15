//MAPA:
// cordenadas de los ANGELES. google maps y clik derecho y copiar coordenadas.

var latitud = 34.064541037456436;
var longitud = -118.31563894120258;
var zoom = 14;

var map = L.map('map').setView([latitud, longitud], zoom);


const MAPBOX_API = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'

const ATTRIBUTION =
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';


const ACCESS_TOKEN =
    'pk.eyJ1IjoiY2Nhc3RpbGxvMDZtYiIsImEiOiJja2k1eXpybXU3em1mMnRsNjNqajJ0YW12In0.aFQJlFDBDQeUpLHT4EiRYg';


L.tileLayer(MAPBOX_API, {
    attribution: ATTRIBUTION,
    maxZoom: 18,
    id: 'mapbox/navigation-day-v1', 
    tileSize: 512,
    zoomOffset: -1,
    accessToken: ACCESS_TOKEN
}).addTo(map);

var metroIcon = L.icon({
    iconUrl: "../Assets/tren-electrico.png",
    //shadowUrl: 'leaf-shadow.png',
    iconSize: [15, 15], // size of the icon
});


var busesIcon = L.icon({
    iconUrl: "../Assets/autobus-escolar.png",
    //shadowUrl: 'leaf-shadow.png',
    iconSize: [15, 15], // size of the icon
    
});


async function getMetro() {
    const respuestaMetro = await fetch("https://api.metro.net/LACMTA_Rail/vehicle_positions/all?geojson=false")
    const dataMetro = await respuestaMetro.json();

    const arrayMetros = []
    for (let i = 0; i < dataMetro.length; i++) {
        let posicionVehiculo = {
            latitud: dataMetro[i].position.latitude,
            longitud: dataMetro[i].position.longitude,
            id: dataMetro[i].vehicle.vehicle_id
        }
        arrayMetros.push(posicionVehiculo)
    }

    return arrayMetros;

}

async function getBus() {

    const respuestaBus = await fetch("https://api.metro.net/LACMTA/vehicle_positions/all?geojson=false")
    const dataBus = await respuestaBus.json();

    const arrayBuses = []
    for (let i = 0; i < dataBus.length; i++) {
        let posicionVehiculo = {
            latitud: dataBus[i].position.latitude,
            longitud: dataBus[i].position.longitude,
            id: dataBus[i].vehicle.vehicle_id
        }
        arrayBuses.push(posicionVehiculo)
    }

    return arrayBuses;
}


// OPCION A


let markers = [];

setInterval(() => {
  // Obtiene los datos de metro y autobús
  Promise.all([getMetro(), getBus()]).then((value) => {
    // Elimina todos los marcadores del mapa
    for (let i = 0; i < markers.length; i++) {
      map.removeLayer(markers[i]);
    }
    markers = []; // vacía la matriz de marcadores

    // Agrega los nuevos marcadores al mapa
    for (let i = 0; i < value.length; i++) {
      console.log(value);
      for (let j = 0; j < value[i].length; j++) {
        let marker;
        if (i === 0) {
          marker = L.marker([value[i][j].latitud, value[i][j].longitud], { icon: metroIcon }).addTo(map);
        } else {
          marker = L.marker([value[i][j].latitud, value[i][j].longitud], { icon: busesIcon }).addTo(map);
        }
        marker.bindPopup(`${value[i][j].id}`);
        markers.push(marker); // agrega el marcador a la matriz
      }
    }
  });
}, 10000);
