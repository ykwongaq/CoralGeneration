import * as THREE from "three";
import Cube from "./objects/cube";
import Cylinder from "./objects/cylinder";
import CollisionTest from "./objects/collisionTest";
import FlatTree from "./objects/flatTree";
import LSystemTree from "./objects/lSystemTree";
import BranchCoral from "./objects/branchCoral";
import ObjectGenerator from "./objectGenerator";
import RandomNumberGenerator from "./randomNumberGenerator";
import Curve from "./objects/curve";
import BranchCoralCurve from "./objects/branchCoralCurve";
import AttractorTest from "./objects/attractorTest";
import SCA_Test from "./objects/SCA_Test";
import AntipathesCoral from "./objects/antipathesCoral";
import StaghornCoral from "./objects/staghornCoral";
import AntlerCoral from "./objects/antlerCoral";
import ObstacleTest from "./objects/obstacleTest";
import WhipCoral from "./objects/whipCoral";
import PreciousCoral from "./objects/preciousCoral";
import EnchinogorgiaCoral from "./objects/enchinogorgiaCoral";

import { GUI } from "dat.gui";

export default class DynamicGUI {
    static DEFAULT_OBJECT = Cube.NAME;
    constructor(scene) {
        this.scene = scene;
        this.objectGenerator = new ObjectGenerator(scene);

        this.gui = new GUI();

        this.params = {
            debugMode: false,
            object: DynamicGUI.DEFAULT_OBJECT,
        };
        this.parameterFolder = null;
        this.objectList = [
            Cube.NAME,
            Cylinder.NAME,
            CollisionTest.NAME,
            Curve.NAME,
            AttractorTest.NAME,
            SCA_Test.NAME,
            ObstacleTest.NAME,
            FlatTree.NAME,
            LSystemTree.NAME,
            BranchCoral.NAME,
            WhipCoral.NAME,
            AntipathesCoral.NAME,
            StaghornCoral.NAME,
            EnchinogorgiaCoral.NAME,
            AntlerCoral.NAME,
            PreciousCoral.NAME,
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

    disable() {
        this.gui.domElement.style.pointerEvents = "none";
        this.gui.domElement.style.opacity = 0.5;
    }

    enable() {
        this.gui.domElement.style.pointerEvents = "auto";
        this.gui.domElement.style.opacity = 1;
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
            case Curve.NAME:
                this.generateCurveParameters();
                break;
            case BranchCoralCurve.NAME:
                this.generateBranchCoralCurveParameters();
                break;
            case AttractorTest.NAME:
                this.generateAttractorTestParameters();
                break;
            case SCA_Test.NAME:
                this.generateSCATestParameters();
                break;
            case AntipathesCoral.NAME:
                this.generateStaghornCoralParameters();
                break;
            case StaghornCoral.NAME:
                this.generateStaghornCoral2Parameters();
                break;
            case AntlerCoral.NAME:
                this.generateAntlerCoralParameters();
                break;
            case ObstacleTest.NAME:
                this.generateObstacleTestParameters();
                break;
            case WhipCoral.NAME:
                this.generateWhipCoralParameters();
                break;
            case PreciousCoral.NAME:
                this.generatePreciousCoralParameters();
                break;
            case EnchinogorgiaCoral.NAME:
                this.generateEchninogorgiaCoralParameters();
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
        this.folder
            .add(collisionTestParameters, "rotateX", 0, 360)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(collisionTestParameters, "rotateY", 0, 360)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(collisionTestParameters, "rotateZ", 0, 360)
            .step(1)
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

    generateCurveParameters() {
        const curveParameters = Curve.getParams();

        const curveTypes = [Curve.CATNULL_ROM, Curve.BSPLINE];
        this.folder
            .add(curveParameters, "curveType", curveTypes)
            .name("Curve Type")
            .onChange(() => {
                this.updateObject();
            });
        this.folder.addColor(curveParameters, "startColor").onChange(() => {
            this.updateObject();
        });
        this.folder.addColor(curveParameters, "endColor").onChange(() => {
            this.updateObject();
        });

        const controlPoint1Folder = this.addFolder("Control Point 1");
        controlPoint1Folder
            .add(curveParameters, "controlPoint1X", -10, 10)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        controlPoint1Folder
            .add(curveParameters, "controlPoint1Y", -10, 10)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        controlPoint1Folder
            .add(curveParameters, "controlPoint1Z", -10, 10)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });

        const controlPoint2Folder = this.addFolder("Control Point 2");
        controlPoint2Folder
            .add(curveParameters, "controlPoint2X", -10, 10)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        controlPoint2Folder
            .add(curveParameters, "controlPoint2Y", -10, 10)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        controlPoint2Folder
            .add(curveParameters, "controlPoint2Z", -10, 10)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });

