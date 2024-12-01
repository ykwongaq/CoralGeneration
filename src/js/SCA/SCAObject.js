import MyObject from "../objects/myObject";
import * as THREE from "three";
export default class SCAObject extends MyObject {
    constructor(scene, debugMode = false, position = new THREE.Vector3()) {
        super(scene, debugMode);
        this.position = position;
    }

    getPosition() {
        return this.position;
    }
}
