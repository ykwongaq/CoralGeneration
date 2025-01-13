import * as THREE from "three";
import MyAnimateObject from "./myAnimateObject";
import Utils from "../utils";
import StochasticLSystem from "../LSystem/stochasticLSystem";
import RandomNumberGenerator from "../randomNumberGenerator";
import Curve from "./curve";

import Node from "../SCA/node";
import Attractor from "../SCA/attractor";
import SCA from "../SCA/spaceColonizationAlgorithm";

export default class PreciousCoral extends MyAnimateObject {
    static PARAMS = {
        seed: RandomNumberGenerator.getSeed(),

        // nodes
        iterations: 3,
        stemLength: 2,
        segmentLength: 0.5,
        stemThickness: 3,
        canalizeThickness: 0.01,
        maxThickness: 20,
        branchAngle: Math.PI / 3,

        // Attractors
        height: 5,
        radius: 10,
        numAttractors: 4000,
        influenceDistance: 10,
        killDistance: 1,

        startColor: {
            r: 255,
            g: 0,
            b: 0,
        },

        endColor: {
            r: 0,
            g: 0,
            b: 255,
        },
    };

    static NAME = "PreciousCoral";

    static getParams() {
        return PreciousCoral.PARAMS;
    }

    constructor(
        scene,
        debugMode = false,
        position = new THREE.Vector3(0, 0, 0),
        direction = Utils.getUpVector(),
        iterations = PreciousCoral.PARAMS.iterations,
        seed = PreciousCoral.PARAMS.seed,
        stemLength = PreciousCoral.PARAMS.stemLength,
        segmentLength = PreciousCoral.PARAMS.segmentLength,
        stemThickness = PreciousCoral.PARAMS.stemThickness,
        branchAngle = PreciousCoral.PARAMS.branchAngle,
        startColorRGB = PreciousCoral.PARAMS.startColor,
        endColorRGB = PreciousCoral.PARAMS.endColor,
        canalizeThickness = PreciousCoral.PARAMS.canalizeThickness,
        maxThickness = PreciousCoral.PARAMS.maxThickness,
        height = PreciousCoral.PARAMS.height,
        radius = PreciousCoral.PARAMS.radius,
        numAttractors = PreciousCoral.PARAMS.numAttractors,
        influenceDistance = PreciousCoral.PARAMS.influenceDistance,
        killDistance = PreciousCoral.PARAMS.killDistance
    ) {
        super(scene, debugMode);
        RandomNumberGenerator.setSeed(seed);
        this.position = position;
        this.direction = direction;
        this.iterations = iterations;
        this.stemLength = stemLength;
        this.segmentLength = segmentLength;
        this.stemThickness = stemThickness;
        this.branchAngle = branchAngle;
        this.startColorRGB = startColorRGB;
        this.endColorRGB = endColorRGB;
        this.canalizeThickness = canalizeThickness;
        this.maxThickness = maxThickness;
        this.height = height;
        this.radius = radius;
        this.numAttractors = numAttractors;
        this.influenceDistance = influenceDistance;
        this.killDistance = killDistance;

        const axiom = "F";
        const rules = {
            F: [
                { replacement: "LF", probability: 0.2 },
                { replacement: "L[+F][+F]", probability: 0.7 },
                { replacement: "L[+F][+F][+F]", probability: 0.1 },
            ],
        };
        const L_System = new StochasticLSystem(axiom, rules);
        this.sentence = L_System.generate(this.iterations);

        this.SCA = null;
    }

    generate() {
        let nodes = this.generateStem();
        for (const node of nodes) {
            node.generate();
        }

        let attractors = this.generateAttractors();

        if (this.debugMode) {
            for (const attractor of attractors) {
                attractor.generate();
            }
        }

        this.SCA = new SCA(attractors, nodes, this.segmentLength, 10000);
    }

