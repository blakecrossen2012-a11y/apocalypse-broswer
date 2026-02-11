// main.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js';

const canvas = document.getElementById('gameCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Basic terrain
const planeGeometry = new THREE.PlaneGeometry(500,500);
const planeMaterial = new THREE.MeshLambertMaterial({ color:0x228B22 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI/2;
scene.add(plane);

// Light
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(10,50,10);
scene.add(light);

// Player
const player = { x:0, y:1.8, z:0, health:100 };
camera.position.set(player.x, player.y, player.z);

// Movement
const keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// Mouse camera
let mouseDown = false;
let prevX=0, prevY=0;
document.addEventListener('mousedown', e=>mouseDown=true);
document.addEventListener('mouseup', e=>mouseDown=false);
document.addEventListener('mousemove', e=>{
    if(mouseDown){
        camera.rotation.y -= (e.movementX || 0)/500;
        camera.rotation.x -= (e.movementY || 0)/500;
    }
});

// WebSocket
const ws = new WebSocket(`wss://${window.location.host}`);
ws.onopen = () => console.log('Connected to server!');
ws.onmessage = e => console.log('Server:', e.data);

// Game loop
function animate(){
    requestAnimationFrame(animate);

    const speed = 0.5;
    const forward = new THREE.Vector3(Math.sin(camera.rotation.y),0,Math.cos(camera.rotation.y));
    const right = new THREE.Vector3(Math.sin(camera.rotation.y+Math.PI/2),0,Math.cos(camera.rotation.y+Math.PI/2));

    if(keys['w']) { player.x += forward.x*speed; player.z += forward.z*speed; }
    if(keys['s']) { player.x -= forward.x*speed; player.z -= forward.z*speed; }
    if(keys['a']) { player.x -= right.x*speed; player.z -= right.z*speed; }
    if(keys['d']) { player.x += right.x*speed; player.z += right.z*speed; }

    camera.position.set(player.x, player.y, player.z);

    renderer.render(scene, camera);

    // Send player update to server
    if(ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type:'update', player }));
}

animate();

// Start menu
document.getElementById('startBtn').addEventListener('click', ()=>{
    document.getElementById('menu').style.display='none';
});





