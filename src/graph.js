import React from "react";

export default function Graph({linked_list}){

    const componentMaker = (node) =>{
        //This is just a test case example. Modify this according to your necessity
        //This returns a Vertex component by taking a node of the linked list as a parameter
        return (
            <p>{`Vx: ${node.Vx}, Vy: ${node.Vy}, Vx: ${node.Vz}, Vx: ${node.V}, `}</p>
        );
    }
    
    const componentBaker = (node) => {
        return {...node};
    }
        
    //Getting a component array from the linked list
    // let indexes = 0;
    // let testing_list = linked_list.map((node) => {
    //     return {
    //         key: indexes++,
    //         Vx: node.Vx,
    //         Vy: node.Vy,
    //         Vz: node.Vz,
    //         V: node.V,
    //         time: node.time
    //     }
    // });
    // console.log(testing_list)

    let testing_list = linked_list.map((node) => componentMaker(node));
    // console.log(testing_list);

    //rendering the component array
    return (
        <div className="vertex-container">
            {testing_list}
            <h1>Hello World</h1>
        </div>
    );
}
