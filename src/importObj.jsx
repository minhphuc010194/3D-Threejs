import React,{useRef, useEffect} from 'react'
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { AnaglyphEffect } from 'three/examples/jsm/effects/AnaglyphEffect';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import {TimelineMax, Expo} from 'gsap';

export default function Importobj(props) {
    const {width, height} = props;
    const ourObj = useRef()
    const anchor = useRef();
    useEffect(()=>{
        //Create the Three.Scene
        const scene = new THREE.Scene(),
        //create a new Prespective Camera
            camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 2000);
            camera.position.z = 300;
            displaygui();

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
        let controls = new OrbitControls(camera, renderer.domElement);
        let effect = new AnaglyphEffect(renderer);
        effect.setSize(width, height)
        // Add a light
        let light = new THREE.PointLight(0xFFFFFF, 5, 1000);
        let light1 = new THREE.PointLight(0xFFFFFF, 3, 1000);
        light.position.set(0,500,500);
        light1.position.set(0,500,-500);
        scene.add(light);
        scene.add(light1);
        

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

                let tl = new TimelineMax();
                tl.from(ourObj.current.scale, 2,{y: 0, x:0, z:0, ease: Expo.easeOut});
            })

        })

        let xro,yro, zro, speed_global = 0.01;
        function displaygui(){
            let gui = new GUI();
            let speed = 0.01;
            // let jar;
            let parameters ={
                a: "Iron Man",
                b: "",
                c: true,
                d: "#0000ff",
                e: 1, f:1,g:1,
                h: 1, i:1, j: 1,
                k: 1, l: 1, m:1,
                x: false, y:false, z:false,
                n:"",
                o:"",
                sp:0.1,
            }
            gui.add(parameters,'a').name('Name');
            gui.add(parameters,'b',["Cube","Sphere","Prism"]).name('Geomertry');

            let model = gui.add(parameters,'c').name('Show Model');
            let color = gui.addColor(parameters, 'd').name('Color');

            model.onChange(function(jar){ourObj.current.visible = jar;});
            // color.onChange(function(jar){ourObj.current.material.color.setHex(jar.replace("#","0x"));});

            let dimen = gui.addFolder('Dimension');

            let xdimen = dimen.add(parameters,'e').min(0).max(20).step(speed).name('X-Axis');
            let ydimen = dimen.add(parameters,'f').min(0).max(20).step(speed).name('Y-Axis');
            let zdimen = dimen.add(parameters,'g').min(0).max(20).step(speed).name('Z-Axis');
            xdimen.onChange(function(jar){ourObj.current.scale.x = jar;});
            ydimen.onChange(function(jar){ourObj.current.scale.y = jar;});
            zdimen.onChange(function(jar){ourObj.current.scale.z = jar;});

            let posit = gui.addFolder('Position');

            let xpotsit = posit.add(parameters,'h').min(-200).max(200).step(speed).name('X-Axis');
            let ypotsit = posit.add(parameters,'i').min(-200).max(200).step(speed).name('Y-Axis');
            let zpotsit = posit.add(parameters,'j').min(-200).max(200).step(speed).name('Z-Axis');
            xpotsit.onChange(function(jar){ourObj.current.position.x = jar;});
            ypotsit.onChange(function(jar){ourObj.current.position.y = jar;});
            zpotsit.onChange(function(jar){ourObj.current.position.z = jar;});

            let rotat = gui.addFolder('Rotation');

            let xspin = rotat.add(parameters,'k').min(-20).max(20).step(speed).name('X-Axis');
            let yspin = rotat.add(parameters,'l').min(-20).max(20).step(speed).name('Y-Axis');
            let zspin = rotat.add(parameters,'m').min(-20).max(20).step(speed).name('Z-Axis');
            xspin.onChange(function(jar){ourObj.current.rotation.x = jar;});
            yspin.onChange(function(jar){ourObj.current.rotation.y = jar;});
            zspin.onChange(function(jar){ourObj.current.rotation.z = jar;});

            let anim = gui.addFolder('Animate');
            
            let xanim = anim.add(parameters,'x').name('X-Axis');
            let yanim = anim.add(parameters,'y').name('Y-Axis');
            let zanim = anim.add(parameters,'z').name('Z-Axis');
            xanim.onChange(function(jar){xro = jar});
            yanim.onChange(function(jar){yro = jar});
            zanim.onChange(function(jar){zro = jar});

            let speed_local = gui.add(parameters,'sp').min(0).max(10).step(speed).name('Speed');
            speed_local.onChange(function(jar){speed_global = jar});

            gui.add(parameters, 'n', [1,2,3,4,5]).name('Layer');
            gui.add(parameters, 'o',["Save", "Load", "Reset"]).name('Option');

            gui.open();
        }
        function spin(varname, xaxis, yaxis, zaxis){
            console.log(speed_global)
            let speed = speed_global;
            if(varname == true){
                if(xaxis == true){ ourObj.current.rotation.x += speed}
                else if(yaxis == true){ ourObj.current.rotation.y += speed}
                else  ourObj.current.rotation.z += speed
            }
        }
        function render (){
            spin(xro, true, false, false);
            spin(yro, false, true, false);
            spin(zro, false, false, true);
            requestAnimationFrame(render);
            // Rotate the objects indefinitely
            // if(ourObj.current&&ourObj.current.rotation){
            //     ourObj.current.rotation.y += .03 
            //     ourObj.current.rotation.z += .03
            // }
            
            effect.render(scene, camera);
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
