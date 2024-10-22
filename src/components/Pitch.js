import React from "react";
import Rocket from "../assets/rocket.png";
import "./Pitch.css"

 export default function Pitch({linked_list}){
    const pitchOrientation = {
        rotate: linked_list.tail? `${linked_list.tail.orientation.Ox}deg` : "0deg"
    }
    

    return (
        <div className="pitch-container">
            <div className="coordinate-pitch-circle">
                <img src={Rocket} className="rocket-image" style={pitchOrientation}/>
            </div>
            <h3>Pitch: {linked_list.tail? linked_list.tail.orientation.Ox : 0} degrees</h3>
        </div>
    );
 }