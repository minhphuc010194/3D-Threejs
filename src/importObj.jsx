import React,{useRef, useEffect} from 'react'
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

export default function Importobj(props) {
    const {width, height} = props;
    const ourObj = useRef()
    const anchor = useRef();
    useEffect(()=>{
        //Create the Three.Scene
        const scene = new THREE.Scene(),
        //create a new Prespective Camera
            camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 2000);
            camera.position.z = 200;

        // Create a Full Screen WebGL Renderer   
        const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
            renderer.setClearColor("#DDDDDD")
            renderer.setSize(width, height);
        
        
        anchor.current.appendChild(renderer.domElement);

        //Make sure the project is responsive based on window resizing
        window.addEventListener('resize', ()=>{
            renderer.setSize(width, height);
            camera.aspect = width/height;

            camera.updateProjectionMatrix();
        });

        // Add a light
        let light = new THREE.PointLight(0xFFFFFF, 5, 1000);
        light.position.set(0,500,500);
        scene.add(light);
        

        // Defining a variable for our two models

        //Create a material

        let mtlLoader = new MTLLoader();
        mtlLoader.load(require('./IronMan.mtl'),function(materials){
            materials.preload();

            //Load the object
            let objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(require('./IronMan.obj'), function (object){
                scene.add(object); 
                object.position.z = 0;
                object.position.y = -100;
                object.rotation.x = 0;
                ourObj.current = object;
            })

        })

        
        
        function render (){
            
            requestAnimationFrame(render);
            // Rotate the objects indefinitely
            if(ourObj.current&&ourObj.current.rotation){
                ourObj.current.rotation.y += .03
            }
            
            renderer.render(scene, camera);
        }

        // Call this to render the entire scene
        render();
        
    },[])


    return (
        <>
        
            <div ref={anchor} style={{width, height, margin: "0 auto"}}>
            </div>
        </>
    )
}
