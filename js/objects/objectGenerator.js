class ObjectGenerator {
    constructor(scene) {
        this.scene = scene;

        this.object = null;
    }

    generateObject(objectName) {
        if (this.object) {
            this.object.clear();
        }
        switch (objectName) {
            case Cube.NAME:
                this.object = new Cube(this.scene);
                break;
            case Cylinder.NAME:
                this.object = new Cylinder(this.scene);
                break;
            default:
                throw new Error(`Object ${objectName} not found`);
        }
        this.object.generate();
    }
}
