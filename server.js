import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });


//// setup paths once served
app.use(express.static('public'))
//app.use('/scripts', express.static(__dirname + '/node_modules/'));

// Allows browsers to access `node_modules/zl-fetch`
app.use('/three', express.static('node_modules/three'));

app.use('/static', express.static(__dirname + '/static'));


app.get('/fonts/Anurati-Regular.woff2', (req, res) => {
    res.sendFile(__dirname + '/fonts/Anurati-Regular.woff2');
});
app.get('/fonts/Anurati-Regular.woff', (req, res) => {
    res.sendFile(__dirname + '/fonts/Anurati-Regular.woff');
});

app.get('/audio/audio-global.mp3', (req, res) => {
    res.sendFile(__dirname + '/audio-global.mp3');
});


//// start routing
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/styles.css', (req, res) => {
    res.sendFile(__dirname + '/styles.css');
});

let clients = {}

io.on('connection', (socket) => {

    //// connected
    console.log('a user connected');
    console.log('There are ' + io.engine.clientsCount + ' clients connected');   
    
        //Add a new client indexed by his id
        clients[socket.id] = {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
        }    
        
        ////////////////////// update player files
        socket.on('add_player_file', (player_file) =>{
            clients[socket.id].player_file = player_file;
              //Update everyone that the number of users has changed
              io.sockets.emit('playerFileAdded', socket.id, clients);
            //io.sockets.emit('userFiles', clients);
            //console.log(clients[socket.id].player_file)

            //Update everyone that the number of users has changed
            io.sockets.emit('newUserConnected', io.engine.clientsCount, socket.id, Object.keys(clients), clients); 
        });   
        /////////////////////////////////////////////////  
           
        
       // console.log(clients[socket.id])

        //Make sure to send the client it's ID
        socket.emit('introduction', socket.id, io.engine.clientsCount, Object.keys(clients), clients);         
        
        // sending messages
        socket.on('chat message', (msg) => {
            io.emit('chat message', msg);
        });    
        
        // update positions
        socket.on('move', (pos)=>{
            clients[client.id].position = pos;
            io.sockets.emit('userPositions', clients);        
        });        
              
    
    //// disconnected
    socket.on('disconnect', () => {
        delete clients[socket.id];
        io.sockets.emit('userDisconnected', io.engine.clientsCount, socket.id, Object.keys(clients));
        console.log('There are ' + io.engine.clientsCount + ' clients connected');        
    });


});

httpServer.listen(3000, () => {
    console.log('listening on *:3000');
});