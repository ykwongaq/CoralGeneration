import * as THREE from "three";

import ObjectGenerator from "./objectGenerator";
import RandomNumberGenerator from "./randomNumberGenerator";
import ParameterGenerator from "./parameterGenerator";

import {
    Cube,
    Cylinder,
    Curve,
    ObstacleTest,
    FlatTree,
    LSystemTree,
    BranchCoral,
    WhipCoral,
    AntipathesCoral,
    StaghornCoral,
    EnchinogorgiaCoral,
    AntlerCoral,
    PreciousCoral,
} from "./objects";

import { GUI } from "dat.gui";

export default class DynamicGUI {
    static DEFAULT_OBJECT = Cube.NAME;
    constructor(scene) {
        this.scene = scene;
        this.objectGenerator = new ObjectGenerator(scene);
        this.ParameterGenerator = new ParameterGenerator(this);

        this.gui = new GUI();

        this.params = {
            debugMode: false,
            object: DynamicGUI.DEFAULT_OBJECT,
        };
        this.parameterFolder = null;
        this.objectList = [
            Cube.NAME,
            Cylinder.NAME,
            // CollisionTest.NAME,
            Curve.NAME,
            // AttractorTest.NAME,
            // SCA_Test.NAME,
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

        this.ParameterGenerator.updateParameters(this.params.object);
        for (let i = 0; i < this.folders.length; i++) {
            this.folders[i].open();
        }
    }

    addFolder(name) {
        const folder = this.gui.addFolder(name);
        this.folders.push(folder);
        return folder;
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
}
