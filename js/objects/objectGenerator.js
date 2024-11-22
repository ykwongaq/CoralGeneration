class ObjectGenerator {
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
            default:
                throw new Error(`Object ${objectName} not found`);
        }
        this.object.generate();
    }
}
