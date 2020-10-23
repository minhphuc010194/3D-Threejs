import React,{useRef, useEffect} from 'react';
import * as THREE from 'three';
import {TimelineMax, Expo} from 'gsap/all';
import './spinningcube.css';

export default function SpinningCube(props) {
    const {width, height} = props;
    const anchor = useRef("anchor");

    useEffect(()=>{
        const scene = new THREE.Scene(),
            camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000),
            renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setClearColor("#e5e5e5")
        renderer.setSize(width, height);
        anchor.current.appendChild(renderer.domElement);
        const geometry = new THREE.BoxGeometry(1,1,1),
              material = new THREE.MeshLambertMaterial({color: 0xF7F7F7}),
              cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        let meshX = -10;
        for(let i = 0; i < 15 ; i++){
            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = (Math.random() - 0.5)*10;
            mesh.position.y = (Math.random() - 0.5)*10;
            mesh.position.z = (Math.random() - 0.5)*10;
            scene.add(mesh);
            meshX+=1;
        }
        
        // den pin
        const light = new THREE.PointLight(0xFFFFFF, 1, 1000)
        light.position.set(0,0,0);
        scene.add(light);
        
        const light1 = new THREE.PointLight(0xFFFFFF, 2, 1000)
        light1.position.set(0,0,25);
        scene.add(light1);

        camera.position.z = 7;

        const raycaster = new THREE.Raycaster();  //Bắng tia chiếu ánh sáng theo chiều camera
        const mouse = new THREE.Vector2(); // Diem chuot


        
        function onMouseMove(e){
            e.preventDefault();
            mouse.x = (e.clientX / window.innerWidth) *2 -1;
            mouse.y = - (e.clientY / window.innerHeight) *2 +1;

            raycaster.setFromCamera(mouse, camera);
            let intersects = raycaster.intersectObjects(scene.children, true); // diem giao
            for( let i = 0; i < intersects.length; i++){
                let tl = new TimelineMax();
                tl.to(intersects[i].object.scale, 1, {x: 2, ease: Expo.easeOut});
                tl.to(intersects[i].object.scale, .5, {x: .5, ease: Expo.easeOut});
                tl.to(intersects[i].object.position, .5, {x: 2, ease: Expo.easeOut});
                tl.to(intersects[i].object.rotation, .5, {y: Math.PI*.5, ease: Expo.easeOut});

            }
        }
        function gameLoop(){
            requestAnimationFrame(gameLoop);
            // cube.position.set(2,2,2)

            // cube.rotation.x += 0.1;
            // cube.rotation.y += 0.1;

            renderer.render(scene, camera);
            
        }
        gameLoop();
        
    
        window.addEventListener('mousemove', onMouseMove);        
    },[])
    return (
        <>
            <h1>ThreeJS Tiny!</h1>
            <div ref={anchor} style={{width, height, margin:"0 auto"}} />
        </>
        
    )
}
