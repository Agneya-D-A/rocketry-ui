import './App.css';
import { useState, useEffect } from 'react';
import { LinkedList, Node } from './util/LinkedList';
import io from 'socket.io-client';
import Confetti from 'react-confetti';
import { PauseButton, PlayButton, StopButton } from './components/Buttons';
import Graph from "./components/Graph";

const App = () =>{
  const [linked_list, updateList] = useState(new LinkedList(10));
  const [runState, setRunState] = useState("initial");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newSocket, setNewSocket] = useState(io('http://localhost:3001'));

  let dateOptions = {
    hour: "numeric",
    hour12: false,
    minute: "numeric",
    second: "numeric"
  }

  useEffect(()=>{
    setNewSocket(io('http://localhost:3001'));
    newSocket.on('new-data',(new_node)=>{
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
    });

    // return () => {
    //   newSocket.off();
    // }
  },[linked_list]);

  useEffect(()=>{
    if(runState == 'stopped'){
      setCurrentDate(new Date());
      newSocket.emit('program-stopped',JSON.stringify(currentDate));
      const confettiTimer = setTimeout(()=>{
        setRunState('initial');
        updateList(new LinkedList(10));
      }, 7000);

      return ()=>{
        clearTimeout(confettiTimer);
      }
    }
  },[runState]);

  const pausePlay = () =>{
    if(runState == 'paused')
      setRunState('running');
    else if(runState == 'running'){
      setRunState("paused")
    }
  }

  const startStop = () =>{
    if(runState!='initial'){
      setRunState('stopped');
    }
    else{
      setCurrentDate(new Date());
      newSocket.emit("program-started",JSON.stringify(currentDate));
      setRunState('running');
    }
  }

  return(
    <div className='App'>
      {runState==='stopped'&&<Confetti/>}
      <nav className="navbar">
        <h3 className='date-display'>Date - Time : {currentDate.toLocaleDateString("en-GB", dateOptions)}</h3>
        <h1>Live Sensor Data</h1>
        <div className='button-container'>
          {runState=='running'? <PauseButton func={pausePlay}/> : <PlayButton func={pausePlay}/>}
          <StopButton func={startStop}/>
        </div>
      </nav>
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