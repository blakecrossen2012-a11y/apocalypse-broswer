import * as THREE from "/node_modules/three/build/three.module.js";
import { PointerLockControls } from "/node_modules/three/examples/jsm/controls/PointerLockControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.y = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(50, 100, 50);
scene.add(light);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000),
  new THREE.MeshLambertMaterial({ color: 0x228b22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

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

function animate() {
  requestAnimationFrame(animate);
  if (controls.isLocked) move();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
