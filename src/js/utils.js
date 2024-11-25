import * as THREE from "three";
import RandomNumberGenerator from "./randomNumberGenerator";

export default class Utils {
    static UP = new THREE.Vector3(0, 1, 0);
    static Y = Utils.UP;
    static Z = new THREE.Vector3(0, 0, 1);
    static X = new THREE.Vector3(1, 0, 0);

    static RGB2Color(r, g, b) {
        return new THREE.Color().setRGB(r / 255, g / 255, b / 255);
    }

    static getUpVector() {
        return Utils.UP.clone();
    }

    static getYVector() {
        return Utils.Y.clone();
    }

    static getZVector() {
        return Utils.Z.clone();
    }

    static getXVector() {
        return Utils.X.clone();
    }

    static getRandomDirection() {
        return new THREE.Vector3(
            RandomNumberGenerator.seedRandom() * 2 - 1,
            RandomNumberGenerator.seedRandom() * 2 - 1,
            RandomNumberGenerator.seedRandom() * 2 - 1
        ).normalize();
    }

    static dotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    static deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    static rad2deg(rad) {
        return rad * (180 / Math.PI);
    }

    static isVectorEqual(v1, v2, tolerance = 0.0001) {
        return (
            Math.abs(v1.x - v2.x) < tolerance &&
            Math.abs(v1.y - v2.y) < tolerance &&
            Math.abs(v1.z - v2.z) < tolerance
        );
    }
}
