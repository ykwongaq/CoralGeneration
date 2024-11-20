class CollisionTest extends MyObject {
    static PARAMS = {
        x: 0,
        y: 5,
        z: 0,
    };

    static NAME = "CollisionTest";

    constructor(
        scene,
        debugMode = false,
        x = CollisionTest.PARAMS.x,
        y = CollisionTest.PARAMS.y,
        z = CollisionTest.PARAMS.z
    ) {
        super(scene, debugMode);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    generate() {
        // Both object share the same orientation
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(Utils.getUpVector(), Utils.getUpVector());

        const base = new Cylinder(this.scene, this.debugMode);
        base.mesh.applyQuaternion(quaternion);
        base.mesh.position.set(0, 0, 0);
        base.generate();

        const testObject = new Cylinder(this.scene, this.debugMode);
        testObject.mesh.applyQuaternion(quaternion);
        testObject.mesh.position.set(this.x, this.y, this.z);
        testObject.generate();

        if (testObject.isCollidingWith(base)) {
            const newColor = Utils.RGB2Color(255, 0, 0);
            testObject.material.color.set(newColor);
            testObject.material.needsUpdate = true;
        }
    }

    static getParams() {
        return CollisionTest.PARAMS;
    }
}
