import * as THREE from "three";
import MyObject from "./myObject";
import RandomNumberGenerator from "../randomNumberGenerator";
import Attractor from "../SCA/attractor";

export default class AttractorTest extends MyObject {
    static PARAMS = {
        radius: 10,
        numPoints: 1000,

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

        // this.mesh = new THREE.Mesh(geometry, material);
    }

    generate() {
        super.generate();

        this.radius = 5;
        let height = 10;

        for (let i = 0; i < this.numPoints; i++) {
            // Random height position (y-coordinate)
            let y_ = RandomNumberGenerator.seedRandom() * height - height / 2; // Center the cylinder at the origin

            // Random radial distance, sampled proportionally to area
            const r =
                Math.sqrt(RandomNumberGenerator.seedRandom()) * this.radius;

            // Random angle around the circular cross-section
            const theta = RandomNumberGenerator.seedRandom() * 2 * Math.PI;

            // Convert polar coordinates to Cartesian coordinates
            let x_ = r * Math.cos(theta);
            let z_ = r * Math.sin(theta);

            let x = x_;
            let y = z_;
            let z = y_;

            y += height;

            const point = new THREE.Vector3(x, y, z);

            const attractor = new Attractor(
                this.scene,
                this.debugMode,
                point,
                this.influenceDistance,
                this.killDistance
            );
            attractor.generate();

            // if (this.debugMode) {
            //     attractor.showInference();
            //     attractor.showKill();
            // }
        }
    }
}
