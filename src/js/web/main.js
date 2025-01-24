import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js";

// Grab the canvas from our HTML
const canvas = document.getElementById("canvas");
const section = canvas.parentElement;

// Create a renderer that uses this canvas
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
});

// Create a scene
const scene = new THREE.Scene();

// Create a camera (FOV, aspect ratio, near/far clipping planes)
const camera = new THREE.PerspectiveCamera(
    75,
    section.clientWidth / section.clientHeight,
    0.1,
    1000
);
camera.position.z = 3; // Move camera back so we can see the cube

// Resize function to keep the canvas responsive
function resizeCanvas() {
    const computedStyle = window.getComputedStyle(section);
    const padding = computedStyle.padding;

    // Convert em to pixels
    const paddingPixels = parseFloat(padding);

    const width = section.clientWidth - paddingPixels * 2;
    // const height = section.clientHeight - paddingPixels * 2;
    const height = width / 2;

    // Set renderer dimensions to match the parent section
    renderer.setSize(width, height);

    // Update camera aspect ratio
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

// Initial resize
resizeCanvas();

// Create a box geometry and a simple material
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

// Add the cube to the scene
scene.add(cube);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Render the scene from the perspective of the camera
    renderer.render(scene, camera);
}

animate();

// Make the scene responsive
window.addEventListener("resize", resizeCanvas);
