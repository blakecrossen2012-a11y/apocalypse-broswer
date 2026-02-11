// Use your live Render WebSocket URL
const ws = new WebSocket(`wss://apocalypse-broswer.onrender.com`);

ws.onopen = () => console.log("Connected to server!");
ws.onmessage = e => {
    const msgDiv = document.getElementById('messages');
    msgDiv.innerHTML += e.data + "<br>";
};
ws.onclose = () => {
    console.log("Disconnected from server. Reconnecting in 2s...");
    setTimeout(() => {
        location.reload(); // simple reconnect
    }, 2000);
};

// Chat send
const chatInput = document.getElementById('chatInput');
chatInput.addEventListener('keypress', e => {
    if (e.key === 'Enter' && ws.readyState === WebSocket.OPEN) {
        ws.send(chatInput.value);
        chatInput.value = '';
    }
});

// Three.js 3D setup
const canvas = document.getElementById('gameCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(50, 100, 50);
scene.add(light);

// Ground
const groundMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const groundGeo = new THREE.PlaneGeometry(1000, 1000);
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI/2;
scene.add(ground);

// Player
const player = new THREE.Mesh(
    new THREE.BoxGeometry(1,2,1),
    new THREE.MeshStandardMaterial({ color: 0x0000ff })
);
player.position.set(0,1,0);
scene.add(player);

// Controls
const keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// Main animation loop
function animate() {
    requestAnimationFrame(animate);

    // Movement: W forward, S backward, A left, D right
    const speed = 0.3;
    if (keys['w']) player.position.z -= speed;
    if (keys['s']) player.position.z += speed;
    if (keys['a']) player.position.x -= speed;
    if (keys['d']) player.position.x += speed;

    // Camera follows player
    camera.position.set(player.position.x, player.position.y + 5, player.position.z + 10);
    camera.lookAt(player.position);

    renderer.render(scene, camera);
}
animate();

