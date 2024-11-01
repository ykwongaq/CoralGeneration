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

        // DebugMode
        this.axesHelper = new THREE.AxesHelper(100);
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
