import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155/build/three.module.js';

// Canvas & scene
const canvas = document.getElementById("gameCanvas");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Ground
const groundGeo = new THREE.PlaneGeometry(200, 200);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI/2;
scene.add(ground);

// Lights
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(50, 100, 50);
scene.add(sun);

// Player
const player = { x:0, y:0, z:0, health:100, food:100, water:100 };
const speed = 0.2;
const keys = {};

// Listen to keys
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// Mouse lock
canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
canvas.onclick = () => canvas.requestPointerLock();

// Mouse look
let yaw = 0, pitch = 0;
document.addEventListener('mousemove', e => {
    if(document.pointerLockElement === canvas) {
        yaw -= e.movementX * 0.002;
        pitch -= e.movementY * 0.002;
        pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, pitch));
    }
});

// WebSocket for multiplayer (fixed for Render)
const ws = new WebSocket("wss://apocalypse-broswer.onrender.com");
ws.onopen = () => console.log("Connected to server!");
ws.onmessage = e => console.log("Received:", e.data);
ws.onclose = () => console.log("Disconnected from server");

// Basic animation loop
function animate() {
    requestAnimationFrame(animate);

    // Movement: W forward, S back, A left, D right
    if(keys['w']) player.z -= speed * Math.cos(yaw);
    if(keys['s']) player.z += speed * Math.cos(yaw);
    if(keys['a']) player.x -= speed * Math.sin(yaw);
    if(keys['d']) player.x += speed * Math.sin(yaw);

    camera.position.set(player.x, 5, player.z + 10);
    camera.lookAt(player.x, 0, player.z);

    renderer.render(scene, camera);
}
animate();



