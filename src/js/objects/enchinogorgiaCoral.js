import RandomNumberGenerator from "../randomNumberGenerator";
import MyAnimateObject from "./myAnimateObject";

import Attractor from "../SCA/attractor";
import Node from "../SCA/node";
import SCA from "../SCA/spaceColonizationAlgorithm";
import Utils from "../utils";

import * as THREE from "three";

export default class EnchinogorgiaCoral extends MyAnimateObject {
    static PARAMS = {
        radius: 30,
        numAttractors: 2000,
        seed: RandomNumberGenerator.DEFAULT_SEED,
        maxIteration: 1000,

        // Attractors
        influenceDistance: 30,
        killDistance: 2,

        // Node
        segmentLength: 1,
        basicThickness: 5,
        canalizeThickness: 0.01,
        maxThickness: 20,
        color: {
            r: 193,
            g: 224,
            b: 192,
        },
    };

    static NAME = "EnchinogorgiaCoral";

    static getParams() {
        return EnchinogorgiaCoral.PARAMS;
    }

    constructor(
        scene,
        debugMode = false,
        radius = EnchinogorgiaCoral.PARAMS.radius,
        numAttractors = EnchinogorgiaCoral.PARAMS.numAttractors,
        seed = EnchinogorgiaCoral.PARAMS.seed,
        maxIteration = EnchinogorgiaCoral.PARAMS.maxIteration,
        influenceDistance = EnchinogorgiaCoral.PARAMS.influenceDistance,
        killDistance = EnchinogorgiaCoral.PARAMS.killDistance,
        segmentLength = EnchinogorgiaCoral.PARAMS.segmentLength,
        basicThickness = EnchinogorgiaCoral.PARAMS.basicThickness,
        canalizeThickness = EnchinogorgiaCoral.PARAMS.canalizeThickness,
        maxThickness = EnchinogorgiaCoral.PARAMS.maxThickness,
        colorRGB = EnchinogorgiaCoral.PARAMS.color
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
        for (let i = 0; i < this.numAttractors; i++) {
            const r = RandomNumberGenerator.seedRandom(
                this.radius * 0.3,
                this.radius
            );
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
