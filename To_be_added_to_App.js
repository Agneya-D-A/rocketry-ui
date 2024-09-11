// This is the code which shows the connection to the server and updating the linked list every time we get new data. 
// Necessary portions of this are to be included in our App.js file
import Graph from './Graph';
import { useState, useEffect } from 'react';
import { LinkedList, Node } from './util/LinkedList';
import io from 'socket.io-client'

function App() {
  const [linked_list, updateList] = useState(new LinkedList(10));

  useEffect(()=>{
    const socket = io('http://localhost:3001');
    socket.on('new-data',(new_node)=>{
      updateList(prevList => {
        // const newList = new LinkedList(10);
        const node = new Node(new_node)
        const newList = new LinkedList(10);
        newList.head = prevList.head;
        newList.tail = prevList.tail;
        newList.length = prevList.length;
        newList.refreshPoints(node);
        return newList;
      });
    });

    return () => {
      socket.disconnect();
    }
    
  },[]);
  
  return (
    <div className="App">
      <Graph linked_list={linked_list}/>
    </div>
  );
}

export default App;
