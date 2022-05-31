import * as THREE from 'https://cdn.skypack.dev/three@0.136.0'
import Experience from "./Experience.js";
import Player from './World/Player.js';


export default class SocketConnection {
    constructor() {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.player_file = this.experience.player_file

        this.socket = io();        
        this.clients = new Object();
        this.id = ""
        
        //console.log(this.clients)
        this.socket.emit('add_player_file', this.player_file);


        // message system
        this.setUpMessages()
        this.socketSendMessages()
        this.socketReceiveMessages()

        // users
        this.socketNewUser()
        this.socketNewExternalUser()        
        this.updateUserFiles()           
        this.updateUserPositions()   
        this.socketUserDisconnected()

        /////////////////////////
        //// LAST THING WORKED ON
        //document.addEventListener("keydown", (e) => {
          //this.socket.emit('userMoved');       
        //});
        //// LAST THING WORKED ON
        /////////////////////////

    }

    /////////////// Messages ///////////////
    setUpMessages(){
      this.messages = document.getElementById('messages');
      this.form = document.getElementById('form');
      this.input = document.getElementById('input');
      this.data = {}    
    }

    socketSendMessages() {

      // send messages
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value) {      
          this.data = {
            'id' : this.socket.id,
            'text' :  input.value
          }
          
          this.socket.emit('chat message', this.data);
          input.value = '';
        }
      });

    }

    socketReceiveMessages() {
      /// receive messages
      this.socket.on('chat message', (msg) => {
        var item = document.createElement('li');
        var itemName = document.createElement('b');
        var itemMessage = document.createElement('p');

        itemName.textContent = msg.id + ':';
        itemMessage.textContent = msg.text;

        this.messages.appendChild(item);
        item.appendChild(itemName);
        item.appendChild(itemMessage);

        //window.scrollTo(0, document.body.scrollHeight);
      });      

    }    

    /////////////// Users ///////////////


    socketNewUser() {
      //On connection server sends the client his ID
      this.socket.on('introduction', (_id, _clientNum, _ids, clients)=>{

        //console.log("!!!!!" + JSON.stringify(_ids) + "!!!!!")
        this.id = _id    
        
        for(let i = 0; i < _ids.length; i++){
          if(_ids[i] != _id){
            if(clients[_ids[i]].player_file) {
              this.clients[_ids[i]] = {
                mesh: clients[_ids[i]].player_file
              }
            //Add initial users to the scene
            //console.log("***" + this.clients[i].mesh + "***")
            //this.clients[i].player = new Player(this.clients[i].mesh)
            this.clients[_ids[i]].player = new Player(this.clients[_ids[i]].mesh)

            }


          }

          
        }

        //console.log(this.clients);

        this.id = _id;
        console.log('My ID is: ' + this.id);

        //////////////////////////////////////////////////////
        //this.socket.emit('add_player_file', this.player_file);
        //////////////////////////////////////////////////////

      });// end intro     

    }



    socketNewExternalUser(){
      //////// when someone else connects
      this.socket.on('newUserConnected',  (clientCount, _id, _ids, clients) =>{
       
        if(clientCount <= 1){
          document.getElementById('numUsers').textContent = clientCount + " user";
        } else {
          document.getElementById('numUsers').textContent = clientCount + " users";
        }
        //console.log(clientCount + ' clients connected');
        
        let alreadyHasUser = false;

        for(let i = 0; i < Object.keys(this.clients).length; i++){
          if(Object.keys(this.clients)[i] == _id){
            alreadyHasUser = true;
            break;
          }
        }
        
        if(_id != this.id && !alreadyHasUser){
          console.log('A new user connected with the id: ' + _id);
          
          //console.log(this.clients[_id])
          console.log(">>>" + JSON.stringify(clients) + "<<<")
          this.clients[_id] = {
            mesh: clients[_id].player_file
          }  
          this.clients[_id].player = new Player(this.clients[_id].mesh)

          

         // let newPlayer = new Player(this.clients[_id].mesh_url)
        }       
        
      }); // end newUserConnected     
  }    

    updateUserFiles(){

      //Update when one of the users moves in space
      this.socket.on('userFiles', _clientProps =>{
        // console.log('Positions of all users are ', _clientProps, id);
        // console.log(Object.keys(_clientProps)[0] == id);
        for(let i = 0; i < Object.keys(_clientProps).length; i++){
          if(Object.keys(_clientProps)[i] != this.id){

            //Store the values
            let newFile = _clientProps[Object.keys(_clientProps)[i]].player_file;
            console.log(">> new >>" + newFile + "<< file <<")

            //Set the position
            this.clients[Object.keys(_clientProps)[i]].player_file = newFile;
          }

          console.log("^^^^" + JSON.stringify(this.clients) + "^^^^^")
        }    
      });  
    }

    updateUserPositions() {
      //Update when one of the users moves in space
      this.socket.on('userPositions', _clientProps =>{
        // console.log('Positions of all users are ', _clientProps, id);
        // console.log(Object.keys(_clientProps)[0] == id);
        for(let i = 0; i < Object.keys(_clientProps).length; i++){

              if(Object.keys(_clientProps)[i] != id){

                //Store the values
                let oldPos = clients[Object.keys(_clientProps)[i]].mesh.position;
                let newPos = _clientProps[Object.keys(_clientProps)[i]].position;

                //Create a vector 3 and lerp the new values with the old values
                let lerpedPos = new THREE.Vector3();
                lerpedPos.x = THREE.Math.lerp(oldPos.x, newPos[0], 0.3);
                lerpedPos.y = THREE.Math.lerp(oldPos.y, newPos[1], 0.3);
                lerpedPos.z = THREE.Math.lerp(oldPos.z, newPos[2], 0.3);

                //Set the position
                this.clients[Object.keys(_clientProps)[i]].mesh.position.set(lerpedPos.x, lerpedPos.y, lerpedPos.z);
              } // end if

          } // end for   
        });        
      
    }


    socketUserDisconnected(){
      this.socket.on('userDisconnected', (clientCount, _id, _ids)=>{
        //Update the data from the server
        if(clientCount <= 1){
          document.getElementById('numUsers').textContent = clientCount + " user";
          } else {
            document.getElementById('numUsers').textContent = clientCount + " users";
          }
      
        if(_id != this.id){
          console.log('A user disconnected with the id: ' + _id);
          console.log(this.clients[_id])
          //this.scene.remove(this.clients[_id].mesh);
          this.scene.remove(this.clients[_id].player.player_mesh);
          delete this.clients[_id];
        }
      });    
    }


}