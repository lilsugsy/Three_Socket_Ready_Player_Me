import * as THREE from 'https://cdn.skypack.dev/three@0.136.0'
import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
//import Box from './Box.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.environment = new Environment()
        this.floor = new Floor();
        this.renderer = this.experience.renderer
        
        // player
        this.loader = new GLTFLoader();
        this.player_file = this.experience.player_file
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

                this.player_loaded = gltf

                this.player_loaded.receiveShadows=true
                this.scene.add( gltf.scene );


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

    makeBox(){

        /*
        this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 512 );
        this.cubeRenderTarget.texture.type = THREE.HalfFloatType;
        this.cubeCamera = new THREE.CubeCamera( 1, 1000, this.cubeRenderTarget );
        this.cubeCamera.position.set(0,1,0)
        */

        const geometry = new THREE.IcosahedronGeometry(1, 15);
        const material = new THREE.MeshPhysicalMaterial({  
            roughness: 0.15,  
            reflectivity: 0.3,
            transmission: 0.5,  
            thickness: 0.5, // Add refraction!
            //envMap: this.cubeRenderTarget.texture,
            //envMapIntensity: 1
        });
        this.cube = new THREE.Mesh( geometry, material );
        this.cube.position.y = 2
        this.scene.add( this.cube );

        
        /*
        const geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
        const material2 = new THREE.MeshBasicMaterial( {
            color: 0x00ff00,
            envMap: this.cubeRenderTarget.texture,
        } );
        const cube2 = new THREE.Mesh( geometry2, material2 );
        cube2.position.x = 2
        cube2.position.y = 2
        this.scene.add( cube2 );
        */


    }

    update()
    {

                
        //if(this.cubeCamera)
            //this.cubeCamera.update( this.renderer.instance, this.scene );

        if(this.fox)
            this.fox.update()

        if(this.box)
            this.box.update()

        if(this.floor)
            this.floor.update()

    }
}