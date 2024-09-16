// import logo from './logo.svg';
import './App.css';
// import Graph from './graph';
import { useState, useEffect } from 'react';
import { LinkedList, Node } from './util/LinkedList';
import io from 'socket.io-client'

import Graph from "./components/Graph";

const App = () =>{
  const [linked_list, updateList] = useState(new LinkedList(10));

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
    <div className='App'>
      <h1>Live Sensor Data</h1>
      <div className='graph-container'>
        <Graph linked_list={linked_list} purpose='velocity'/>
        <Graph linked_list={linked_list} purpose='acceleration'/>
        <Graph linked_list={linked_list} purpose='altitude'/>
        <Graph linked_list={linked_list} purpose='temperature'/>
      </div>
    </div>
  )
}

export default App;

{/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}