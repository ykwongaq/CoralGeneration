import Cube from "./objects/cube.js";
import Cylinder from "./objects/cylinder.js";
import FlatTree from "./objects/flatTree.js";
import LSystemTree from "./objects/lSystemTree.js";
import CollisionTest from "./objects/collisionTest.js";
import BranchCoral from "./objects/branchCoral.js";
import Curve from "./objects/curve.js";
import BranchCoralCurve from "./objects/branchCoralCurve.js";
import AttractorTest from "./objects/attractorTest.js";
import SCA_Test from "./objects/SCA_Test.js";
import MyAnimateObject from "./objects/myAnimateObject.js";
import SCACoral from "./objects/SCACoral.js";
import AntlerCoral from "./objects/antlerCoral.js";

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
            case AttractorTest.NAME:
                this.object = new AttractorTest(this.scene, this.debugMode);
                break;
            case SCA_Test.NAME:
                this.object = new SCA_Test(this.scene, this.debugMode);
                break;
            case SCACoral.NAME:
                this.object = new SCACoral(this.scene, this.debugMode);
                break;
            case AntlerCoral.NAME:
                this.object = new AntlerCoral(this.scene, this.debugMode);
                break;

            default:
                throw new Error(`Object ${objectName} not found`);
        }
        this.object.generate();
    }

    async startRender() {
        if (this.object) {
            // Make sure that this object is animate object
            if (!(this.object instanceof MyAnimateObject)) {
                throw new Error("Object must be an animate object");
            }
            this.object.clear();
            await this.object.startRender();
        }
    }
}
