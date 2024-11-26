import { kdTree } from "kd-tree-javascript";
import Utils from "../utils";
import * as THREE from "three";
import RandomNumberGenerator from "../randomNumberGenerator";

export default class SCA {
    constructor(attractors, nodes, segmentLength, maxIterations = 10000) {
        this.attractors = attractors;

        // The order of nodes affect the animation effects
        this.nodes = nodes;

        this.segmentLength = segmentLength;
        this.maxIterations = maxIterations;

        const kdNodes = this.nodes.map((node) => this.toKDTreeNode(node));
        this.tree = new kdTree(kdNodes, this.distanceFunction, ["position"]);

        this.stopped = false;
    }

    step() {
        this.computeInference();
        this.spawnNewNodes();
        this.eliminateAttractors();
        this.veinThickening();
    }

    isStopped() {
        return this.stopped;
    }

    setIsStoped(stopped) {
        this.stopped = stopped;
    }

    computeInference() {
        // Initialize all nodes
        for (const node of this.nodes) {
            node.clearInfluenceList();
        }
        this.setIsStoped(true);

        // Find the nearest node for each attractor
        for (const attractor of this.attractors) {
            const nearestNodes = this.tree.nearest(attractor, 1);

            const node = nearestNodes[0][0].object;
            const distance = nearestNodes[0][1];

            const influenceDistance = attractor.getInfluenceDistance();

            if (nearestNodes.length == 0 || distance > influenceDistance) {
                continue;
            }

            // New node is added, so that process is not stopped
            this.setIsStoped(false);
            node.addInfluencingAttractor(attractor);
        }
    }

    spawnNewNodes() {
        for (const node of this.nodes) {
            // Compute the average direction of influence
            const influenceDirection = new THREE.Vector3(0, 0, 0);
            const influencingAttractors = node.getInflueceingAttractors();

            if (influencingAttractors.length == 0) {
                continue;
            }

            for (const attractor of influencingAttractors) {
                const direction = attractor
                    .getPosition()
                    .clone()
                    .sub(node.getPosition());
                direction.normalize();
                influenceDirection.add(direction);
            }

            // Add small amount of random "jitter" to avoid getting stuck between two attractors and endlessly generating nodes in the same place
            // (Credit to Davide Prati (edap) for the idea, seen in ofxSpaceColonization)
            const randomDirection = new THREE.Vector3(
                RandomNumberGenerator.seedRandom(-0.1, 0.1),
                RandomNumberGenerator.seedRandom(-0.1, 0.1),
                RandomNumberGenerator.seedRandom(-0.1, 0.1)
            );
            influenceDirection.add(randomDirection);

            influenceDirection
                .divideScalar(influencingAttractors.length)
                .normalize();

            // Spawn new node
            const newNode = node.spawnNewNode(
                influenceDirection,
                this.segmentLength
            );

            // Add new new into current node list
            this.nodes.push(newNode);

            // Add new node to KD Tree
            this.tree.insert(this.toKDTreeNode(newNode));
        }
    }

    eliminateAttractors() {
        // Check if there are any attractors that are too close to nodes
        const attractorsToRemove = [];
        for (const attractor of this.attractors) {
            const nearestNodes = this.tree.nearest(attractor, 1);
            const distance = nearestNodes[0][1];

            const killDistance = attractor.getKillDistance();

            if (distance < killDistance) {
                attractorsToRemove.push(attractor);
            }
        }

        // Remove the attractors that are too close to nodes
        for (const attractor of attractorsToRemove) {
            this.attractors.splice(this.attractors.indexOf(attractor), 1);
        }

        // Stop the process if there are no attractors left
        if (this.attractors.length == 0) {
            this.setIsStoped(true);
        }
    }

    veinThickening() {
        for (const node of this.nodes) {
            if (!node.isLeafNode()) {
                continue;
            }
            node.startAuxinCanalization();
        }
    }

    getAttractors() {
        return this.attractors;
    }

    getNodes() {
        return this.nodes;
    }

    distanceFunction(a, b) {
        return a.position.distanceTo(b.position);
    }

    toKDTreeNode(node) {
        return {
            position: node.getPosition(),
            object: node,
        };
    }
}
