let latitude, longitude, destino; //Localización de la Ciudad de México19.622342, -99.237675

$(document).ready(function (){
    alert("Por favor, permite que el dispositivo acceda a tu ubicación")
    initGeolocation();
})

//enviar coordenadas de navegacion a la sig pagina por medio del boton NAVEGAR
$(function(){
    $("#navigate-button").click(function(){
        window.location.href = `ar_nav.html?source=${latitude};${longitude}&destino=${destino.lat};${destino.lng}`
    })
})

function initGeolocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(muestralo)
        console.log(muestralo)
    }else{
        alert("Lo sentimos, tu navegador no es compatible")
    }
}

function muestralo(position){
    console.log(position)
    longitude = position.coords.longitude;
    latitude = position.coords.latitude;

    //Inicializamos Mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FseXBzc28wMSIsImEiOiJjbWFnMTdwd3owOHVtMmxweXh3bHlvdjAwIn0.cGGP7feYVXdukWUt1zBccw';

    var map = new mapboxgl.Map({
    container : 'map',// sección donde se muestra el mapa
    style : 'mapbox://styles/mapbox/streets-v12',// estilo del mapa
    center: [longitude, latitude],// coordenadas del centro del mapa
    zoom:16 // nivel de zoom inicial  min 0 max 22
    });

    // añadir control de localización del ususario
    map.addControl(
        new mapboxgl.GeolocateControl({
         positionOptions:{
            enableHighAccuracy: true
         },
         trackUserLocation: true
        })
    );

    //añadir control de direccion de A a B
    map.addControl(
        new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            unit: 'metric',
            controls:{
                inputs: true,
                instructions: true,
                waypoints: true,
                geocoder: true
            }
        }),
        'top-left'
    );

    //función chismoso .on('click') para obtener lng y lat
    map.on('click', function(e){
        console.log(e);
        destino = e.lngLat
    })
}








