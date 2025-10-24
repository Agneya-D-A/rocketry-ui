import {React, useState, useEffect} from "react";
import "./PositionBox.css"
import { MapContainer, TileLayer, Marker, Popup, useMap} from "react-leaflet";
import L from 'leaflet';
import customMarker from '../assets/naf2.png';

const Gps = ({linked_list}) =>{
    const [centre, setCentre] = useState([26.71959705196945, 84.30396473221639]);
    const [fetchedCentre, setFetchedCentre] = useState(true);
    let currentLocation = [window.LAT || 26.71959705196945, window.LON || 84.30396473221639];

    const myIcon = new L.Icon({
        iconUrl: customMarker,
        iconSize: [29, 84],       // size of the icon [width, height]
        iconAnchor: [0, 84],     // point of the icon which corresponds to marker's location
        popupAnchor: [0, -84]     // point from which the popup should open relative to the iconAnchor
    });

    // useEffect(()=>{
    //     fetch("https://geolocation-db.com/json/")
    //     .then((response) => response.json())
    //     .then((data) => {
    //         if (data.latitude && data.longitude) {
    //             setCentre([data.latitude, data.longitude]);
    //             setFetchedCentre(true);
    //         }
    //     })
    //     .catch((error) => {
    //         console.error("Error fetching location:", error);
    //     });
    // }, []);

    useEffect(()=>{
        if(window.LAT && window.LON){
            setCentre([window.LAT, window.LON]);
        }
    },[]);
    
    return (
        <div className="bottom-box">{
            fetchedCentre && <MapContainer center={centre} zoom={16} style={{height: "100%", width:"100%"}}>
                <TileLayer
                    url="./map_tiles/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap contributors</a>"
                />
                <Marker position={linked_list.tail? [linked_list.tail.position.x , linked_list.tail.position.y]: currentLocation} icon={myIcon}>
                    <Popup>NAF-2</Popup>
                </Marker>
            </MapContainer>
            }
        </div>
    );
}

export default Gps;