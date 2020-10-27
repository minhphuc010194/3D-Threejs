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
    const ourObj = useRef();
    const banh_ = useRef();
    const de_banh_ = useRef();
    const anchor = useRef();
    useEffect(()=>{
        //Create the Three.Scene
        const scene = new THREE.Scene(),
        //create a new Prespective Camera
            camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 2000);
            camera.position.set(0,300,300);
            // camera.up = new THREE.Vector3(0,1,0);
            // camera.lookAt(new THREE.Vector3(0,300,0));
            displaygui();
        // Add a light
        let light = new THREE.PointLight(0xFFFFFF, 4, 1000);
        let light1 = new THREE.PointLight(0xFFFFFF, 3, 1000);
        let light2 = new THREE.PointLight(0xFFFFFF, 2, 1000);
            light.position.set(500,500,500);
            light1.position.set(-500,500,-500);
            light2.position.set(-500,500,500);
            scene.add(light);
            scene.add(light1);
            scene.add(light2);

        // Create a Full Screen WebGL Renderer   
        const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
            renderer.setClearColor("#DDDDDD");
            renderer.setSize(width, height);
            anchor.current.appendChild(renderer.domElement);
        //Make sure the project is responsive based on window resizing EVENT
        window.addEventListener('resize', ()=>{
            renderer.setSize(width, height);
            camera.aspect = width/height;

            camera.updateProjectionMatrix();
        });
        //CONTROLS
        let controls = new OrbitControls(camera, renderer.domElement);
        // De banh
        const geometry = new THREE.BoxGeometry(300,10,300);
        const material = new THREE.MeshLambertMaterial({color: 0x313541}),
              de_banh = new THREE.Mesh(geometry, material);
              de_banh.position.y = 0;
              de_banh_.current = de_banh;
              scene.add(de_banh_.current);
        // Banh
        const geometry1 = new THREE.CylinderGeometry(100,100,100,50);
        const material1 = new THREE.MeshLambertMaterial({color: 0xa0ecf7}),
            banh = new THREE.Mesh(geometry1, material1);
            banh.position.y = 55;
            banh_.current = banh;
            scene.add(banh_.current);
        
        //EFECT
        let effect = new AnaglyphEffect(renderer);
        effect.setSize(width, height);
        
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
                object.position.y = 105;
                object.rotation.x = 0;
                object.scale.set(0.5,0.5,0.5);
                ourObj.current = object;

                let tl = new TimelineMax();
                tl.from(ourObj.current.scale, 2,{y: 0, x:0, z:0, ease: Expo.easeOut});
            })

        });
        let xro,yro, zro, speed_global, effect_;
        function displaygui(){
            let gui = new GUI();
            
            let speed = 0.01;
            let jar;
            let parameters ={
                a: "Banh kem",
                b: "Select",
                c: true,
                d: "#0000ff",
                e: 1, f:1,g:1,
                h: 1, i:1, j: 1,
                k: 1, l: 1, m:1,
                x: false, y:false, z:false,
                n:"",
                o:"",
                sp:0.1,
                ef:false
            }
            gui.add(parameters,'a').name('Name');
            let model = gui.add(parameters,'c').name('Show Model');
            let obj_select = gui.add(parameters,'b',["Select","Iron-Man","De banh","Banh"]).name('Geomertry');
            
            let color = gui.addColor(parameters, 'd').name('Color');
            let dimen = gui.addFolder('Dimension');
            let xdimen = dimen.add(parameters,'e').min(0).max(20).step(speed).name('X-Axis');
            let ydimen = dimen.add(parameters,'f').min(0).max(20).step(speed).name('Y-Axis');
            let zdimen = dimen.add(parameters,'g').min(0).max(20).step(speed).name('Z-Axis');

            let posit = gui.addFolder('Position');

            let xpotsit = posit.add(parameters,'h').min(-200).max(200).step(speed).name('X-Axis');
            let ypotsit = posit.add(parameters,'i').min(-200).max(200).step(speed).name('Y-Axis');
            let zpotsit = posit.add(parameters,'j').min(-200).max(200).step(speed).name('Z-Axis');
    
            let rotat = gui.addFolder('Rotation');

            let xspin = rotat.add(parameters,'k').min(-20).max(20).step(speed).name('X-Axis');
            let yspin = rotat.add(parameters,'l').min(-20).max(20).step(speed).name('Y-Axis');
            let zspin = rotat.add(parameters,'m').min(-20).max(20).step(speed).name('Z-Axis');

            let anim = gui.addFolder('Animate');
                    
            let xanim = anim.add(parameters,'x').name('X-Axis');
            let yanim = anim.add(parameters,'y').name('Y-Axis');
            let zanim = anim.add(parameters,'z').name('Z-Axis');


            obj_select.onChange((e)=>{

                if(e=="Iron-Man"){
                    model.onChange(function(jar){ourObj.current.visible = jar});

                   
                    xdimen.onChange(function(jar){ourObj.current.scale.x = jar;});
                    ydimen.onChange(function(jar){ourObj.current.scale.y = jar;});
                    zdimen.onChange(function(jar){ourObj.current.scale.z = jar;});

                    
                    xpotsit.onChange(function(jar){ourObj.current.position.x = jar;});
                    ypotsit.onChange(function(jar){ourObj.current.position.y = jar;});
                    zpotsit.onChange(function(jar){ourObj.current.position.z = jar;});

                    
                    xspin.onChange(function(jar){ourObj.current.rotation.x = jar;});
                    yspin.onChange(function(jar){ourObj.current.rotation.y = jar;});
                    zspin.onChange(function(jar){ourObj.current.rotation.z = jar;});

                    
                    xanim.onChange(function(jar){xro = jar});
                    yanim.onChange(function(jar){yro = jar});
                    zanim.onChange(function(jar){zro = jar});
                    
                }
                if(e=="De banh"){
                    model.onChange(function(jar){de_banh_.current.visible = jar});
                    
                    color.onChange(function(jar){de_banh_.current.material.color.setHex(jar.replace("#","0x"));});
                    
                    

                    xdimen.onChange(function(jar){de_banh_.current.scale.x = jar;});
                    ydimen.onChange(function(jar){de_banh_.current.scale.y = jar;});
                    zdimen.onChange(function(jar){de_banh_.current.scale.z = jar;});

                    xpotsit.onChange(function(jar){de_banh_.current.position.x = jar;});
                    ypotsit.onChange(function(jar){de_banh_.current.position.y = jar;});
                    zpotsit.onChange(function(jar){de_banh_.current.position.z = jar;});

                    xspin.onChange(function(jar){de_banh_.current.rotation.x = jar;});
                    yspin.onChange(function(jar){de_banh_.current.rotation.y = jar;});
                    zspin.onChange(function(jar){de_banh_.current.rotation.z = jar;});

                    xanim.onChange(function(jar){xro = jar});
                    yanim.onChange(function(jar){yro = jar});
                    zanim.onChange(function(jar){zro = jar});
                }
                if(e=="Banh"){
                    
                    model.onChange(function(jar){banh_.current.visible = jar});
                    color.onChange(function(jar){banh_.current.material.color.setHex(jar.replace("#","0x"));});
                    
                    

                    xdimen.onChange(function(jar){banh_.current.scale.x = jar;});
                    ydimen.onChange(function(jar){banh_.current.scale.y = jar;});
                    zdimen.onChange(function(jar){banh_.current.scale.z = jar;});

                    xpotsit.onChange(function(jar){banh_.current.position.x = jar;});
                    ypotsit.onChange(function(jar){banh_.current.position.y = jar;});
                    zpotsit.onChange(function(jar){banh_.current.position.z = jar;});

                    xspin.onChange(function(jar){banh_.current.rotation.x = jar;});
                    yspin.onChange(function(jar){banh_.current.rotation.y = jar;});
                    zspin.onChange(function(jar){banh_.current.rotation.z = jar;});

                    xanim.onChange(function(jar){xro = jar});
                    yanim.onChange(function(jar){yro = jar});
                    zanim.onChange(function(jar){zro = jar});
                }

            })
            let effect_check = gui.add(parameters,'ef').name('Effect');
                effect_check.onChange((e)=>{effect_=e});

            let speed_local = gui.add(parameters,'sp').min(0).max(10).step(speed).name('Speed');
                speed_local.onChange(function(jar){speed_global = jar});

                gui.add(parameters, 'n', [1,2,3,4,5]).name('Layer');
                gui.add(parameters, 'o',["Save", "Load", "Reset"]).name('Option');

                gui.open();
            
        }
        function spin(varname, xaxis, yaxis, zaxis){
            let speed = 0.01;
            if(varname == true){
                if(xaxis == true){ ourObj.current.rotation.x += speed}
                else if(yaxis == true){ ourObj.current.rotation.y += speed}
                else  ourObj.current.rotation.z += speed
            }
        }
        
        
        function render (){
            
            requestAnimationFrame(render);
            spin(xro, true, false, false);
            spin(yro, false, true, false);
            spin(zro, false, false, true);
            // Rotate the objects indefinitely
            // if(ourObj.current&&ourObj.current.rotation){
            //     ourObj.current.rotation.y += .03
            // }
            if(effect_){
                effect.render(scene, camera);
            }else{
                renderer.render(scene, camera);
            }
            
               
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
