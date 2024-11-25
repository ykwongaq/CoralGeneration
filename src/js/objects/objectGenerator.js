import Cube from "./cube.js";
import Cylinder from "./cylinder.js";
import FlatTree from "./flatTree.js";
import LSystemTree from "./lSystemTree.js";
import CollisionTest from "./collisionTest.js";
import BranchCoral from "./branchCoral.js";
import Curve from "./curve.js";
import BranchCoralCurve from "./branchCoralCurve.js";

export default class ObjectGenerator {
    constructor(scene) {
        this.scene = scene;
        this.debugMode = false;
        this.object = null;
    }

    setDebugMode(debugMode) {
        this.debugMode = debugMode;
    }

    generateObject(objectName) {
        if (this.object) {
            this.object.clear();
        }
        switch (objectName) {
            case Cube.NAME:
                this.object = new Cube(this.scene, this.debugMode);
                break;
            case Cylinder.NAME:
                this.object = new Cylinder(this.scene, this.debugMode);
                break;
            case FlatTree.NAME:
                this.object = new FlatTree(this.scene, this.debugMode);
                break;
            case LSystemTree.NAME:
                this.object = new LSystemTree(this.scene, this.debugMode);
                break;
            case CollisionTest.NAME:
                this.object = new CollisionTest(this.scene, this.debugMode);
                break;
            case BranchCoral.NAME:
                this.object = new BranchCoral(this.scene, this.debugMode);
                break;
            case Curve.NAME:
                this.object = new Curve(this.scene, this.debugMode);
                break;
            case BranchCoralCurve.NAME:
                this.object = new BranchCoralCurve(this.scene, this.debugMode);
                break;
            default:
                throw new Error(`Object ${objectName} not found`);
        }
        this.object.generate();
    }
}
