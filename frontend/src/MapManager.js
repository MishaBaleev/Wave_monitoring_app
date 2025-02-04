import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

export class MapManager{
    constructor(){
        const token = "pk.eyJ1IjoiYmFsZWV2IiwiYSI6ImNsYXBqNmk4dTE5Y3UzcWxiYmt1bTJtcG8ifQ.aE8lRdfDnWq52szIP7gAHw"
        mapboxgl.accessToken = token
    }
    init(){
        console.log(1)
        this.map = new mapboxgl.Map({
            container: "map",
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [38.943917, 47.203948],
            zoom: 15,
            minZoom: 2
        })
        this.map.on("style.load", () => {
            let layers = this.map.getStyle().layers;
            let labelLayerId = layers.find(
                (layer) => layer.type === 'symbol' && layer.layout['text-field']
            ).id;

            this.map.addLayer(
                {
                    id: 'add-3d-buildings',
                    source: 'composite',
                    'source-layer': 'building',
                    filter: ['==', 'extrude', 'true'],
                    type: 'fill-extrusion',
                    minzoom: 2,
                    paint: {
                        'fill-extrusion-color': '#aaa',
                        'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': 0.6
                    }
                }, labelLayerId
            );
        })
    }
}