    generateStem() {
        const stack = [];

        let initSegmentList = new SegmentList();
        let currentBranchCondition = new this.BranchCondition(
            this.position,
            this.direction,
            this.stemThickness,
            this.stemLength,
            this.startColorRGB,
            initSegmentList
        );

        let currentDirection;
        let newDirection;

        let allSegmentList = [];

        for (const char of this.sentence) {
            switch (char) {
                case "F":
                case "L":
                    var segment = this.createSegment(
                        currentBranchCondition.getPosition(),
                        currentBranchCondition.getDirection(),
                        currentBranchCondition.getThickness(),
                        currentBranchCondition.getLength()
                    );
                    var endPoint = segment.getEndPoint();
                    currentBranchCondition.setPosition(endPoint);
                    currentBranchCondition.getSegmentList().addSegment(segment);
                    break;
                case "+":
                    currentDirection = currentBranchCondition.getDirection();
                    newDirection = currentDirection
                        .applyAxisAngle(
                            Utils.Z,
                            RandomNumberGenerator.seedRandom(
                                -this.branchAngle,
                                this.branchAngle
                            )
                        )
                        .normalize();
                    currentBranchCondition.setDirection(newDirection);
                    break;
                case "[":
                    stack.push(currentBranchCondition.clone());
                    currentBranchCondition.setLayer(
                        currentBranchCondition.getLayer() + 1
                    );

                    break;
                case "]":
                    allSegmentList.push(
                        currentBranchCondition.getSegmentList()
                    );
                    currentBranchCondition = stack.pop();
                    break;
                default:
                    console.error(`Invalid character: ${char}`);
                    break;
            }
        }

        const uniqueSegmentLists =
            SegmentList.filterRedundantSegmentLists(allSegmentList);
        const pointLists = [];
        for (const segmentList of uniqueSegmentLists) {
            const curve = new Curve(
                this.scene,
                this.debugMode,
                segmentList.getControlPoints(),
                segmentList.getStartWidth(),
                segmentList.getEndWidth(),
                this.startColorRGB,
                this.endColorRGB,
                Curve.CATNULL_ROM
            );

            const intermediatePoints = curve.getCurve().getPoints(10);
            pointLists.push(intermediatePoints);
        }

        const nodes = this.initNodes(pointLists);
        return nodes;
    }

    initNodes(pointLists) {
        const epsilon = 1e-6;
        const nodeMap = new Map();

        // Helper function to find or create a node
        let findOrCreateNode = (position) => {
            // Check if a node already exists at this position
            for (const [key, node] of nodeMap.entries()) {
                if (key.distanceTo(position) < epsilon) {
                    return node; // Return the existing node
                }
            }

            // Otherwise, create a new node
            const newNode = new Node(
                this.scene,
                this.debugMode,
                position,
                null,
                this.stemThickness,
                this.canalizeThickness,
                this.maxThickness,
                this.startColorRGB
            );
            nodeMap.set(position, newNode);
            return newNode;
        };

        // Process each node in the point lists
        for (const pointList of pointLists) {
            if (pointList.length < 2) {
                throw new Error(
                    "Each list must have at least two points (parent and child)."
                );
            }

            // The first point is the parent
            const parentPosition = pointList[0];
            let parentNode = findOrCreateNode(parentPosition);

            // The remaining points are the children
            for (let i = 1; i < pointList.length; i++) {
                const childPosition = pointList[i];
                const childNode = findOrCreateNode(childPosition);

                // Set the parent of the child
                childNode.setParent(parentNode);

                // Set the parent node as no longer a leaf
                parentNode.setIsLeaf(false);

                parentNode = childNode; // Move to the next parent
            }
        }

        return Array.from(nodeMap.values());
    }

