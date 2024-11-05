class DynamicGUI {
    static DEFAULT_OBJECT = Cube.NAME;
    constructor(scene) {
        this.scene = scene;
        this.objectGenerator = new ObjectGenerator(scene);

        this.gui = new dat.GUI();

        this.params = {
            debugMode: false,
            object: DynamicGUI.DEFAULT_OBJECT,
        };
        this.parameterFolder = null;
        this.objectList = [Cube.NAME, Cylinder.NAME, FlatTree.NAME];

        // Debug Mode
        this.redColor = new THREE.Color().setHex(0xff0000);
        this.greenColor = new THREE.Color().setHex(0x00ff00);
        this.blueColor = new THREE.Color().setHex(0x0000ff);
        this.axesHelper = this.generateAxesHelper();
    }

    createGUI() {
        this.createDebugMode();
        this.createObjectSelector();
    }

    createDebugMode() {
        this.gui
            .add(this.params, "debugMode")
            .name("Debug Mode")
            .onChange((value) => {
                this.toggleDebugMode(value);
            });
    }

    updateObject() {
        const objectName = this.params.object;
        this.objectGenerator.generateObject(objectName);
    }

    createObjectSelector() {
        this.gui
            .add(this.params, "object", this.objectList)
            .name("Object")
            .onChange((objectName) => {
                this.updateFolder();
                this.updateObject();
            });
        this.updateFolder();
        this.updateObject();
    }

    toggleDebugMode(debugMode) {
        if (debugMode) {
            this.scene.add(this.axesHelper);
        } else {
            this.scene.remove(this.axesHelper);
        }

        this.objectGenerator.setDebugMode(debugMode);
        this.updateObject();
    }

    updateFolder() {
        if (this.folder) {
            this.gui.removeFolder(this.folder);
        }

        this.folder = this.gui.addFolder("Parameters");
        switch (this.params.object) {
            case Cube.NAME:
                this.generateCubeParameters();
                break;
            case Cylinder.NAME:
                this.generateCylinderParameters();
                break;
            case FlatTree.NAME:
                this.generateFlatTreeParameters();
                break;
            default:
                throw new Error("Unhandled obejct: " + this.params.object);
        }
        this.folder.open();
    }

    generateAxesHelper() {
        const axesHelper = new THREE.AxesHelper(100);
        const color = new THREE.Color();
        const array = axesHelper.geometry.attributes.color.array;
        color.set(this.redColor);
        color.toArray(array, 0);
        color.toArray(array, 3);
        color.set(this.greenColor);
        color.toArray(array, 6);
        color.toArray(array, 9);
        color.set(this.blueColor);
        color.toArray(array, 12);
        color.toArray(array, 15);
        axesHelper.geometry.attributes.color.needsUpdate = true;
        return axesHelper;
    }

    generateCubeParameters() {
        const cubeParameters = Cube.getParams();
        this.folder
            .add(cubeParameters, "width", 1, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(cubeParameters, "height", 1, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(cubeParameters, "depth", 1, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(cubeParameters, "widthSegments", 1, 10)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(cubeParameters, "heightSegments", 1, 10)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(cubeParameters, "depthSegments", 1, 10)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder.addColor(cubeParameters, "color").onChange(() => {
            this.updateObject();
        });
    }

    generateCylinderParameters() {
        const cylinderParameters = Cylinder.getParams();
        this.folder
            .add(cylinderParameters, "radiusTop", 1, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(cylinderParameters, "radiusBottom", 1, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(cylinderParameters, "height", 1, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(cylinderParameters, "radialSegments", 1, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(cylinderParameters, "heightSegments", 1, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder.add(cylinderParameters, "openEnded").onChange(() => {
            this.updateObject();
        });
        this.folder
            .add(cylinderParameters, "thetaStart", 0, Math.PI * 2)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(cylinderParameters, "thetaLength", 0, Math.PI * 2)
            .onChange(() => {
                this.updateObject();
            });
        this.folder.addColor(cylinderParameters, "color").onChange(() => {
            this.updateObject();
        });
    }

    generateFlatTreeParameters() {
        const flatTreeParameters = FlatTree.getParams();
        this.folder
            .add(flatTreeParameters, "iteration", 0, 10)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(flatTreeParameters, "rootThickness", 0.1, 1)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(flatTreeParameters, "rootLength", 1, 10)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(flatTreeParameters, "branchThicknessScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(flatTreeParameters, "branchLengthScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(flatTreeParameters, "branchAngle", 0, Math.PI)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .addColor(flatTreeParameters, "branchRadioSegments", 0, 30)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(flatTreeParameters, "branchHeightSegments", 1, 30)
            .onChange(() => {
                this.updateObject();
            });
        this.folder.add(flatTreeParameters, "branchOpenEnded").onChange(() => {
            this.updateObject();
        });
        this.folder
            .add(flatTreeParameters, "branchThetaStart", 0, Math.PI * 2)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(flatTreeParameters, "branchThetaLength", 0, Math.PI * 2)
            .onChange(() => {
                this.updateObject();
            });
        this.folder.addColor(flatTreeParameters, "branchColor").onChange(() => {
            this.updateObject();
        });
    }
}
