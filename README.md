This project aims to provide a user interface for live sensor data visualization as a part of the Rocketry club of BMSCE.
SerialPort is used to obtain CSV format data printed to the Serial by the ground systems arduino and it is split into appropriate status variables.
A node object conforming to a predefined Mongoose Schema is created and the node is saved to the database. It is also sent to the frontend through socket.io
The frontend uses a linked list of nodes obtained from the backend for displaying vertices on the graph.
Char.js and Chart-2-js along with React.js are used for building the frontend of the project.
The Node.js server acts as a mediator between the arduino program and the frontend.
