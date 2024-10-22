import React from "react";
import PauseImage from '../assets/pause.png'
import PlayImage from '../assets/play.png'
import StopImage from '../assets/stop.png'
import './Buttons.css'

export function PauseButton({func}){
    return (<button className="action-buttons" onClick={func}>
        <img src={PauseImage}/>
    </button>)
}

export function PlayButton({func}){
    return (<button className="action-buttons" onClick={func}>
        <img src={PlayImage}/>
    </button>)
}

export function StopButton({func}){
    return (<button className="action-buttons" onClick={func}>
        <img src={StopImage}/>
    </button>)
}


