let coordenadas = {}

$(document).ready(function(){
    get_coordenadas();
    render_arrows();
})

function get_coordenadas(){
    console.log(window.location.search)
    var busca_params = new URLSearchParams(window.location.search)
    console.log(busca_params)
    if(busca_params.has('source') && busca_params.has('destino')){
        var source = busca_params.get('source');
        var destino = busca_params.get ('destino');
        //console.log(source, destino);
        coordenadas.source_lat = source.split(";")[0];
        coordenadas.source_lon = source.split(";")[1];
        coordenadas.destino_lat = destino.split(";")[0];
        coordenadas.destino_lon = destino.split(";")[1];
        console.log(coordenadas);
    }else{
        alert("¡No localizo tu rancho!")
        window.history.back();
        }
}

function render_arrows(){
    $.ajax({
        url:`https://api.mapbox.com/directions/v5/mapbox/driving/${coordenadas.source_lon}%2C${coordenadas.source_lat}%3B${coordenadas.destino_lon}%2C${coordenadas.destino_lat}?alternatives=true&geometries=polyline&steps=true&access_token=pk.eyJ1IjoiY2FseXBzc28wMSIsImEiOiJjbWFnMTdwd3owOHVtMmxweXh3bHlvdjAwIn0.cGGP7feYVXdukWUt1zBccw`,
        type:"get",
        success: function(response){
            console.log(response);
            var images = {
                "turn_right" : "ar_right.png",
                "turn_left" : "ar_left.png",
                "slight_right" : "ar_slight_right.png",
                "slight_left" : "ar_slight_left.png",
                "straight" : "ar_straight.png"
            }
            //guardas la ruta de la clave steps.
            var steps = response.routes[0].legs[0].steps;

            //recorrer la matriz STEPS para obtener la ruta de inicio a fin 
            for(var i = 0; i < steps.length; i++){
                var image;
                var distance= steps[i].distance;
                var instruction= steps[i].maneuver.instruction;
                
                //obtener la instrucción de cada paso
                if(instruction.includes("Turn right")){
                    image = "turn_right"

                }else if(instruction.includes("Turn left")){
                    image = "turn_left"

                }
                //utilizar .append() para agregar la imagen a la escena AR
                if(i>0){
                    $("#scene_container").append(
                        `<a-entity gps-entity-place="latitude: ${steps[i].maneuver.location[1]}; longitude: ${steps[i].maneuver.location[0]};">
                            <a-image name="${instruction}" src="./assets/${images[image]}" 
                                look-at="#step_${i - 1}"
                                scale="5 5 5"
                                id="step_${i}"
                                position="0 0 0"
                            >
                            </a-image>
                            <a-entity>
                                <a-text height="50" value="${instruction} (${distance}m)"></a-text>
                            </a-entity>
                        </a-entity>
                        `
                    )

                }else{
                    $("#scene_container").append(
                    `<a-entity gps-entity-place="latitude: ${steps[i].maneuver.location[1]}; longitude: ${steps[i].maneuver.location[0]};">
                        <a-image name="${instruction}"
                            src="./assets/ar_start.png"
                            look-at="#step_${i + 1}"
                            scale="5 5 5"
                            id="step_${i}"
                            position="0 0 0">
                        </a-image>
                        <a-entity>
                            <a-text height="50" value="${instruction} (${distance}m)"></a-text>
                        </a-entity>
                    </a-entity>
                    `
                    )
                }
            }
        }
    })
}