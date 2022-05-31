import SocketConnection from "./app/Socket.js";
import Experience from "./app/Experience.js";
import ReadyPlayerMe from "./app/World/ReadyPlayerMe.js";

let instance = null

export default class App {
  constructor() {  

    window.app = this

    // open ready player me panel on load
    this.player = new ReadyPlayerMe()
    //.. a function is then run to startExperience() once avatar is loaded, passing the player file path through from RPM

  }

  startExperience(_player_file){
    this.experience = new Experience(document.querySelector('canvas.webgl'), _player_file)
    this.socketConnection = new SocketConnection();
    this.messagePanel = document.querySelector(".messages--container")
    this.buttonInteractions()
  }

  buttonInteractions() {
    //start listener
    document.addEventListener("click", (e) => {

      switch(e.target.id){
        case "button__messages":
            e.target.classList.toggle("active");
            this.messagePanel.classList.toggle("active");
            break;
        case "button__settings":
            //alert('settings')
            break;
        case "button__account":
          //alert('account')
          break;            
      } 
    } );
    // end listener

  }

}

const app = new App()