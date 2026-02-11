import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js";
import { PointerLockControls } from "https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/PointerLockControls.js";

// === Scene Setup ===
let scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Terrain ===
let terrain = new THREE.Mesh(new THREE.PlaneGeometry(500,500,50,50), new THREE.MeshPhongMaterial({color:0x228B22}));
terrain.rotation.x = -Math.PI/2;
scene.add(terrain);

// === Light ===
let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(50,100,50);
scene.add(light);

// === Controls ===
let controls = new PointerLockControls(camera, document.body);
document.getElementById("startBtn").onclick = () => {
  controls.lock();
  document.getElementById("startMenu").style.display="none";
  document.getElementById("gameUI").style.display="block";
};

// === Player ===
let player = {x:0,z:0,y:2,health:100,food:100,energy:100,speed:0.5};

// === Movement ===
let keys={};
document.addEventListener("keydown",e=>keys[e.key.toLowerCase()]=true);
document.addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);

function movePlayer(){
  if(keys["w"]){ player.z -= player.speed; }
  if(keys["s"]){ player.z += player.speed; }
  if(keys["a"]){ player.x -= player.speed; }
  if(keys["d"]){ player.x += player.speed; }
  camera.position.set(player.x,player.y,player.z);
}

// === Loot & Buildings ===
let loot = [], buildings = [];
function spawnBuilding(x,z,color=0x888888){
  let b = new THREE.Mesh(new THREE.BoxGeometry(20,20,20), new THREE.MeshPhongMaterial({color}));
  b.position.set(x,10,z);
  scene.add(b); buildings.push(b);
}
function spawnLoot(x,z,type){
  let l = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshPhongMaterial({color:0xffd700}));
  l.position.set(x,0.5,z); scene.add(l);
  loot.push({mesh:l,type});
}
for(let i=-100;i<100;i+=40){ spawnBuilding(i,0,0xff4444); spawnLoot(i,5,"water"); }

// === Zombies ===
let zombies=[];
function spawnZombie(x,z){
  let zmesh = new THREE.Mesh(new THREE.BoxGeometry(1.5,2,1.5), new THREE.MeshPhongMaterial({color:0x00ff00}));
  zmesh.position.set(x,1,z); scene.add(zmesh);
  zombies.push({mesh:zmesh,x,z});
}
for(let i=-50;i<50;i+=20){ spawnZombie(i,20); }

// === WebSocket Multiplayer ===
let ws = new WebSocket("ws://localhost:8080");
ws.onopen=()=>console.log("Connected to server!");
ws.onmessage=e=>{
  let data = JSON.parse(e.data);
  let msg = document.createElement("div");
  msg.textContent = `${data.name}: ${data.message}`;
  document.getElementById("messages").appendChild(msg);
};

// === Chat ===
document.getElementById("chatInput").addEventListener("keypress",e=>{
  if(e.key==="Enter" && ws.readyState===WebSocket.OPEN){
    ws.send(JSON.stringify({name:"Player",message:e.target.value}));
    e.target.value="";
  }
});

// === Render Loop ===
function animate(){
  requestAnimationFrame(animate);
  movePlayer();
  renderer.render(scene,camera);
}
animate();




