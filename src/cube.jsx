import React,{useRef, useEffect} from 'react'
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default function Cube(props) {
    const {width, height} = props;
    const anchor = useRef();

    useEffect(()=>{
        
        const scene = new THREE.Scene(),
            camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000),
            renderer = new THREE.WebGLRenderer();
        
        anchor.current.appendChild(renderer.domElement);

        window.addEventListener('resize', function(){
            renderer.setSize(width, height);
            camera.aspect = width/height;
            camera.updateProjectionMatrix();
        })
        let controls = new OrbitControls(camera, renderer.domElement)
        const geometry = new THREE.BoxGeometry(1,1,1),
              material = new THREE.MeshBasicMaterial({color: 0x00ff00}),
              cube = new THREE.Mesh(geometry, material);
              scene.add(cube);
              camera.position.z = 2;
        function gameLoop(){
            requestAnimationFrame(gameLoop);
            // cube.rotation.x += 0.03;
            // cube.rotation.y += 0.03;
            renderer.render(scene, camera);
        }
        gameLoop();
    },[])
    return (
        <div ref={anchor} style={{width, height, margin: "0 auto"}}>
        </div>
    )
}
