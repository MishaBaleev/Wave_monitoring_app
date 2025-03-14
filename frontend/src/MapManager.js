import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

export class MapManager{
    constructor(addMissionElement, deleteMissionElement, updateMissionElement, clearMissionSlice){
        const token = "pk.eyJ1IjoiYmFsZWV2IiwiYSI6ImNsYXBqNmk4dTE5Y3UzcWxiYmt1bTJtcG8ifQ.aE8lRdfDnWq52szIP7gAHw"
        mapboxgl.accessToken = token
        this.map = null
        this.uav = null 
        this.mission_markers = []
        this.last_index = 0
        this.addMissionElement = addMissionElement
        this.deleteMissionElement = deleteMissionElement
        this.updateMissionElement = updateMissionElement
        this.clearMissionSlice = clearMissionSlice

        this.addMissionPoint = this.addMissionPoint.bind(this)
        this.updateRoute = this.updateRoute.bind(this)
        this.deleteElement = this.deleteElement.bind(this)
        this.showRoute = this.showRoute.bind(this)
        this.setUAVCoords = this.setUAVCoords.bind(this)
        this.showMission = this.showMission.bind(this)
        this.clearMission = this.clearMission.bind(this)
    }
    init(){
        this.map = new mapboxgl.Map({
            container: "map",
            style: 'mapbox://styles/mapbox/outdoors-v12',
            // style: "mapbox://styles/mapbox/streets-v11",
            center: [8.548180419357262, 47.39866486639688],
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
        this.map.on("click", (e) => {this.addMissionPoint(e.lngLat)})
    }
    addMissionPoint(coords){
        let marker = new mapboxgl.Marker({color: "#4C7DB0", draggable: true}).setLngLat([coords.lng, coords.lat]).addTo(this.map)
        marker.id = this.last_index
        marker.on("drag", (e) => {
            this.updateRoute()
        })
        marker.on("dragend", (e) => {
            let coords = e.target.getLngLat()
            this.updateMissionElement({id: marker.id, type: "coords", value: [coords.lng, coords.lat]})
        })
        let marker_index = document.createElement("span")
        marker_index.classList.add("marker_index")
        marker_index.textContent = this.last_index+1
        this.last_index++
        marker.getElement().append(marker_index)
        this.mission_markers.push(marker)
        let mission_markers_coords = this.mission_markers.map(marker => {return [marker.getLngLat().lng, marker.getLngLat().lat]})
        this.showRoute(mission_markers_coords)
        this.addMissionElement({id: marker.id, coords: [marker.getLngLat().lng, marker.getLngLat().lat]})
    }
    updateRoute(){
        let new_coords = this.mission_markers.map(marker => {return [marker.getLngLat().lng, marker.getLngLat().lat]})
        // new_coords.unshift([this.uav.getLngLat().lng, this.uav.getLngLat().lat])
        let geojson_obj = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": new_coords
                    }
                }
            ]
        }
        this.map.getSource("mission_line_source").setData(geojson_obj)
    }
    deleteElement(id){
        let new_markers = []
        this.mission_markers.forEach(marker => {
            if (marker.id !== id){new_markers.push(marker)}
            else{marker.remove()}
        })
        this.mission_markers = [...new_markers]
        let mission_markers_coords = this.mission_markers.map(marker => {return [marker.getLngLat().lng, marker.getLngLat().lat]})
        this.showRoute(mission_markers_coords)
    }
    showRoute(coords){
        if (this.map.getLayer("mission_line_layer")){
            this.map.removeLayer("mission_line_layer")
            this.map.removeSource("mission_line_source")
        }
        // coords.unshift([this.uav.getLngLat().lng, this.uav.getLngLat().lat])
        this.map.addSource('mission_line_source', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': coords
                }
            }
        })
        this.map.addLayer({
            'id': 'mission_line_layer',
            'type': 'line',
            'source': 'mission_line_source',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#02d402',
                'line-width': 8
            }
        })
    }
    setUAVCoords(coords, yaw_angle){
        if (this.uav === null){ //show uav
            const el = document.createElement('div')
            el.className = 'drone';
            this.uav = new mapboxgl.Marker(el, {offset: [-2, 11]}).setLngLat(coords).addTo(this.map)
            this.map.flyTo({center: coords})

        }else{//update uav position
            this.uav.setLngLat(coords)
            this.uav.setRotation(yaw_angle)
        }
    }
    showMission(waypoints){
        this.clearMission()
        waypoints.forEach(point => {
            let marker = new mapboxgl.Marker({color: "#4C7DB0", draggable: true}).setLngLat([point.x, point.y]).addTo(this.map)
            marker.id = this.last_index
            marker.on("drag", (e) => {
                this.updateRoute()
            })
            marker.on("dragend", (e) => {
                let coords = e.target.getLngLat()
                this.updateMissionElement({id: marker.id, type: "coords", value: [coords.lng, coords.lat]})
            })
            let marker_index = document.createElement("span")
            marker_index.classList.add("marker_index")
            marker_index.textContent = this.last_index+1
            this.last_index++
            marker.getElement().append(marker_index)
            this.mission_markers.push(marker)
            this.addMissionElement({id: marker.id, coords: [marker.getLngLat().lng, marker.getLngLat().lat]})
        })
        let mission_markers_coords = this.mission_markers.map(marker => {return [marker.getLngLat().lng, marker.getLngLat().lat]})
        this.showRoute(mission_markers_coords)
    }
    clearMission(){
        if (this.mission_markers.length !== 0){
            this.map.removeLayer("mission_line_layer")
            this.map.removeSource("mission_line_source")
            this.mission_markers.forEach(marker => {marker.remove()})
            this.mission_markers = []
            this.last_index = 0
            this.clearMissionSlice()
        }
    }
}