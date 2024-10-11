import React from "react";
import Needle from "../assets/roll_needle.png";
import "./Roll.css"

 export default function Roll({linked_list}){
    const rollOrientation = {
        rotate: linked_list.tail? `${linked_list.tail.orientation.Oz}deg` : "0deg"
    }
    

    return (
        <div className="pitch-container">
            <div className="coordinate-roll-circle">
                <img src={Needle} className="needle-image" style={rollOrientation}/>
            </div>
            <h3>Roll: {linked_list.tail? linked_list.tail.orientation.Oz : 0} degrees</h3>
        </div>
    );
 }