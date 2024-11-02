class ConfigManager {
    constructor(scene, camera) {
        // Singleton
        if (ConfigManager.instance) {
            return ConfigManager.instance;
        }
        ConfigManager.instance = this;

        this.scene = scene;
        this.camera = camera;

        // Configuration
        this.gui = new lil.GUI();
        this.params = {
            debugMode: false,
        };

        this.redColor = new THREE.Color().setHex(0xff0000);
        this.greenColor = new THREE.Color().setHex(0x00ff00);
        this.blueColor = new THREE.Color().setHex(0x0000ff);

        // DebugMode
        this.axesHelper = new THREE.AxesHelper(100);
        const color = new THREE.Color();
        const array = this.axesHelper.geometry.attributes.color.array;
        color.set(this.redColor);
        color.toArray(array, 0);
        color.toArray(array, 3);
        color.set(this.greenColor);
        color.toArray(array, 6);
        color.toArray(array, 9);
        color.set(this.blueColor);
        color.toArray(array, 12);
        color.toArray(array, 15);
        this.axesHelper.geometry.attributes.color.needsUpdate = true;
    }

    toggleDebugMode(debugMode) {
        if (debugMode) {
            this.scene.add(this.axesHelper);
        } else {
            this.scene.remove(this.axesHelper);
        }
    }

    initGUI() {
        this.gui
            .add(this.params, "debugMode")
            .name("Debug Mode")
            .onChange((value) => {
                this.toggleDebugMode(value);
            });
    }
}
