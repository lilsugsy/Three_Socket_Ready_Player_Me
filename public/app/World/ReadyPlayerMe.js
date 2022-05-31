export default class ReadyPlayerMe
{
    constructor()
    {

        this.app = window.app;
        this.player_file = ""

        const subdomain = 'metify'; // Replace with your custom subdomain
        const frame = document.getElementById('frame');
  
        frame.src = `https://${subdomain}.readyplayer.me/avatar?frameApi`;
  
        window.addEventListener('message', subscribe);
        document.addEventListener('message', subscribe);
  
        function subscribe(event) {
          const json = parse(event);
  
          if (json?.source !== 'readyplayerme') {
            return;
          }
  
          // Susbribe to all events sent from Ready Player Me once frame is ready
          if (json.eventName === 'v1.frame.ready') {
            frame.contentWindow.postMessage(
              JSON.stringify({
                target: 'readyplayerme',
                type: 'subscribe',
                eventName: 'v1.**'
              }),
              '*'
            );
          }
  
          // Get avatar GLB URL
          if (json.eventName === 'v1.avatar.exported') {
            
            //console.log(`Avatar URL: ${json.data.url}`);
            this.player_file = `${json.data.url}`;
            //document.getElementById('avatarUrl').innerHTML = `Avatar URL: ${json.data.url}`;
            document.getElementById('frame').hidden = true;
            
            ////////////////// start the experience //////////////////
                  this.app.startExperience(this.player_file)
            //////////////////////////////////////////////////////////

          }
  
          // Get user id
          if (json.eventName === 'v1.user.set') {
            //console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
          }
        }
  
        function parse(event) {
          try {
            return JSON.parse(event.data);
          } catch (error) {
            return null;
          }
        }
  
        function displayIframe() {
          document.getElementById('frame').hidden = false;
        }
  
    }


}