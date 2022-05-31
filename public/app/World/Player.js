import * as THREE from 'https://cdn.skypack.dev/three@0.136.0'
import Experience from '../Experience.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

export default class Player
{
    constructor(_player_file)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time

        this.loader = new GLTFLoader();
        this.player_file = _player_file
        this.player_loaded = ""
        this.addPlayer()        


    }

    addPlayer(){
        
        // Load a glTF resource
        this.loader.load(
            // resource URL
            this.player_file,
            // called when the resource is loaded
             ( gltf ) => {

                this.player_mesh = gltf.scene

                this.player_mesh.receiveShadows=true
                this.scene.add( this.player_mesh );


            },
            // called while loading is progressing
            ( xhr ) => {

                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            ( error ) => {

                console.log( 'An error happened' );

            }
        );
    }

   
}