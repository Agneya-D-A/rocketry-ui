import React,{useContext} from 'react';
import "./Slider.css";
import { ThemeContext } from '../App';

export default function Silder(){
    const {theme,setTheme} = useContext(ThemeContext);
    //Flip theme from light to dark and vice versa
    const flipTheme = () =>{
        setTheme((prevTheme)=>{
            return prevTheme=="light"? "dark": "light";
        })
    };
    return (
        <div class="slider" 
            style={{justifyContent: theme=="light"? "flex-start": "flex-end"}}
            onClick={flipTheme}
        >
            <div class={`slider-button`} ></div>
        </div>
    )
}
