import * as THREE from 'https://cdn.skypack.dev/three@0.136.0'
import Experience from '../Experience.js'

export default class Box
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.sizes = this.experience.sizes

        this.texture.minFilter = THREE.NearestFilter;
        this.texture.magFilter = THREE.NearestFilter;
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;

        this.uniforms = {
            iTime: { value: 0 },
            iResolution:  { value: new THREE.Vector3(1, 1, 1) },
            iChannel0: { value: this.texture }
          };

          console.log(this.uniforms);

        this.addFragmentShader()    
        this.addVertexShader() 
        this.addBox()
       

    }

    addBox() {
        this.geometry = new THREE.PlaneBufferGeometry( 3, 3);                        
        this.material = new THREE.ShaderMaterial( {            
            fragmentShader: this.fragment,
            vertexShader: this.vertex,
            uniforms:  this.uniforms,  
            transparent: true,      
        } );
        
        this.cube = new THREE.Mesh( this.geometry, this.material );
        this.cube.position.set(0, 1,0)
        this.scene.add( this.cube );    
        
    }

    addFragmentShader() {
        this.fragment = `

        #include <common>

        uniform vec3 iResolution;
        uniform float iTime;
        uniform sampler2D iChannel0;

        varying vec2 vUv;
      
        // By Daedelus: https://www.shadertoy.com/user/Daedelus
        // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
        #define TIMESCALE 0.25 
        #define TILES 8
        #define COLOR 0.7, 1.6, 2.8
      
        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
          vec2 uv = fragCoord.xy / iResolution.xy;
          uv.x *= iResolution.x / iResolution.y;
          
          vec4 noise = texture2D(iChannel0, floor(uv * float(TILES)) / float(TILES));
          float p = 1.0 - mod(noise.r + noise.g + noise.b + iTime * float(TIMESCALE), 1.0);
          p = min(max(p * 3.0 - 1.8, 0.1), 2.0);
          
          vec2 r = mod(uv * float(TILES), 1.0);
          r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
          p *= 1.0 - pow(min(1.0, 12.0 * dot(r, r)), 2.0);
          
          fragColor = vec4(COLOR, 1.0) * p;
        }
      
        void main() {
            mainImage(gl_FragColor, vUv * iResolution.xy);
        }
                             
        `
    }

    addVertexShader() {
        this.vertex = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `
    }    



    update()
    {

       // this.uniforms[ 'iTime' ].value += 0.2 * this.time.delta*0.01;
        this.uniforms.iTime.value += 0.2 * this.time.delta*0.01;
        
    }
}