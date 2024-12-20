import * as THREE from "three";
import MyObject from "./myObject";
import RandomNumberGenerator from "../randomNumberGenerator";
import Utils from "../utils";
import Cylinder from "./cylinder";
import StochasticLSystem from "../LSystem/stochasticLSystem";

export default class LSystemTree extends MyObject {
    static PARAMS = {
        iteration: 1,
        rootThickness: 0.1,
        rootLength: 2,
        branchThicknessScaler: 0.8,
        branchLengthScaler: 0.8,
        branchMaxAngle: Math.PI / 12,

        branchRadioSegments: 8,
        branchHeightSegments: 1,
        branchOpenEnded: false,
        branchThetaStart: 0,
        branchThetaLength: Math.PI * 2,
        branchColor: {
            r: 139,
            g: 69,
            b: 19,
        },

        seed: RandomNumberGenerator.getSeed(),
    };

    static NAME = "LSystemTree";

    constructor(
        scene,
        debugMode = false,
        position = new THREE.Vector3(0, 0, 0),
        direction = Utils.getUpVector(),
        iteration = LSystemTree.PARAMS.iteration,
        rootThickness = LSystemTree.PARAMS.rootThickness,
        rootLength = LSystemTree.PARAMS.rootLength,
        branchThicknessScaler = LSystemTree.PARAMS.branchThicknessScaler,
        branchLengthScaler = LSystemTree.PARAMS.branchLengthScaler,
        branchMaxAngle = LSystemTree.PARAMS.branchMaxAngle,
        seed = LSystemTree.PARAMS.seed
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

        const axiom = "F";
        const rules = {
            F: [
                { replacement: "LF", probability: 0.3 },
                { replacement: "F[+F][+F]", probability: 0.2 },
                { replacement: "F[+F][+F][+F]", probability: 0.1 },
                { replacement: "F[+L+F][+L+F]", probability: 0.2 },
                { replacement: "F[+F]", probability: 0.2 },
            ],
        };
        const L_System = new StochasticLSystem(axiom, rules);
        this.sentence = L_System.generate(this.iteration);
    }

    createBranch(
        position,
        direction,
        radiusTop,
        radiusBottom,
        height,
        radialSegments = LSystemTree.PARAMS.branchRadioSegments,
        heightSegments = LSystemTree.PARAMS.branchHeightSegments,
        openEnded = LSystemTree.PARAMS.branchOpenEnded,
        thetaStart = LSystemTree.PARAMS.branchThetaStart,
        thetaLength = LSystemTree.PARAMS.branchThetaLength,
        color = LSystemTree.PARAMS.branchColor
    ) {
        const branch = new Cylinder(
            this.scene,
            this.debugMode,
            radiusTop,
            radiusBottom,
            height,
            radialSegments,
            heightSegments,
            openEnded,
            thetaStart,
            thetaLength,
            color
        );
        let currentDirection = new THREE.Vector3(0, 0, 0);
        branch.mesh.getWorldDirection(currentDirection);
        currentDirection.normalize();

        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(
            Utils.getUpVector(),
            direction.clone().normalize()
        );
        branch.mesh.applyQuaternion(quaternion);

        // console.log("currentDir: ", currentDirection);
        branch.mesh.position.copy(
            position.clone().add(direction.clone().multiplyScalar(height / 2))
        );

        // const meshCenter = branch.mesh.position.clone();
        const endPoint = new THREE.Vector3().addVectors(
            position,
            direction.clone().multiplyScalar(height)
        );
        branch.generate();
        return endPoint;
    }

    generate() {
        const stack = [];
        let currentBranchCondition = new this.BranchCondition(
            this.position,
            this.direction,
            this.rootThickness,
            this.rootLength
        );

        let currentDirection;
        let newDirection;

        for (const char of this.sentence) {
            switch (char) {
                case "F":
                    var endPoint = this.createBranch(
                        currentBranchCondition.getPosition(),
                        currentBranchCondition.getDirection(),
                        currentBranchCondition.getThickness(),
                        currentBranchCondition.getThickness(),
                        currentBranchCondition.getLength()
                    );
                    currentBranchCondition.setPosition(endPoint);
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

                    currentBranchCondition.setDirection(newDirection);
                    break;
                case "-":
                    const lastRotation =
                        currentBranchCondition.getLastRotation();
                    if (lastRotation) {
                        currentDirection =
                            currentBranchCondition.getDirection();
                        // Revert the rotation
                        newDirection = currentDirection.applyAxisAngle(
                            lastRotation.axis,
                            -lastRotation.angle
                        );
                        currentBranchCondition.setDirection(newDirection);
                    }
                    break;
                case "L":
                    var endPoint = this.createBranch(
                        currentBranchCondition.getPosition(),
                        currentBranchCondition.getDirection(),
                        currentBranchCondition.getThickness(),
                        currentBranchCondition.getThickness(),
                        currentBranchCondition.getLength() * 0.2
                    );
                    currentBranchCondition.setPosition(endPoint);
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
                    break;
                case "]":
                    currentBranchCondition = stack.pop();
                    break;
                default:
                    console.error(`Invalid character: ${char}`);
                    break;
            }
        }
    }

    static getParams() {
        return LSystemTree.PARAMS;
    }

    // Inner class
    BranchCondition = class {
        constructor(position, direction, thickness, length, color) {
            this.position = position;
            this.direction = direction;
            this.thickness = thickness;
            this.length = length;
            this.color = color;
            this.lastRotation = null; // Store the last random rotation
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

        setLastRotation(axis, angle) {
            this.lastRotation = { axis, angle };
        }

        getLastRotation() {
            return this.lastRotation;
        }

        clone() {
            const clone = new this.constructor(
                this.position.clone(),
                this.direction.clone(),
                this.thickness,
                this.length,
                this.color
            );
            clone.lastRotation = this.lastRotation; // Clone the last rotation
            return clone;
        }
    };
}
