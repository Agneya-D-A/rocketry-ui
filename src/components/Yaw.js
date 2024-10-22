import React from "react";
import Rocket from "../assets/rocket.png";
import "./Yaw.css"

 export default function Yaw({linked_list}){
    const yawOrientation = {
        rotate: linked_list.tail? `${linked_list.tail.orientation.Oy}deg` : "0deg"
    }
    

    return (
        <div className="yaw-container">
            <div className="coordinate-yaw-circle">
                <img src={Rocket} className="rocket-image" style={yawOrientation}/>
            </div>
            <h3>Yaw: {linked_list.tail? linked_list.tail.orientation.Oy : 0} degrees</h3>
        </div>
    );
 }