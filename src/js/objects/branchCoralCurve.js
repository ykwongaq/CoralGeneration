import * as THREE from "three";
import MyObject from "./myObject";
import RandomNumberGenerator from "../randomNumberGenerator";
import Utils from "../utils";
import StochasticLSystem from "../LSystem/stochasticLSystem";
import Curve from "./curve";

export default class BranchCoralCurve extends MyObject {
    static PARAMS = {
        // L-System Settings
        iteration: 4,
        seed: RandomNumberGenerator.getSeed(),

        // Branch Settings
        rootThickness: 8,
        rootLength: 2,
        branchThicknessScaler: 0.8,
        branchLengthScaler: 0.8,
        branchMaxAngle: Math.PI / 6,
        branchColor: {
            r: 139,
            g: 69,
            b: 19,
        },
        curveType: Curve.CATNULL_ROM,

        // Center oriented
        centerOriented: true,
        centerDegree: 0.5,
    };

    static NAME = "BranchCoralCurve";

    static getParams() {
        return BranchCoralCurve.PARAMS;
    }

    constructor(
        scene,
        debugMode = false,
        position = new THREE.Vector3(0, 0, 0),
        direction = Utils.getUpVector(),
        iteration = BranchCoralCurve.PARAMS.iteration,
        rootThickness = BranchCoralCurve.PARAMS.rootThickness,
        rootLength = BranchCoralCurve.PARAMS.rootLength,
        branchThicknessScaler = BranchCoralCurve.PARAMS.branchThicknessScaler,
        branchLengthScaler = BranchCoralCurve.PARAMS.branchLengthScaler,
        branchMaxAngle = BranchCoralCurve.PARAMS.branchMaxAngle,
        seed = BranchCoralCurve.PARAMS.seed,
        centerOriented = BranchCoralCurve.PARAMS.centerOriented,
        centerDegree = BranchCoralCurve.PARAMS.centerDegree,
        colorRGB = BranchCoralCurve.PARAMS.branchColor,
        curveType = BranchCoralCurve.PARAMS.curveType
    ) {
        super(scene, debugMode);
        RandomNumberGenerator.setSeed(seed);
        this.position = position;
        this.direction = direction;
        this.iteration = iteration;
        this.rootThickness = rootThickness;
        this.rootLength = rootLength;
        this.branchThicknessScaler = branchThicknessScaler;
        this.branchLengthScaler = branchLengthScaler;
        this.branchMaxAngle = branchMaxAngle;
        this.seed = seed;
        this.centerOriented = centerOriented;
        this.centerDegree = centerDegree;
        this.branchColor = colorRGB;
        this.curveType = curveType;

        const axiom = "F";
        const rules = {
            F: [
                { replacement: "F", probability: 0.3 },
                { replacement: "F[+F][+F]", probability: 0.2 },
                { replacement: "F[+F][+F][+F]", probability: 0.1 },
                { replacement: "[+F][F]", probability: 0.2 },
                { replacement: "F[+F]", probability: 0.2 },
            ],
        };
        const L_System = new StochasticLSystem(axiom, rules);
        this.sentence = L_System.generate(this.iteration);
        // console.log(this.sentence);
    }

    createSegment(startPoint, direction, thickness, lenght) {
        const endPoint = startPoint
            .clone()
            .add(direction.clone().multiplyScalar(lenght));
        return new Segment(startPoint, endPoint, thickness, thickness);
    }

    generate() {
        const stack = [];

        let initSegmentList = new SegmentList();
        let currentBranchCondition = new this.BranchCondition(
            this.position,
            this.direction,
            this.rootThickness,
            this.rootLength,
            this.branchColor,
            initSegmentList
        );

        let currentDirection;
        let newDirection;

        let allSegmentList = [];

        for (const char of this.sentence) {
            switch (char) {
                case "F":
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

                    const randomAxis = Utils.getRandomDirection();
                    const randomAngle =
                        (RandomNumberGenerator.seedRandom() * 2 - 1) *
                        this.branchMaxAngle;

                    newDirection = currentDirection
                        .applyAxisAngle(randomAxis, randomAngle)
                        .normalize();

                    if (this.centerOriented) {
                        const p = this.calProbability(
                            currentBranchCondition.getLayer()
                        );
                        const randomNumber = RandomNumberGenerator.seedRandom();

                        if (randomNumber < p) {
                            // Coral branches will tends to grow towards the center
                            let alpha = Utils.dotProduct(
                                Utils.getUpVector().normalize(),
                                newDirection.clone()
                            );
                            alpha = Math.max(0, Math.min(1, alpha));

                            const vector1 = Utils.getUpVector()
                                .clone()
                                .multiplyScalar(1 - alpha);
                            const vector2 = newDirection
                                .clone()
                                .multiplyScalar(alpha);

                            newDirection = vector1.add(vector2);
                            newDirection.normalize();
                        }
                    }

                    currentBranchCondition.setDirection(newDirection);
                    break;
                case "L":
                    var segment = this.createSegment(
                        currentBranchCondition.getPosition(),
                        currentBranchCondition.getDirection(),
                        currentBranchCondition.getThickness(),
                        currentBranchCondition.getThickness(),
                        currentBranchCondition.getLength() * 0.2
                    );
                    var endPoint = segment.getEndPoint();
                    currentBranchCondition.setPosition(endPoint);
                    currentBranchCondition.getSegmentList().addSegment(segment);
                    break;
                case "[":
                    stack.push(currentBranchCondition.clone());
                    currentBranchCondition.setThickness(
                        currentBranchCondition.getThickness() *
                            this.branchThicknessScaler
                    );
                    currentBranchCondition.setLength(
                        currentBranchCondition.getLength() *
                            this.branchLengthScaler
                    );
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
        for (const segmentList of uniqueSegmentLists) {
            const curve = new Curve(
                this.scene,
                this.debugMode,
                segmentList.getControlPoints(),
                segmentList.getStartWidth(),
                segmentList.getEndWidth(),
                this.branchColor,
                this.curveType
            );
            curve.generate();
        }
    }

    calProbability(i) {
        return 1 - Math.exp(-this.centerDegree * i);
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