        const widthFolder = this.addFolder("Width");
        widthFolder
            .add(curveParameters, "startWidth", 1, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        widthFolder
            .add(curveParameters, "endWidth", 1, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
    }

    generateWhipCoralParameters() {
        const whipCoralParameters = WhipCoral.getParams();
        this.folder
            .add(whipCoralParameters, "iteration", 0, 8)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(whipCoralParameters, "seed")
            .name("Random Seed")
            .listen();
        this.folder
            .add(
                {
                    regenerate: () => {
                        whipCoralParameters.seed = Math.floor(
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
            .add(whipCoralParameters, "centerOriented")
            .name("Center Oriented")
            .onChange(() => {
                this.updateObject();
            });
        centerSetting
            .add(whipCoralParameters, "centerDegree", 0, 1)
            .step(0.01)
            .name("Center Degree")
            .onChange(() => {
                this.updateObject();
            });

        const branchSetting = this.addFolder("Branch Setting");
        branchSetting
            .add(whipCoralParameters, "rootThickness", 4, 30)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        branchSetting
            .add(whipCoralParameters, "rootLength", 1, 10)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        branchSetting
            .add(whipCoralParameters, "branchThicknessScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        branchSetting
            .add(whipCoralParameters, "branchLengthScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        branchSetting
            .add(whipCoralParameters, "branchMaxAngle", 0, Math.PI)
            .onChange(() => {
                this.updateObject();
            });
    }

    generateBranchCoralCurveParameters() {
        const branchCoralCurveParameters = BranchCoralCurve.getParams();
        this.folder
            .add(branchCoralCurveParameters, "iteration", 0, 8)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(branchCoralCurveParameters, "seed")
            .name("Random Seed")
            .listen();
        this.folder
            .add(
                {
                    regenerate: () => {
                        branchCoralCurveParameters.seed = Math.floor(
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
            .add(branchCoralCurveParameters, "centerOriented")
            .name("Center Oriented")
            .onChange(() => {
                this.updateObject();
            });
        centerSetting
            .add(branchCoralCurveParameters, "centerDegree", 0, 1)
            .step(0.01)
            .name("Center Degree")
            .onChange(() => {
                this.updateObject();
            });

        const branchSetting = this.addFolder("Branch Setting");
        branchSetting
            .add(branchCoralCurveParameters, "rootThickness", 4, 30)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        branchSetting
            .add(branchCoralCurveParameters, "rootLength", 1, 10)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        branchSetting
            .add(branchCoralCurveParameters, "branchThicknessScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        branchSetting
            .add(branchCoralCurveParameters, "branchLengthScaler", 0, 1)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        branchSetting
            .add(branchCoralCurveParameters, "branchMaxAngle", 0, Math.PI)
            .onChange(() => {
                this.updateObject();
            });
        branchSetting
            .addColor(branchCoralCurveParameters, "branchColor")
            .onChange(() => {
                this.updateObject();
            });
    }

    generateAttractorTestParameters() {
        const attractorTestParameters = AttractorTest.getParams();
        this.folder
            .add(attractorTestParameters, "radius", 5, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(attractorTestParameters, "numPoints", 500, 5000)
            .step(100)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(attractorTestParameters, "influenceDistance", 1, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(attractorTestParameters, "killDistance", 1, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
    }

    generateSCATestParameters() {
        const scCoralTestParameters = SCA_Test.getParams();
        this.folder.add(scCoralTestParameters, "maxIteration", 1, 1000).step(1);

        this.folder
            .add(
                {
                    startRender: async () => {
                        this.disable();
                        this.updateObject();
                        await this.objectGenerator.startRender();
                        this.enable();
                    },
                },
                "startRender"
            )
            .name("Render");

        const attractorSetting = this.addFolder("Attractor Setting");
        // attractorSetting
        //     .add(scCoralTestParameters, "numAttractors")
        //     .onChange(() => {
        //         this.updateObject();
        //     });
        attractorSetting
            .add(scCoralTestParameters, "influenceDistance", 1, 30)
            .step(1);

        attractorSetting
            .add(scCoralTestParameters, "killDistance", 1, 30)
            .step(1);

        attractorSetting
            .add(scCoralTestParameters, "positionX", -30, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        attractorSetting
            .add(scCoralTestParameters, "positionY", -30, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        attractorSetting
            .add(scCoralTestParameters, "positionZ", -30, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });

        const nodeSetting = this.addFolder("Node Setting");
        nodeSetting
            .add(scCoralTestParameters, "segmentLength", 1, 30)
            .step(0.1);
        nodeSetting
            .add(scCoralTestParameters, "basicThickness", 0.1, 30)
            .step(0.1);
        nodeSetting
            .add(scCoralTestParameters, "canalizeThickness", 0.1, 30)
            .step(0.1);
        nodeSetting
            .add(scCoralTestParameters, "maxThickness", 0.1, 30)
            .step(0.1);

        nodeSetting.addColor(scCoralTestParameters, "color");
    }

    generateStaghornCoralParameters() {
        const SCACoralParameters = AntipathesCoral.getParams();
        this.folder
            .add(SCACoralParameters, "radius", 10, 50)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(SCACoralParameters, "numAttractors", 1, 5000)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(SCACoralParameters, "seed")
            .name("Random Seed")
            .listen();
        this.folder
            .add(
                {
                    regenerate: () => {
                        SCACoralParameters.seed = Math.floor(
                            RandomNumberGenerator.random() * 1000000
                        );
                        this.updateObject();
                    },
                },
                "regenerate"
            )
            .name("Regenerate Seed");
        this.folder.add(SCACoralParameters, "maxIteration");
        this.folder
            .add(
                {
                    startRender: async () => {
                        this.disable();
                        this.updateObject();
                        await this.objectGenerator.startRender();
                        this.enable();
                    },
                },
                "startRender"
            )
            .name("Render");

        const attractorSetting = this.addFolder("Attractor Setting");
        attractorSetting
            .add(SCACoralParameters, "influenceDistance", 1, 30)
            .step(1);
        attractorSetting.add(SCACoralParameters, "killDistance", 1, 30).step(1);

        const nodeSetting = this.addFolder("Node Setting");
        nodeSetting.add(SCACoralParameters, "segmentLength", 1, 30).step(0.1);
        nodeSetting
            .add(SCACoralParameters, "basicThickness", 0.1, 30)
            .step(0.1);
        nodeSetting
            .add(SCACoralParameters, "canalizeThickness", 0, 2)
            .step(0.01);
        nodeSetting.add(SCACoralParameters, "maxThickness", 0.1, 30).step(0.1);

        nodeSetting.addColor(SCACoralParameters, "color");
    }

    generateEchninogorgiaCoralParameters() {
        const enchinogorgiaCoralParameters = EnchinogorgiaCoral.getParams();
        this.folder
            .add(enchinogorgiaCoralParameters, "radius", 10, 50)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(enchinogorgiaCoralParameters, "numAttractors", 1, 5000)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(enchinogorgiaCoralParameters, "seed")
            .name("Random Seed")
            .listen();
        this.folder
            .add(
                {
                    regenerate: () => {
                        enchinogorgiaCoralParameters.seed = Math.floor(
                            RandomNumberGenerator.random() * 1000000
                        );
                        this.updateObject();
                    },
                },
                "regenerate"
            )
            .name("Regenerate Seed");
        this.folder.add(enchinogorgiaCoralParameters, "maxIteration");
        this.folder
            .add(
                {
                    startRender: async () => {
                        this.disable();
                        this.updateObject();
                        await this.objectGenerator.startRender();
                        this.enable();
                    },
                },
                "startRender"
            )
            .name("Render");

        const attractorSetting = this.addFolder("Attractor Setting");
        attractorSetting
            .add(enchinogorgiaCoralParameters, "influenceDistance", 1, 30)
            .step(1);
        attractorSetting
            .add(enchinogorgiaCoralParameters, "killDistance", 1, 30)
            .step(1);

        const nodeSetting = this.addFolder("Node Setting");
        nodeSetting
            .add(enchinogorgiaCoralParameters, "segmentLength", 1, 30)
            .step(0.1);
        nodeSetting
            .add(enchinogorgiaCoralParameters, "basicThickness", 0.1, 30)
            .step(0.1);
        nodeSetting
            .add(enchinogorgiaCoralParameters, "canalizeThickness", 0, 2)
            .step(0.01);
        nodeSetting
            .add(enchinogorgiaCoralParameters, "maxThickness", 0.1, 30)
            .step(0.1);

        nodeSetting.addColor(enchinogorgiaCoralParameters, "color");
    }

    generateStaghornCoral2Parameters() {
        const StaghornCoral2Parameters = StaghornCoral.getParams();
        this.folder
            .add(StaghornCoral2Parameters, "radius", 10, 50)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(StaghornCoral2Parameters, "numAttractors", 1, 5000)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(StaghornCoral2Parameters, "seed")
            .name("Random Seed")
            .listen();
        this.folder
            .add(
                {
                    regenerate: () => {
                        StaghornCoral2Parameters.seed = Math.floor(
                            RandomNumberGenerator.random() * 1000000
                        );
                        this.updateObject();
                    },
                },
                "regenerate"
            )
            .name("Regenerate Seed");
        this.folder.add(StaghornCoral2Parameters, "maxIteration");
        this.folder
            .add(
                {
                    startRender: async () => {
                        this.disable();
                        this.updateObject();
                        await this.objectGenerator.startRender();
                        this.enable();
                    },
                },
                "startRender"
            )
            .name("Render");

        const attractorSetting = this.addFolder("Attractor Setting");
        attractorSetting
            .add(StaghornCoral2Parameters, "influenceDistance", 1, 30)
            .step(1);
        attractorSetting
            .add(StaghornCoral2Parameters, "killDistance", 1, 30)
            .step(1);

        const nodeSetting = this.addFolder("Node Setting");
        nodeSetting
            .add(StaghornCoral2Parameters, "segmentLength", 1, 30)
            .step(0.1);
        nodeSetting
            .add(StaghornCoral2Parameters, "basicThickness", 0.1, 30)
            .step(0.1);
        nodeSetting
            .add(StaghornCoral2Parameters, "canalizeThickness", 0, 2)
            .step(0.01);
        nodeSetting
            .add(StaghornCoral2Parameters, "maxThickness", 0.1, 30)
            .step(0.1);

        nodeSetting.addColor(StaghornCoral2Parameters, "color");
    }

    generateAntlerCoralParameters() {
        const antlerCoarlParameters = AntlerCoral.getParams();
        this.folder
            .add(antlerCoarlParameters, "radius", 10, 50)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(antlerCoarlParameters, "numAttractors", 1, 5000)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(antlerCoarlParameters, "seed")
            .name("Random Seed")
            .listen();
        this.folder
            .add(
                {
                    regenerate: () => {
                        antlerCoarlParameters.seed = Math.floor(
                            RandomNumberGenerator.random() * 1000000
                        );
                        this.updateObject();
                    },
                },
                "regenerate"
            )
            .name("Regenerate Seed");
        this.folder.add(antlerCoarlParameters, "maxIteration");
        this.folder
            .add(
                {
                    startRender: async () => {
                        this.disable();
                        this.updateObject();
                        await this.objectGenerator.startRender();
                        this.enable();
                    },
                },
                "startRender"
            )
            .name("Render");

        const attractorSetting = this.addFolder("Attractor Setting");
        attractorSetting
            .add(antlerCoarlParameters, "influenceDistance", 1, 30)
            .step(1);
        attractorSetting
            .add(antlerCoarlParameters, "killDistance", 1, 30)
            .step(1);

        const nodeSetting = this.addFolder("Node Setting");
        nodeSetting
            .add(antlerCoarlParameters, "segmentLength", 1, 30)
            .step(0.1);
        nodeSetting
            .add(antlerCoarlParameters, "basicThickness", 0.1, 30)
            .step(0.1);
        nodeSetting
            .add(antlerCoarlParameters, "canalizeThickness", 0, 2)
            .step(0.01);
        nodeSetting
            .add(antlerCoarlParameters, "maxThickness", 0.1, 30)
            .step(0.1);

        nodeSetting.addColor(antlerCoarlParameters, "color");
    }

    generateObstacleTestParameters() {
        const obstacleTestParameters = ObstacleTest.getParams();
        this.folder
            .add(obstacleTestParameters, "radius", 10, 50)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(obstacleTestParameters, "numAttractors", 1, 5000)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        this.folder
            .add(obstacleTestParameters, "seed")
            .name("Random Seed")
            .listen();
        this.folder
            .add(
                {
                    regenerate: () => {
                        obstacleTestParameters.seed = Math.floor(
                            RandomNumberGenerator.random() * 1000000
                        );
                        this.updateObject();
                    },
                },
                "regenerate"
            )
            .name("Regenerate Seed");
        this.folder.add(obstacleTestParameters, "maxIteration");
        this.folder
            .add(
                {
                    startRender: async () => {
                        this.disable();
                        this.updateObject();
                        await this.objectGenerator.startRender();
                        this.enable();
                    },
                },
                "startRender"
            )
            .name("Render");

        const attractorSetting = this.addFolder("Attractor Setting");
        attractorSetting
            .add(obstacleTestParameters, "influenceDistance", 1, 30)
            .step(1);
        attractorSetting
            .add(obstacleTestParameters, "killDistance", 1, 30)
            .step(1);

        const nodeSetting = this.addFolder("Node Setting");
        nodeSetting
            .add(obstacleTestParameters, "segmentLength", 1, 30)
            .step(0.1);
        nodeSetting
            .add(obstacleTestParameters, "basicThickness", 0.1, 30)
            .step(0.1);
        nodeSetting
            .add(obstacleTestParameters, "canalizeThickness", 0, 2)
            .step(0.01);
        nodeSetting
            .add(obstacleTestParameters, "maxThickness", 0.1, 30)
            .step(0.1);

        nodeSetting.addColor(obstacleTestParameters, "color");

        const obstacleSetting = this.addFolder("Obstacle Setting");
        obstacleSetting
            .add(obstacleTestParameters, "showObstacle")
            .onChange(() => {
                this.updateObject();
            });
        obstacleSetting
            .add(obstacleTestParameters, "obstacleHeight", 1, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        obstacleSetting
            .add(obstacleTestParameters, "obstacleWidth", 1, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        obstacleSetting
            .add(obstacleTestParameters, "obstacleDepth", 1, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        obstacleSetting
            .add(obstacleTestParameters, "positionX", -30, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        obstacleSetting
            .add(obstacleTestParameters, "positionY", -30, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        obstacleSetting
            .add(obstacleTestParameters, "positionZ", -30, 30)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
    }

    generatePreciousCoralParameters() {
        const preciousCoralParameters = PreciousCoral.getParams();

        this.folder.add(preciousCoralParameters, "seed").listen();
        this.folder
            .add(
                {
                    regenerate: () => {
                        preciousCoralParameters.seed = Math.floor(
                            RandomNumberGenerator.random() * 1000000
                        );
                        this.updateObject();
                    },
                },
                "regenerate"
            )
            .name("Regenerate Seed");
        this.folder
            .add(
                {
                    startRender: async () => {
                        this.disable();
                        await this.objectGenerator.startRender();
                        this.enable();
                    },
                },
                "startRender"
            )
            .name("Render");
        const stemSettings = this.addFolder("Stem Settings");
        stemSettings
            .add(preciousCoralParameters, "iterations", 1, 10)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        stemSettings
            .add(preciousCoralParameters, "stemLength", 1, 30)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        stemSettings
            .add(preciousCoralParameters, "segmentLength", 0.1, 10)
            .step(0.1)
            .onChange(() => {
                this.updateObject();
            });
        stemSettings
            .add(preciousCoralParameters, "stemThickness", 1, 10)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        stemSettings
            .add(preciousCoralParameters, "canalizeThickness", 0, 1)
            .step(0.01)
            .onChange(() => {
                this.updateObject();
            });
        stemSettings
            .add(preciousCoralParameters, "maxThickness", 10, 40)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        stemSettings
            .add(preciousCoralParameters, "branchAngle", 0, Math.PI)
            .step(0.01)
            .onChange(() => {
                this.updateObject();
            });

        const attractorSettings = this.addFolder("Attractor Settings");
        attractorSettings
            .add(preciousCoralParameters, "height", 0, 10)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        attractorSettings
            .add(preciousCoralParameters, "radius", 0, 50)
            .step(1)
            .onChange(() => {
                this.updateObject();
            });
        attractorSettings
            .add(preciousCoralParameters, "numAttractors")
            .onChange(() => {
                this.updateObject();
            });
        attractorSettings
            .add(preciousCoralParameters, "influenceDistance", 1, 30)
            .step(1);
        attractorSettings
            .add(preciousCoralParameters, "killDistance", 1, 30)
            .step(1);
    }
}
