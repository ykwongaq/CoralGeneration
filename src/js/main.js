import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import DynamicGUI from "./dynamicGUI.js";

const INIT_CAMERA_POSITION = { x: 10, y: 10, z: 10 };
const INIT_CAMERA_LOOK_AT = { x: 0, y: 0, z: 0 };

function main() {
    // Create a scene
    const scene = new THREE.Scene();

    // Setup a camera
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(
        INIT_CAMERA_POSITION.x,
        INIT_CAMERA_POSITION.y,
        INIT_CAMERA_POSITION.z
    );
    camera.lookAt(
        INIT_CAMERA_LOOK_AT.x,
        INIT_CAMERA_LOOK_AT.y,
        INIT_CAMERA_LOOK_AT.z
    );

    // Setup renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Mouse Control
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
    };

    // Ambient Light
    const Ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(Ambient);

    // Directional Light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // User control GUI
    const gui = new DynamicGUI(scene);
    gui.createGUI();

    // // Render Loop
    function animate() {
        controls.update();
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);

    // Handle window resize event
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

main();

// import * as THREE from "three";
// import { Line2 } from "three/examples/jsm/lines/Line2.js";
// import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
// import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

// // Scene, Camera, and Renderer
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
// );
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Define line geometry (positions for the line)
// const positions = [
//     -1,
//     0,
//     0, // Start point (x, y, z)
//     1,
//     0,
//     0, // End point (x, y, z)
// ];

// const lineGeometry = new LineGeometry(); // Use LineGeometry for Line2
// lineGeometry.setPositions(positions);

// // Define the material with adjustable lineWidth
// const lineMaterial = new LineMaterial({
//     color: 0xff0000, // Red color
//     linewidth: 0.05, // Line width in world units
//     dashed: false, // Solid line (not dashed)
// });

// // Set the screen resolution for the material (required for correct scaling)
// lineMaterial.resolution.set(window.innerWidth, window.innerHeight);

// // Create the Line2 object
// const line = new Line2(lineGeometry, lineMaterial);
// scene.add(line);

// // Position the camera
// camera.position.z = 5;

// // Animation loop
// function animate() {
//     requestAnimationFrame(animate);
//     renderer.render(scene, camera);
// }
// animate();
