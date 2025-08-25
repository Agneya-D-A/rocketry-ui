import {React, useState, useEffect} from "react";
import "./PositionBox.css"
import { MapContainer, TileLayer, Marker, Popup, useMap} from "react-leaflet";
import L from 'leaflet';
import customMarker from '../assets/naf2.png';

const Gps = ({linked_list}) =>{
    const [centre, setCentre] = useState([12.938208653033508, 77.56303455693195]);
    const [fetchedCentre, setFetchedCentre] = useState(true);
    let currentLocation = [12.93623206646275, 77.56159055086273];

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
    
    return (
        <div className="bottom-box">{
            fetchedCentre && <MapContainer center={centre} zoom={16} style={{height: "100%", width:"100%"}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
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