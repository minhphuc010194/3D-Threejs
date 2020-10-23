import React,{useRef, useEffect} from 'react';
import * as THREE from 'three';
import {TimelineMax, Expo} from 'gsap/all';
// import three from 'three';

export default function SpinningCube(props) {
    const {width, height} = props;
    const anchor = useRef("anchor");

    useEffect(()=>{
        const scene = new THREE.Scene(),
            camera = new THREE.PerspectiveCamera(75, width/height, 2.4, 1000),
            renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setClearColor("#e5e5e5")
        renderer.setSize(width, height);
        anchor.current.appendChild(renderer.domElement);
        const geometry = new THREE.BoxGeometry(1,4,4),
              material = new THREE.MeshLambertMaterial({color: 0xffcc00}),
              cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        const light = new THREE.PointLight(0xFFFFFF, 1, 500)
        light.position.set(10,0,25);
        scene.add(light)
        camera.position.z = 20;
        
        function gameLoop(){
            requestAnimationFrame(gameLoop);
            // cube.position.set(2,2,2)

            // cube.rotation.x += 0.1;
            // cube.rotation.y += 0.1;

            renderer.render(scene, camera);
            
        }
        gameLoop();
        let tl = new TimelineMax().delay(.5);
        tl.to(cube.scale, 1, {x: 2, ease: Expo.easeOut});
        tl.to(cube.scale, .5, {x: .5, ease: Expo.easeOut});
        tl.to(cube.position, .5, {x: 2, ease: Expo.easeOut});
        tl.to(cube.rotation, .5, {y: Math.PI*.5, ease: Expo.easeOut})
        
    },[])
    return (
        <div ref={anchor} style={{width, height, margin:"0 auto"}} />
    )
}
