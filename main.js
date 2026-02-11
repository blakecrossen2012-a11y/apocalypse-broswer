import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { PointerLockControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/PointerLockControls.js";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.y = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(50, 100, 50);
scene.add(light);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000),
  new THREE.MeshLambertMaterial({ color: 0x228b22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Buildings
function spawnBuilding(x, z, color) {
  const building = new THREE.Mesh(
    new THREE.BoxGeometry(40, 60, 40),
    new THREE.MeshLambertMaterial({ color })
  );
  building.position.set(x, 30, z);
  scene.add(building);
}

spawnBuilding(100, 100, 0xaa4444);
spawnBuilding(-120, 50, 0x4444aa);
spawnBuilding(60, -140, 0xaaaa44);

// Controls
const controls = new PointerLockControls(camera, document.body);

document.getElementById("startBtn").addEventListener("click", () => {
  controls.lock();
});

controls.addEventListener("lock", () => {
  document.getElementById("startMenu").style.display = "none";
});

controls.addEventListener("unlock", () => {
  document.getElementById("startMenu").style.display = "flex";
});

// Movement
const keys = {};
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

function move() {
  const speed = 0.6;
  if (keys["w"]) controls.moveForward(speed);
  if (keys["s"]) controls.moveForward(-speed);
  if (keys["a"]) controls.moveRight(-speed);
  if (keys["d"]) controls.moveRight(speed);
}

// Loop
function animate() {
  requestAnimationFrame(animate);
  if (controls.isLocked) move();
  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
