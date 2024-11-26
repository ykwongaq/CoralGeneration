import * as THREE from "three";
import MyObject from "./myObject";
import RandomNumberGenerator from "../randomNumberGenerator";
import Attractor from "../SCA/attractor";

export default class AttractorTest extends MyObject {
    static PARAMS = {
        radius: 10,
        numPoints: 10,

        influenceDistance: 5,
        killDistance: 1,
    };

    static NAME = "AttractorTest";

    static getParams() {
        return AttractorTest.PARAMS;
    }

    constructor(
        scene,
        debugMode,
        radius = AttractorTest.PARAMS.radius,
        numPoints = AttractorTest.PARAMS.numPoints,
        influenceDistance = AttractorTest.PARAMS.influenceDistance,
        killDistance = AttractorTest.PARAMS.killDistance
    ) {
        super(scene, debugMode);
        RandomNumberGenerator.setSeed(RandomNumberGenerator.DEFAULT_SEED);
        this.radius = radius;
        this.numPoints = numPoints;
        this.influenceDistance = influenceDistance;
        this.killDistance = killDistance;

        const geometry = new THREE.SphereGeometry(
            this.radius,
            32,
            32,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2
        );
        const material = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            transparent: true,
            opacity: 0.5,
        });

        this.mesh = new THREE.Mesh(geometry, material);
    }

    generate() {
        super.generate();

        for (let i = 0; i < this.numPoints; i++) {
            const r =
                this.radius * Math.cbrt(RandomNumberGenerator.seedRandom());
            const theta = RandomNumberGenerator.seedRandom() * Math.PI;
            const phi = Math.acos(2 * RandomNumberGenerator.seedRandom() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            const point = new THREE.Vector3(x, y, z);

            const attractor = new Attractor(
                this.scene,
                this.debugMode,
                point,
                this.influenceDistance,
                this.killDistance
            );
            attractor.generate();

            if (this.debugMode) {
                attractor.showInference();
                attractor.showKill();
            }
        }
    }
}
