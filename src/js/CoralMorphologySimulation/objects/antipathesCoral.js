import RandomNumberGenerator from "../randomNumberGenerator";
import MyAnimateObject from "./myAnimateObject";

import Attractor from "../SCA/attractor";
import Node from "../SCA/node";
import SCA from "../SCA/spaceColonizationAlgorithm";
import Utils from "../utils";

import * as THREE from "three";

export default class AntipathesCoral extends MyAnimateObject {
    static PARAMS = {
        radius: 30,
        numAttractors: 3000,
        seed: RandomNumberGenerator.DEFAULT_SEED,
        maxIteration: 1000,

        // Attractors
        influenceDistance: 30,
        killDistance: 1,

        // Node
        segmentLength: 1,
        basicThickness: 5,
        canalizeThickness: 0,
        maxThickness: 20,
        color: {
            r: 128,
            g: 0,
            b: 128,
        },
    };

    static NAME = "AntipathesCoral";

    static getParams() {
        return AntipathesCoral.PARAMS;
    }

    constructor(
        scene,
        debugMode = false,
        radius = AntipathesCoral.PARAMS.radius,
        numAttractors = AntipathesCoral.PARAMS.numAttractors,
        seed = AntipathesCoral.PARAMS.seed,
        maxIteration = AntipathesCoral.PARAMS.maxIteration,
        influenceDistance = AntipathesCoral.PARAMS.influenceDistance,
        killDistance = AntipathesCoral.PARAMS.killDistance,
        segmentLength = AntipathesCoral.PARAMS.segmentLength,
        basicThickness = AntipathesCoral.PARAMS.basicThickness,
        canalizeThickness = AntipathesCoral.PARAMS.canalizeThickness,
        maxThickness = AntipathesCoral.PARAMS.maxThickness,
        colorRGB = AntipathesCoral.PARAMS.color
    ) {
        super(scene, debugMode);
        RandomNumberGenerator.setSeed(seed);
        this.radius = radius;
        this.numAttractors = numAttractors;
        this.influenceDistance = influenceDistance;
        this.killDistance = killDistance;
        this.segmentLength = segmentLength;
        this.basicThickness = basicThickness;
        this.canalizeThickness = canalizeThickness;
        this.maxThickness = maxThickness;
        this.colorRGB = colorRGB;
        this.maxIteration = maxIteration;

        this.SCA = null;
    }

    generate() {
        const attractors = this.generateAttractors();

        if (this.debugMode) {
            for (const attractor of attractors) {
                attractor.generate();
            }
        }
        const nodes = [];

        const initNode = new Node(
            this.scene,
            this.debugMode,
            new THREE.Vector3(0, 0, 0),
            null,
            this.basicThickness,
            this.canalizeThickness,
            this.maxThickness,
            this.colorRGB
        );
        nodes.push(initNode);
        this.SCA = new SCA(
            attractors,
            nodes,
            this.segmentLength,
            this.maxIteration
        );
    }

    generateAttractors() {
        const attractors = [];

        this.height = 1;
        this.radius = 20;

        for (let i = 0; i < this.numAttractors; i++) {
            const y_ =
                RandomNumberGenerator.seedRandom() * this.height -
                this.height / 2;

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

            y += this.radius;

            const point = new THREE.Vector3(x, y, z);

            const attractor = new Attractor(
                this.scene,
                this.debugMode,
                point,
                this.influenceDistance,
                this.killDistance
            );
            attractors.push(attractor);
        }
        return attractors;
    }

    async startRender() {
        for (let i = 0; i < this.maxIteration; i++) {
            if (this.SCA.isStopped()) {
                console.log("SCA stopped");
                return;
            }
            this.SCA.step();

            const nodes = this.SCA.getNodes();
            for (let node of nodes) {
                node.generate();
            }

            if (this.debugMode) {
                this.clearAttractorsInScene();
                const attractors = this.SCA.getAttractors();
                for (let attractor of attractors) {
                    attractor.generate();
                }
            }

            await Utils.sleep(1000 / 30);
        }
        console.log("Max iteration reached");
    }

    clearAttractorsInScene() {
        for (let i = this.scene.children.length - 1; i >= 0; i--) {
            let child = this.scene.children[i];
            if (child.isAttractor) {
                this.scene.remove(child);
            }
        }
    }
}
