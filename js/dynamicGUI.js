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
        this.objectList = [
            Cube.NAME,
            Cylinder.NAME,
            CollisionTest.NAME,
            FlatTree.NAME,
            LSystemTree.NAME,
            BranchCoral.NAME,
        ];

        // Debug Mode
        this.redColor = new THREE.Color().setHex(0xff0000);
        this.greenColor = new THREE.Color().setHex(0x00ff00);
        this.blueColor = new THREE.Color().setHex(0x0000ff);
        this.axesHelper = this.generateAxesHelper();

        this.folders = [];
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
        if (this.folders.length > 0) {
            // Remove all folders
            this.folders.forEach((folder) => {
                this.gui.removeFolder(folder);
            });
            this.folders = [];
        }

        this.folder = this.addFolder("Parameters");

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
            case LSystemTree.NAME:
                this.generateLSystemTreeParameters();
                break;
            case CollisionTest.NAME:
                this.generateCollisionTestParameters();
                break;
            case BranchCoral.NAME:
                this.generateBranchCoralParameters();
                break;
            default:
                throw new Error("Unhandled obejct: " + this.params.object);
        }

        for (let i = 0; i < this.folders.length; i++) {
            this.folders[i].open();
        }
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

    generateCollisionTestParameters() {
        const collisionTestParameters = CollisionTest.getParams();
        this.folder
            .add(collisionTestParameters, "x", -10, 10)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(collisionTestParameters, "y", -10, 10)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(collisionTestParameters, "z", -10, 10)
            .step(0.1)
            .onChange(() => {
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

    addFolder(name) {
        const folder = this.gui.addFolder(name);
        this.folders.push(folder);
        return folder;
    }

    generateLSystemTreeParameters() {
        const lSystemCoralParameters = LSystemTree.getParams();
        this.folder
            .add(lSystemCoralParameters, "iteration", 0, 10)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(lSystemCoralParameters, "rootThickness", 0.1, 1)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(lSystemCoralParameters, "rootLength", 1, 10)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(lSystemCoralParameters, "branchThicknessScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(lSystemCoralParameters, "branchLengthScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(lSystemCoralParameters, "branchMaxAngle", 0, Math.PI)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .addColor(lSystemCoralParameters, "branchColor")
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(lSystemCoralParameters, "seed")
            .name("Random Seed")
            .listen();
        this.folder
            .add(
                {
                    regenerate: () => {
                        lSystemCoralParameters.seed = Math.floor(
                            RandomNumberGenerator.random() * 1000000
                        );
                        this.updateObject();
                    },
                },
                "regenerate"
            )
            .name("Regenerate Seed");
    }

    generateBranchCoralParameters() {
        const branchCoralParameters = BranchCoral.getParams();
        this.folder
            .add(branchCoralParameters, "iteration", 0, 8)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(branchCoralParameters, "seed")
            .name("Random Seed")
            .listen();
        this.folder
            .add(
                {
                    regenerate: () => {
                        branchCoralParameters.seed = Math.floor(
                            RandomNumberGenerator.random() * 1000000
                        );
                        this.updateObject();
                    },
                },
                "regenerate"
            )
            .name("Regenerate Seed");

        const centerSetting = this.addFolder("Center Orientation");
        centerSetting
            .add(branchCoralParameters, "centerOriented")
            .name("Center Oriented")
            .onChange(() => {
                this.updateObject();
            });
        centerSetting
            .add(branchCoralParameters, "centerDegree", 0, 1)
            .step(0.01)
            .name("Center Degree")
            .onChange(() => {
                this.updateObject();
            });

        const branchSetting = this.addFolder("Branch Setting");
        branchSetting
            .add(branchCoralParameters, "rootThickness", 0.1, 1)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        branchSetting
            .add(branchCoralParameters, "rootLength", 1, 10)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        branchSetting
            .add(branchCoralParameters, "branchThicknessScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        branchSetting
            .add(branchCoralParameters, "branchLengthScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        branchSetting
            .add(branchCoralParameters, "branchMaxAngle", 0, Math.PI)
            .onChange(() => {
                this.updateObject();
            });
        branchSetting
            .addColor(branchCoralParameters, "branchColor")
            .onChange(() => {
                this.updateObject();
            });
    }
}
