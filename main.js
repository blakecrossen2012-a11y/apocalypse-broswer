// === THREEJS SETUP ===
const canvas = document.getElementById('gameCanvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === LIGHTS ===
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(20, 40, 20);
scene.add(light);

// === TERRAIN ===
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(1000,1000),
  new THREE.MeshStandardMaterial({color:0x228B22})
);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

// === BUILDINGS ===
const buildings = [];
for(let i=0;i<50;i++){
  const b = new THREE.Mesh(
    new THREE.BoxGeometry(20,20+Math.random()*40,20),
    new THREE.MeshStandardMaterial({color: Math.random()*0xffffff})
  );
  b.position.set(Math.random()*800-400, b.geometry.parameters.height/2, Math.random()*800-400);
  scene.add(b);
  buildings.push(b);
}

// === PLAYER ===
const player = {
  pos: new THREE.Vector3(0,2,0),
  health:100,
  food:100,
  energy:100,
  speed:0.7,
  hotbarIndex:0,
  inventory:['knife','water','beef jerky']
};

// === INPUT ===
const keys = {};
document.addEventListener('keydown', e=>keys[e.key.toLowerCase()]=true);
document.addEventListener('keyup', e=>keys[e.key.toLowerCase()]=false);

// === POINTER LOCK CAMERA ===
canvas.addEventListener('click', ()=>canvas.requestPointerLock());
let yaw=0,pitch=0;
document.addEventListener('mousemove', e=>{
  if(document.pointerLockElement===canvas){
    yaw -= e.movementX*0.002;
    pitch -= e.movementY*0.002;
    pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, pitch));
  }
});

// === HOTBAR ===
function updateHotbar(){
  const hotbarDiv = document.getElementById('hotbar');
  hotbarDiv.innerHTML = player.inventory.map((item,i)=>i===player.hotbarIndex ? `[${item}]` : item).join(' | ');
}
updateHotbar();
document.addEventListener('keydown', e=>{
  if(e.key>='1' && e.key<='9') player.hotbarIndex = parseInt(e.key)-1;
  if(e.key==='e') toggleInventory();
});

// === INVENTORY ===
let inventoryOpen = false;
function toggleInventory(){inventoryOpen=!inventoryOpen; console.log("Inventory",inventoryOpen);}

// === ANIMATE ===
function animate(){
  requestAnimationFrame(animate);

  let dir = new THREE.Vector3();
  if(keys['w']) dir.z -= 1;
  if(keys['s']) dir.z += 1;
  if(keys['a']) dir.x -= 1;
  if(keys['d']) dir.x += 1;
  dir.applyAxisAngle(new THREE.Vector3(0,1,0),yaw).normalize().multiplyScalar(player.speed);
  player.pos.add(dir);

  camera.position.set(player.pos.x,player.pos.y+5,player.pos.z+12);
  camera.lookAt(player.pos);

  document.getElementById('health').innerText = player.health;
  document.getElementById('food').innerText = player.food;
  document.getElementById('energy').innerText = player.energy;
  updateHotbar();

  renderer.render(scene,camera);
}
animate();
