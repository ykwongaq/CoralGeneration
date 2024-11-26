import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import DynamicGUI from "./dynamicGUI.js";

const INIT_CAMERA_POSITION = { x: 10, y: 10, z: 10 };
const INIT_CAMERA_LOOK_AT = { x: 0, y: 0, z: 0 };

function main() {
    // Create a scene
    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x87adc4);
    scene.fog = new THREE.Fog(0x87adc4, 20, 50);

    // Setup a camera
    const camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        200
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
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Mouse Control
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
    };
    controls.maxPolarAngle = Math.PI * 0.5;
    // controls.maxDistance = camera.far / 1.9;
    controls.maxDistance = camera.far * 2;
    controls.minDistance = camera.near * 2;

    // // Ambient Light
    // const Ambient = new THREE.AmbientLight(0xffffff, 0.5);
    // scene.add(Ambient);

    // // Directional Light
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // directionalLight.position.set(10, 10, 10);
    // scene.add(directionalLight);

    let pointLight = new THREE.PointLight(0xffffff, 150);
    let hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 2);
    pointLight.position.set(20, 50, 20);
    pointLight.castShadow = true;
    scene.add(pointLight, hemisphereLight);
    let seabedTexture = new THREE.TextureLoader().load("./static/seabed.jpg");
    seabedTexture.wrapS = seabedTexture.wrapT = THREE.RepeatWrapping;
    seabedTexture.repeat.set(50, 50);
    let seabedGeometry = new THREE.PlaneGeometry(1000, 1000);
    let seabedMaterial = new THREE.MeshPhongMaterial({ map: seabedTexture });
    let seabed = new THREE.Mesh(seabedGeometry, seabedMaterial);
    seabed.position.y = 0;
    seabed.rotation.x = -Math.PI / 2;
    seabed.receiveShadow = true;
    scene.add(seabed);

    renderer.gammaOutput = true;
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;

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
