import * as THREE from "three";
import MyObject from "./myObject";
import Utils from "../utils";
import Cylinder from "./cylinder";

export default class CollisionTest extends MyObject {
    static PARAMS = {
        x: 0,
        y: 5,
        z: 0,
        rotateX: 0, // Degree [0, 360]
        rotateY: 0, // Degree [0, 360]
        rotateZ: 0, // Degree [0, 360]
    };

    static NAME = "CollisionTest";

    constructor(
        scene,
        debugMode = false,
        x = CollisionTest.PARAMS.x,
        y = CollisionTest.PARAMS.y,
        z = CollisionTest.PARAMS.z,
        rotateX = CollisionTest.PARAMS.rotateX,
        rotateY = CollisionTest.PARAMS.rotateY,
        rotateZ = CollisionTest.PARAMS.rotateZ
    ) {
        super(scene, debugMode);
        this.x = x;
        this.y = y;
        this.z = z;
        this.rotateX = rotateX;
        this.rotateY = rotateY;
        this.rotateZ = rotateZ;
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

        // Rotate the test object
        testObject.mesh.rotateX(Utils.deg2rad(this.rotateX));
        testObject.mesh.rotateY(Utils.deg2rad(this.rotateY));
        testObject.mesh.rotateZ(Utils.deg2rad(this.rotateZ));

        testObject.generate();

        const bbox1 = base.getBBox();
        const bbox2 = testObject.getBBox();

        // const bbox1 = new THREE.Box3().setFromObject(base.mesh);
        // const bbox2 = new THREE.Box3().setFromObject(testObject.mesh);

        const bboxHelper1 = new THREE.Box3Helper(bbox1, 0xffff00);
        const bboxHelper2 = new THREE.Box3Helper(bbox2, 0xffff00);
        bboxHelper1.isMyObject = true;
        bboxHelper2.isMyObject = true;

        this.scene.add(bboxHelper1);
        this.scene.add(bboxHelper2);

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
