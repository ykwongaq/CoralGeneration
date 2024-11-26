import RandomNumberGenerator from "../randomNumberGenerator";
import MyAnimateObject from "./myAnimateObject";

import Attractor from "../SCA/attractor";
import Node from "../SCA/node";
import SCA from "../SCA/spaceColonizationAlgorithm";
import Utils from "../utils";

import * as THREE from "three";

export default class ObstacleTest extends MyAnimateObject {
    static PARAMS = {
        radius: 30,
        numAttractors: 3000,
        seed: RandomNumberGenerator.DEFAULT_SEED,
        maxIteration: 1000,

        // Attractors
        influenceDistance: 10,
        killDistance: 2,

        // Node
        segmentLength: 1,
        basicThickness: 5,
        canalizeThickness: 0.01,
        maxThickness: 20,
        color: {
            r: 139,
            g: 69,
            b: 19,
        },

        // Obstacle
        showObstacle: true,
        obstacleHeight: 20,
        obstacleWidth: 25,
        obstacleDepth: 30,
        positionX: -20,
        positionY: 10,
        positionZ: 0,
    };

    static NAME = "Obstacle Test";

    static getParams() {
        return ObstacleTest.PARAMS;
    }

    constructor(
        scene,
        debugMode = false,
        radius = ObstacleTest.PARAMS.radius,
        numAttractors = ObstacleTest.PARAMS.numAttractors,
        seed = ObstacleTest.PARAMS.seed,
        maxIteration = ObstacleTest.PARAMS.maxIteration,
        influenceDistance = ObstacleTest.PARAMS.influenceDistance,
        killDistance = ObstacleTest.PARAMS.killDistance,
        segmentLength = ObstacleTest.PARAMS.segmentLength,
        basicThickness = ObstacleTest.PARAMS.basicThickness,
        canalizeThickness = ObstacleTest.PARAMS.canalizeThickness,
        maxThickness = ObstacleTest.PARAMS.maxThickness,
        colorRGB = ObstacleTest.PARAMS.color
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

        this.obstacleRadius = ObstacleTest.PARAMS.obstacleHeight;
        this.obstaclePosition = new THREE.Vector3(
            ObstacleTest.PARAMS.positionX,
            ObstacleTest.PARAMS.positionY,
            ObstacleTest.PARAMS.positionZ
        );

        const geometry = new THREE.BoxGeometry(
            ObstacleTest.PARAMS.obstacleWidth,
            ObstacleTest.PARAMS.obstacleHeight,
            ObstacleTest.PARAMS.obstacleDepth
        );
        const material = new THREE.MeshBasicMaterial({
            color: Utils.RGB2Color(52, 141, 182),
            transparent: true,
            opacity: 0.4,
        });
        this.obstacle = new THREE.Mesh(geometry, material);
        // Move the obstacle to the specified position
        this.obstacle.position.set(
            this.obstaclePosition.x,
            this.obstaclePosition.y,
            this.obstaclePosition.z
        );
        this.obstacle.isMyObject = true;

        this.obstacleBBox = new THREE.Box3().setFromObject(this.obstacle);

        this.showObstacle = ObstacleTest.PARAMS.showObstacle;
        this.SCA = null;
    }

    generate() {
        const attractors = this.generateAttractors();

        if (this.showObstacle) {
            this.scene.add(this.obstacle);
        }

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
            const r =
                this.radius * Math.cbrt(RandomNumberGenerator.seedRandom());
            const theta = RandomNumberGenerator.seedRandom() * Math.PI;
            const phi = Math.acos(2 * RandomNumberGenerator.seedRandom() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            const point = new THREE.Vector3(x, y, z);

            // Check if the attractor is inside the obstacle
            if (this.obstacleBBox.containsPoint(point)) {
                continue;
            }

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
        if (this.showObstacle) {
            this.scene.add(this.obstacle);
        }

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
