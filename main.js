// ===== SCENE SETUP =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ===== LIGHT =====
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(50, 100, 50);
scene.add(light);

// ===== GROUND =====
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000),
  new THREE.MeshLambertMaterial({ color: 0x228b22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// ===== BUILDINGS =====
function building(x, z, color) {
  const b = new THREE.Mesh(
    new THREE.BoxGeometry(40, 60, 40),
    new THREE.MeshLambertMaterial({ color })
  );
  b.position.set(x, 30, z);
  scene.add(b);
}

building(100, 100, 0xaa4444);
building(-120, 50, 0x4444aa);
building(60, -140, 0xaaaa44);

// ===== PLAYER =====
camera.position.set(0, 10, 0);

const controls = new THREE.PointerLockControls(camera, document.body);
scene.add(controls.getObject());

// ===== START BUTTON =====
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", function () {
  controls.lock();
});

controls.addEventListener("lock", function () {
  document.getElementById("startMenu").style.display = "none";
  document.getElementById("gameUI").style.display = "block";
});

controls.addEventListener("unlock", function () {
  document.getElementById("startMenu").style.display = "flex";
});

// ===== MOVEMENT =====
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

function move() {
  const speed = 1;

  if (keys["w"]) controls.moveForward(speed);
  if (keys["s"]) controls.moveForward(-speed);
  if (keys["a"]) controls.moveRight(-speed);
  if (keys["d"]) controls.moveRight(speed);
}

// ===== LOOP =====
function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked) {
    move();
  }

  renderer.render(scene, camera);
}

animate();

// ===== RESIZE FIX =====
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
