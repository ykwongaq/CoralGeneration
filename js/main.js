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

    // User Configuration
    const configManager = new ConfigManager(scene, camera);
    configManager.initGUI();

    // Mouse Control
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
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

    // Create a cube
    const cube = new Cube();
    scene.add(cube.getMesh());

    // Render Loop
    function animate() {
        controls.update();
        cube.rotate(0.01);
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
