# Three_Socket_Ready_Player_Me
A boiler plate for loading avatars into a three.js scene dynamically, syncing and loading other players when they connect.

## Getting Started.

Download the files, drag into VS Code. In the root directory run 'npm install' to install the node modules

Once downloaded, run 'npm run dev'. It will then start a server(via express) which you can see the app via http://localhost:3000/

## INFO

The entry point is "server.js". This sets the initial server socket up, as well routing http://localhost:3000/ to the index.html file.

index.html loads the "main.js" script which is where the entry point is for all the scripts.

## main.js
main.js first loads the readyplayerme script (essentially an iframe). Once the user selects an avatar, the iframe returns a glb file. From there we can set up the scene and socket connections. This is done via the startExperience() function.

new Experience() is where 90% of three.js stuff is handled.
new SocketConnection() is where 100% of the socket information is passed through (handles connections, adding players etc...)
The rest of the javascript in this file handles interaction of the html elements (message panel + icons etc.)
