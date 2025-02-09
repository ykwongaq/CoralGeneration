import * as THREE from "three";
import Utils from "../utils";

export default class MyObject {
    constructor(scene, debugMode = false) {
        this.scene = scene;
        this.debugMode = debugMode;

        // this.centerSphere = this.genCenterSphere();
        // this.arrowHelper = this.genMeshDirectionArrow();
    }

    generate() {
        if (!this.mesh) {
            return;
        }

        this.mesh.isMyObject = true;
        this.scene.add(this.mesh);
        // if (this.debugMode) {
        //     this.centerSphere.position.copy(this.mesh.position);
        //     this.scene.add(this.centerSphere);
        //     this.mesh.add(this.arrowHelper);
        // }
    }

    clear() {
        for (let i = this.scene.children.length - 1; i >= 0; i--) {
            let child = this.scene.children[i];
            if (child.isMyObject) {
                this.scene.remove(child);
            }
        }
    }

    setMesh(mesh) {
        this.mesh = mesh;
    }

    getMesh() {
        return this.mesh;
    }

    setPosition(position) {
        this.mesh.position.copy(position);
    }

    lookAt(direction) {
        const lookAtDirection = new THREE.Vector3().addVectors(
            this.mesh.position,
            direction
        );
        this.mesh.lookAt(lookAtDirection);
    }

    getPosition() {
        return this.mesh.position;
    }

    getLookingDirection() {
        return this.mesh.getWorldDirection();
    }

    genCenterSphere() {
        const sphereGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
        });
        const centerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        centerSphere.isMyObject = true;
        return centerSphere;
    }

    genMeshDirectionArrow() {
        const direction = Utils.getUpVector();
        const origin = new THREE.Vector3(0, 0, 0);
        const length = 1;
        const hex = 0x00ff00;
        const arrowHelper = new THREE.ArrowHelper(
            direction,
            origin,
            length,
            hex
        );
        arrowHelper.isMyObject = true;
        return arrowHelper;
    }

    getBBox() {
        this.mesh.updateMatrixWorld(true);
        this.mesh.geometry.computeBoundingBox();

        const worldMatrix = this.mesh.matrixWorld;
        const positionAttribute = this.mesh.geometry.attributes.position;
        let min = new THREE.Vector3(Infinity, Infinity, Infinity);
        let max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);

        for (let i = 0; i < positionAttribute.count; i++) {
            const vertex = new THREE.Vector3().fromBufferAttribute(
                positionAttribute,
                i
            );
            vertex.applyMatrix4(worldMatrix);

            min.min(vertex);
            max.max(vertex);
        }

        const bbox = new THREE.Box3(min, max);
        return bbox;
    }

    isCollidingWith(object) {
        const bbox1 = this.getBBox();
        const bbox2 = object.getBBox();
        return bbox1.intersectsBox(bbox2);
    }
}
