import * as THREE from 'https://cdn.skypack.dev/three@0.136.0'
import Experience from '../Experience.js'
import { Sky } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/objects/Sky.js';


export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.renderer = this.experience.renderer        
        
        this.addSky()
        this.setSunLight()
        //this.setEnvironmentMap()
    }

    addSky(){
      this.sky = new Sky();
      this.sky.scale.setScalar( 450000 );
      this.scene.add( this.sky );
      this.sun = new THREE.Vector3();

      this.effectControllerSun = {
          turbidity: 10,
          rayleigh: 3,
          mieCoefficient: 0.005,
          mieDirectionalG: 0.7,
          elevation: 2,
          azimuth: 180,
          exposure: this.renderer.instance.toneMappingExposure
      };  
      this.effectController = {
          turbidity: 2.8,
          rayleigh: 0.066,
          mieCoefficient: 0.004,
          mieDirectionalG: 0.988,
          elevation: 13.7,
          azimuth: 153.4,
          exposure: 0.1
      };                

      this.uniforms = this.sky.material.uniforms;
      this.uniforms[ 'turbidity' ].value = this.effectController.turbidity;
      this.uniforms[ 'rayleigh' ].value = this.effectController.rayleigh;
      this.uniforms[ 'mieCoefficient' ].value = this.effectController.mieCoefficient;
      this.uniforms[ 'mieDirectionalG' ].value = this.effectController.mieDirectionalG;

      this.phi = THREE.MathUtils.degToRad( 90 - this.effectController.elevation );
      this.theta = THREE.MathUtils.degToRad( this.effectController.azimuth );

      this.sun.setFromSphericalCoords( 1,this.phi, this.theta );

      this.uniforms[ 'sunPosition' ].value.copy( this.sun );        
    }

    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 1500
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, - 3.25)
        this.scene.add(this.sunLight)

        // light 2
        this.light = new THREE.AmbientLight( 0x909090 ); // soft white light
        this.scene.add( this.light );     

    }

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.encoding = THREE.sRGBEncoding
        
        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials)
        }
    }
}