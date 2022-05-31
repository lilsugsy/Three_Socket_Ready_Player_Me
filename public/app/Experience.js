import * as THREE from 'https://cdn.skypack.dev/three@0.136.0'

import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'

let instance = null

export default class Experience
{
    constructor(_canvas , _player_file)
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        
        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas
        this.player_file = _player_file        

        // Setup
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        ////// audio stuff
            this.listener = new THREE.AudioListener();
            this.camera.instance.add( this.listener );
            // create a global audio source
            this.sound = new THREE.Audio( this.listener );
            // load a sound and set it as the Audio object's buffer
            this.audioLoader = new THREE.AudioLoader();
            this.audioLoader.load( '/audio/audio-global.mp3', ( buffer ) => {
                this.sound.setBuffer( buffer );
                this.sound.setLoop( true );
                this.sound.setVolume( 0.5 );
                this.sound.play();
            });            
        
        ////// audio stuff end
        

        /////// Resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            this.update()

        })
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.world.update()
        this.camera.update()
        this.renderer.update()
    }

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        //this.camera.controls.dispose()
        this.renderer.instance.dispose()

    }
}