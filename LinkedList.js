// import React from 'react';

class Node{
    //This is a node in the linked list
    //It has 2 parts. The data part and the attribute next which holds the reference to the next node in the linked list
    constructor(object){
        //This constructor initializes a node by taking in a JSON as the parameter
        this.Vx = object.Vx;
        this.Vy = object.Vy;
        this.Vz = object.Vz;
        this.V = this.vectorMagnitude(this.Vx, this.Vy, this.Vz);
        this.time = new Date();
        this.next = null;
    }

    vectorMagnitude = (vector_x, vector_y, vector_z) =>{
        //Does the vector addition of 3 components of a vector and returns its magnitude
        return Math.sqrt(Math.pow(vector_x,2)+Math.pow(vector_y,2)+Math.pow(vector_z,2));
    }
}


class LinkedList{
    //This is a linked list of Node objects.
    //It has a tail attribute which refers to the last Node in the linked list
    //The head attribute refers to the first Node in the linked ist
    //The length attribute is used for exception handling
    //When rendering the graph, if the list is empty we cannot remove a point and add a point.
    //This length variable is going to be used to check if the list is empty

    constructor(limit){
        //Initializes the linked list 
        this.head = null;
        this.tail = null;
        this.length = 0;
        this.limit = limit;
    }

    insertAtTail(node){
        //This method adds a node to the end of the linked list
        if(this.head==null){
            this.head = node;
            this.tail = node;
            this.length = 1;
        }
        else{
            this.tail.next = node;
            this.tail = node;
            this.length += 1;
        }
    }

    removeFromHead(){
        //Removes the first element from the linked list
        if(this.head === null){
            return;
        }
        if(!this.head.next){
            this.head = null;
            this.tail = null;
            this.length = 0;
        }
        else{
            this.head = this.head.next;
            this.length -= 1;
        }
    }

    map(callback){
        //This performs the same function as the inbuilt js function Array.map()
        //Whatever function is passed into the map function, it performs that function on each Node in the list
        //and adds the outpu to mappedArray. It then returns this array
        let mappedArray = [];
        let currentNode = this.head;

        while(currentNode){
            //performs callback operation on the current node
            const mappedValue = callback(currentNode);
            mappedArray.push(mappedValue);
            //to the next node!!!
            currentNode = currentNode.next;
        }
        return mappedArray;
    }

    refreshPoints(node){
        if(this.length<=this.limit){
            this.removeFromHead();
        }
        this.insertAtTail(node);
    }
}

module.exports = {LinkedList, Node};