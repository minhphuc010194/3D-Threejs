import React,{useRef, useEffect} from 'react'
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {ColladaLoader} from "three/examples/jsm/loaders/ColladaLoader";
import Stats from "three/examples/jsm/libs/stats.module";
export default function LoaderCollada(props) {
    const {width, height} = props;
    const anchor = useRef();

    useEffect(()=>{
        var container, stats, clock, controls;
        var camera, scene, renderer, mixer;

        init();
        // animate();
        function init() {

            container = anchor.current;

            camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 1000 );
            camera.position.set( 15, 10, - 15 );

            scene = new THREE.Scene();

            clock = new THREE.Clock();

            // collada

            var loader = new ColladaLoader();
            loader.load( require('./models/collada/stormtrooper/stormtrooper.dae'), function ( collada ) {

                var animations = collada.animations;
                var avatar = collada.scene;

                avatar.traverse( function ( node ) {

                    if ( node.isSkinnedMesh ) {

                        node.frustumCulled = false;

                    }

                } );

                mixer = new THREE.AnimationMixer( avatar );
                mixer.clipAction( animations[ 0 ] ).play();

                scene.add( avatar );

            } );

            //

            var gridHelper = new THREE.GridHelper( 10, 20, 0x888888, 0x444444 );
            scene.add( gridHelper );

            //

            var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
            scene.add( ambientLight );

            var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
            scene.add( camera );
            camera.add( pointLight );

            //

            renderer = new THREE.WebGLRenderer( { antialias: true } );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );
            container.appendChild( renderer.domElement );

            //

            controls = new OrbitControls( camera, renderer.domElement );
            controls.screenSpacePanning = true;
            controls.minDistance = 5;
            controls.maxDistance = 40;
            controls.target.set( 0, 2, 0 );
            controls.update();

            //

            stats = new Stats();
            container.appendChild( stats.dom );

            //

            window.addEventListener( 'resize', onWindowResize, false );

        }
        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );

        }

        function animate() {

            requestAnimationFrame( animate );

            render();
            stats.update();

        }

        function render() {

            var delta = clock.getDelta();

            if ( mixer !== undefined ) {

                mixer.update( delta );

            }

            renderer.render( scene, camera );

        }

    },[])
    return (
        <>
            <div ref={anchor} style={{width, height, margin: "0 auto"}}>
            hi world
            </div>
        </>
    )
}
