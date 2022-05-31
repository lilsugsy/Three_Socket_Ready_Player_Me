import * as THREE from 'https://cdn.skypack.dev/three@0.136.0'
import Experience from '../Experience.js'

export default class Floor
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time

        this.uniforms = {
            time: {
              value: 0
          }
        }        

        this.setTextures()
        this.setMaterial()
        this.setMesh()
        this.setPlane()
    }

    setPlane(){
        const geometry = new THREE.PlaneGeometry( 1000, 1000 );
        const material = new THREE.MeshBasicMaterial( {color: 0xfae69c, side: THREE.DoubleSide} );
        this.plane = new THREE.Mesh( geometry, material );
        this.plane.rotation.x = Math.PI / 2;
        this.scene.add( this.plane );
    }

    setTextures()
    {

        this.vertexShader = `
        varying vec2 vUv;
        uniform float time;
        
          void main() {
      
          vUv = uv;
          
          // VERTEX POSITION
          
          vec4 mvPosition = vec4( position, 1.0 );
          #ifdef USE_INSTANCING
              mvPosition = instanceMatrix * mvPosition;
          #endif
          
          // DISPLACEMENT
          
          // here the displacement is made stronger on the blades tips.
          float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
          
          float displacement = sin( mvPosition.z + time * 10.0 ) * ( 0.1 * dispPower );
          mvPosition.z += displacement;
          
          //
          
          vec4 modelViewPosition = modelViewMatrix * mvPosition;
          gl_Position = projectionMatrix * modelViewPosition;
      
          }
      `;
      
      this.fragmentShader = `
        varying vec2 vUv;
        
        void main() {
            vec3 baseColor = vec3( 0.1, 0.7, 0.1 );
          float clarity = ( vUv.y * 0.5 ) + 0.5;
          gl_FragColor = vec4( baseColor * clarity, 1 );
        }
      `;
      

    }

    setMaterial()
    {

        this.leavesMaterial = new THREE.ShaderMaterial({
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            uniforms: this.uniforms,
            side: THREE.DoubleSide
        });
        

    }

    setMesh()
    {

        this.instanceNumber = 5000;
        this.dummy = new THREE.Object3D();
        
        this.geometry = new THREE.PlaneGeometry( 0.04, 1, 1, 4 );
        this.geometry.translate( 0, 0.5, 0 ); // move grass blade geometry lowest point at 0.
        
        this.instancedMesh = new THREE.InstancedMesh( this.geometry, this.leavesMaterial, this.instanceNumber );
        
        this.scene.add( this.instancedMesh );
        
        // Position and scale the grass blade instances randomly.
        
        for ( let i=0 ; i<this.instanceNumber ; i++ ) {
        
            this.dummy.position.set(
              ( Math.random() - 0.5 ) * 10,
            0,
            ( Math.random() - 0.5 ) * 10
          );
          
          this.dummy.scale.setScalar( 0.5 + Math.random() * 0.5 );
          
          this.dummy.rotation.y = Math.random() * Math.PI;
          
          this.dummy.updateMatrix();
          this.instancedMesh.setMatrixAt( i, this.dummy.matrix );
        
        }
    }

    update()
    {

               // Hand a time variable to vertex shader for wind displacement.
               this.leavesMaterial.uniforms.time.value = this.time.elapsed*0.0002
               this.leavesMaterial.uniformsNeedUpdate = true;

    }
}