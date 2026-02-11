// main.js

// ===== BASIC SETUP =====
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

// ===== LIGHTING =====
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(50, 100, 50);
scene.add(light);

// ===== TERRAIN =====
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000),
  new THREE.MeshLambertMaterial({ color: 0x228b22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// ===== BUILDINGS =====
function spawnBuilding(x, z, color) {
  const building = new THREE.Mesh(
    new THREE.BoxGeometry(30, 40, 30),
    new THREE.MeshLambertMaterial({ color })
  );
  building.position.set(x, 20, z);
  scene.add(building);
}

spawnBuilding(100, 100, 0xaa4444);
spawnBuilding(-120, 50, 0x4444aa);
spawnBuilding(60, -140, 0xaaaa44);

// ===== PLAYER =====
const player = {
  x: 0,
  y: 5,
  z: 0,
  speed: 1
};

camera.position.set(player.x, player.y, player.z);

// ===== POINTER LOCK =====
const controls = new THREE.PointerLockControls(camera, document.body);

document.getElementById("startBtn").addEventListener("click", () => {
  controls.lock();
});

controls.addEventListener("lock", () => {
  document.getElementById("startMenu").style.display = "none";
  document.getElementById("gameUI").style.display = "block";
});

controls.addEventListener("unlock", () => {
  document.getElementById("startMenu").style.display = "flex";
  document.getElementById("gameUI").style.display = "none";
});

// ===== MOVEMENT =====
const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

function movePlayer() {
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  const right = new THREE.Vector3();
  right.crossVectors(direction, new THREE.Vector3(0, 1, 0));

  if (keys["w"]) {
    player.x += direction.x * player.speed;
    player.z += direction.z * player.speed;
  }
  if (keys["s"]) {
    player.x -= direction.x * player.speed;
    player.z -= direction.z * player.speed;
  }
  if (keys["a"]) {
    player.x -= right.x * player.speed;
    player.z -= right.z * player.speed;
  }
  if (keys["d"]) {
    player.x += right.x * player.speed;
    player.z += right.z * player.speed;
  }

  camera.position.set(player.x, player.y, player.z);
}

// ===== WEBSOCKET (Render Safe) =====
const ws = new WebSocket(
  window.location.protocol === "https:"
    ? "wss://" + window.location.host
    : "ws://" + window.location.host
);

ws.onopen = () => console.log("Connected to server");

// ===== LOOP =====
function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked) {
    movePlayer();
  }

  renderer.render(scene, camera);
}

animate();

// ===== RESIZE FIX =====
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
