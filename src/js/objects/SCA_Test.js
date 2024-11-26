import RandomNumberGenerator from "../randomNumberGenerator";
import MyAnimateObject from "./myAnimateObject";

import Attractor from "../SCA/attractor";
import Node from "../SCA/node";
import SCA from "../SCA/spaceColonizationAlgorithm";
import Utils from "../utils";

import * as THREE from "three";

export default class SCA_Test extends MyAnimateObject {
    static PARAMS = {
        seed: RandomNumberGenerator.DEFAULT_SEED,
        maxIteration: 1000,

        // Attractors
        influenceDistance: 10,
        killDistance: 2,
        positionX: -5,
        positionY: 5,
        positionZ: 5,

        // Node
        segmentLength: 0.5,
        basicThickness: 1,
        canalizeThickness: 0.1,
        maxThickness: 20,
        color: {
            r: 139,
            g: 69,
            b: 19,
        },
    };

    static NAME = "SCA-Test";

    static getParams() {
        return SCA_Test.PARAMS;
    }

    constructor(
        scene,
        debugMode = false,
        // numAttractors = SC_Coral_Test.PARAMS.numAttractors,
        seed = SCA_Test.PARAMS.seed,
        maxIteration = SCA_Test.PARAMS.maxIteration,
        influenceDistance = SCA_Test.PARAMS.influenceDistance,
        killDistance = SCA_Test.PARAMS.killDistance,
        segmentLength = SCA_Test.PARAMS.segmentLength,
        basicThickness = SCA_Test.PARAMS.basicThickness,
        canalizeThickness = SCA_Test.PARAMS.canalizeThickness,
        maxThickness = SCA_Test.PARAMS.maxThickness,
        colorRGB = SCA_Test.PARAMS.color,
        positionX = SCA_Test.PARAMS.positionX,
        positionY = SCA_Test.PARAMS.positionY,
        positionZ = SCA_Test.PARAMS.positionZ
    ) {
        super(scene, debugMode);
        RandomNumberGenerator.setSeed(seed);
        this.seed = seed;
        this.influenceDistance = influenceDistance;
        this.killDistance = killDistance;
        this.segmentLength = segmentLength;
        this.basicThickness = basicThickness;
        this.canalizeThickness = canalizeThickness;
        this.maxThickness = maxThickness;
        this.colorRGB = colorRGB;
        this.maxIteration = maxIteration;

        this.positionX = positionX;
        this.positionY = positionY;
        this.positionZ = positionZ;

        this.SCA = null;
    }

    generate() {
        const attractors = this.generateAttractors();

        if (this.debugMode) {
            for (const attractor of attractors) {
                attractor.generate();
                attractor.showInference();
                attractor.showKill();
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
        const position = new THREE.Vector3(
            this.positionX,
            this.positionY,
            this.positionZ
        );
        const attractors = [];
        const attractor = new Attractor(
            this.scene,
            this.debugMode,
            position,
            this.influenceDistance,
            this.killDistance
        );
        attractors.push(attractor);
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
