import React,{useContext} from 'react';
import "./Slider.css";
import { ThemeContext } from '../App';

export default function Silder(){
    const {theme,setTheme} = useContext(ThemeContext);
    const flipTheme = () =>{
        setTheme((prevTheme)=>{
            return prevTheme=="light"? "dark": "light";
        })
    };
    return (
        <div className="slider" 
            style={{justifyContent: theme==="light"? "flex-start": "flex-end"}}
            onClick={flipTheme}
        >
            <div className={`slider-button`} ></div>
        </div>
    )
}