    generateAttractors() {
        const attractors = [];
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

    createSegment(startPoint, direction, thickness, lenght) {
        const endPoint = startPoint
            .clone()
            .add(direction.clone().multiplyScalar(lenght));
        return new Segment(startPoint, endPoint, thickness, thickness);
    }

    async startRender() {
        // Clear all nodes' lines so that it will be redrawn
        for (const node of this.SCA.getNodes()) {
            node.line = null;
        }
        for (let i = 0; i < 10000; i++) {
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

            if (i < 200) {
                await Utils.sleep(1000 / 30);
            }
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

    // Inner class
    BranchCondition = class {
        constructor(
            position,
            direction,
            thickness,
            length,
            color,
            segmentList,
            layer = 0
        ) {
            this.position = position;
            this.direction = direction;
            this.thickness = thickness;
            this.length = length;
            this.color = color;
            this.layer = layer;
            this.segmentList = segmentList;
        }

        getLayer() {
            return this.layer;
        }

        setLayer(layer) {
            this.layer = layer;
        }

        setPosition(position) {
            this.position = position;
        }

        setDirection(direction) {
            this.direction = direction;
        }

        setThickness(thickness) {
            this.thickness = thickness;
        }

        setLength(length) {
            this.length = length;
        }

        setColor(color) {
            this.color = color;
        }

        getPosition() {
            return this.position;
        }

        getDirection() {
            return this.direction;
        }

        getThickness() {
            return this.thickness;
        }

        getLength() {
            return this.length;
        }

        getColor() {
            return this.color;
        }

        setSegmentList(segmentList) {
            this.segmentList = segmentList;
        }

        getSegmentList() {
            return this.segmentList;
        }

        clone() {
            const clone = new this.constructor(
                this.position.clone(),
                this.direction.clone(),
                this.thickness,
                this.length,
                this.color,
                this.segmentList.clone(),
                this.layer
            );
            return clone;
        }
    };
}

export class Segment {
    constructor(startPoint, endPoint, startWidth = 1, endWidth = 1) {
        this.startPoint = startPoint.clone();
        this.endPoint = endPoint.clone();
        this.startWidth = startWidth;
        this.endWidth = endWidth;
    }

    getStartPoint() {
        return this.startPoint;
    }

    getEndPoint() {
        return this.endPoint;
    }

    getStartWidth() {
        return this.startWidth;
    }

    getEndWidth() {
        return this.endWidth;
    }

    clone() {
        return new Segment(
            this.startPoint,
            this.endPoint,
            this.startWidth,
            this.endWidth
        );
    }
}

export class SegmentList {
    constructor(segments = []) {
        this.segments = segments;
    }

    addSegment(segment) {
        this.segments.push(segment);
    }

    getStartWidth() {
        if (this.segments.length === 0) {
            throw new Error("Segment list is empty");
        }
        return this.segments[0].getStartWidth();
    }

    getEndWidth() {
        if (this.segments.length === 0) {
            throw new Error("Segment list is empty");
        }
        return this.segments[this.segments.length - 1].getEndWidth();
    }

    getControlPoints() {
        const controlPoints = [];
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            const startPoint = segment.getStartPoint();
            const endPoint = segment.getEndPoint();

            if (
                controlPoints.length === 0 ||
                !Utils.isVectorEqual(
                    controlPoints[controlPoints.length - 1],
                    startPoint
                )
            ) {
                controlPoints.push(startPoint);
            }

            controlPoints.push(endPoint);
        }

        return controlPoints;
    }

    clone() {
        const clone = new SegmentList();
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            clone.addSegment(segment.clone());
        }
        return clone;
    }

    // Static method to filter redundant SegmentLists
    static filterRedundantSegmentLists(segmentLists) {
        const trie = new Trie();

        // Sort the SegmentLists by length (number of control points), descending
        segmentLists.sort(
            (a, b) => b.getControlPoints().length - a.getControlPoints().length
        );

        // Insert each SegmentList's control points into the Trie
        const uniqueSegmentLists = [];
        for (const segmentList of segmentLists) {
            const controlPoints = segmentList.getControlPoints();
            const isRedundant = trie.insert(controlPoints); // Insert the control points into the Trie

            if (!isRedundant) {
                uniqueSegmentLists.push(segmentList); // Add to the result if it's not redundant
            }
        }

        return uniqueSegmentLists;
    }
}

// Define the TrieNode class
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfList = false;
    }
}

// Define the Trie class
class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    // Insert a list into the trie
    insert(list) {
        let currentNode = this.root;
        let isRedundant = true;

        for (const point of list) {
            // Find a matching key with tolerance
            const key = [...currentNode.children.keys()].find((k) => {
                const [kx, ky, kz] = k.split(",").map(Number);
                const candidate = new THREE.Vector3(kx, ky, kz);
                return Utils.isVectorEqual(candidate, point);
            });

            if (!key) {
                // If no matching key is found, create a new node
                const newKey = `${point.x},${point.y},${point.z}`;
                currentNode.children.set(newKey, new TrieNode());
                isRedundant = false; // If a new node is created, the list is not redundant
            }

            // Move to the next node
            const nextKey = key || `${point.x},${point.y},${point.z}`;
            currentNode = currentNode.children.get(nextKey);

            // If this node is marked as the end of another list, that list is redundant
            if (currentNode.isEndOfList) {
                currentNode.isEndOfList = false;
            }
        }

        // Mark the current node as the end of this list
        currentNode.isEndOfList = true;

        return isRedundant;
    }

    // Retrieve all unique lists from the trie
    getUniqueLists() {
        const result = [];

        const traverse = (node, currentList) => {
            if (node.isEndOfList) {
                result.push([...currentList]); // Push a copy of the current list
            }

            for (const [key, childNode] of node.children) {
                const [x, y, z] = key.split(",").map(Number); // Parse the key back into a Vector3
                const point = new THREE.Vector3(x, y, z);
                currentList.push(point);
                traverse(childNode, currentList);
                currentList.pop(); // Backtrack
            }
        };

        traverse(this.root, []);
        return result;
    }
}
