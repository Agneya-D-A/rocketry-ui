
import './App.css';
// import Graph from './graph';
import { useState, useEffect, createContext } from 'react';
import { LinkedList, Node } from './util/LinkedList';
import io from 'socket.io-client'

import Graph from "./components/Graph";
import Slider from "./components/Slider";

const ThemeContext = createContext();

const App = () =>{
  const [linked_list, updateList] = useState(new LinkedList(10));
  const [theme, setTheme] = useState("dark");

  useEffect(()=>{
    const socket = io('http://localhost:3001');
    socket.on('new-data',(new_node)=>{
      updateList(prevList => {
        // const newList = new LinkedList(10);
        const node = new Node(JSON.parse(new_node));
        const newList = new LinkedList(10);
        newList.head = prevList.head;
        newList.tail = prevList.tail;
        newList.length = prevList.length;
        newList.refreshPoints(node);
        return newList;
      });
    },[]);

    return () => {
      socket.disconnect();
    }
    
  },[linked_list]);

  return(
    <ThemeContext.Provider value={{theme,setTheme}}>
      <div className={`App ${theme}`}>
        <div className='navbar'>
          <h1 style={{gridColumn: "1/span 2"}}>Live Sensor Data</h1>
          <div className='slider-container'>
            <h3 className={`${theme}`}>Light</h3>
            <Slider/>
            <h3 className={`${theme}`}>Dark</h3>
          </div>
        </div>
        <div className='graph-container'>
          <Graph linked_list={linked_list} purpose='velocity'/>
          <Graph linked_list={linked_list} purpose='acceleration'/>
          <Graph linked_list={linked_list} purpose='altitude'/>
          <Graph linked_list={linked_list} purpose='temperature'/>
        </div>
      </div>
    </ThemeContext.Provider>
  )
}

export default App;

export {ThemeContext};
