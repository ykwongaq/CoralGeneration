import * as THREE from "three";
import MyObject from "./myObject";
import Utils from "../utils";
import Cylinder from "./cylinder";
import LSystem from "../LSystem/lSystem";

export default class FlatTree extends MyObject {
    static PARAMS = {
        iteration: 1,
        rootThickness: 0.1,
        rootLength: 2,
        branchThicknessScaler: 0.8,
        branchLengthScaler: 0.8,
        branchAngle: Math.PI / 6,

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
    };

    static NAME = "FlatTree";

    constructor(
        scene,
        debugMode = false,
        position = new THREE.Vector3(0, 0, 0),
        direction = Utils.getUpVector(),
        iteration = FlatTree.PARAMS.iteration,
        rootThickness = FlatTree.PARAMS.rootThickness,
        rootLength = FlatTree.PARAMS.rootLength,
        branchThicknessScaler = FlatTree.PARAMS.branchThicknessScaler,
        branchLengthScaler = FlatTree.PARAMS.branchLengthScaler,
        branchAngle = FlatTree.PARAMS.branchAngle
    ) {
        super(scene, debugMode);
        this.position = position;
        this.direction = direction;
        this.iteration = iteration;
        this.rootThickness = rootThickness;
        this.rootLength = rootLength;
        this.branchThicknessScaler = branchThicknessScaler;
        this.branchLengthScaler = branchLengthScaler;
        this.branchAngle = branchAngle;

        const axiom = "F";
        const rules = {
            F: "F[+F][-F]",
        };
        const L_System = new LSystem(axiom, rules);
        this.sentence = L_System.generate(this.iteration);
    }

    createBranch(
        position,
        direction,
        radiusTop,
        radiusBottom,
        height,
        radialSegments = FlatTree.PARAMS.branchRadioSegments,
        heightSegments = FlatTree.PARAMS.branchHeightSegments,
        openEnded = FlatTree.PARAMS.branchOpenEnded,
        thetaStart = FlatTree.PARAMS.branchThetaStart,
        thetaLength = FlatTree.PARAMS.branchThetaLength,
        color = FlatTree.PARAMS.branchColor
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
                    const endPoint = this.createBranch(
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
                    newDirection = currentDirection
                        .applyAxisAngle(Utils.Z, this.branchAngle)
                        .normalize();
                    currentBranchCondition.setDirection(newDirection);
                    break;
                case "-":
                    currentDirection = currentBranchCondition.getDirection();
                    newDirection = currentDirection
                        .applyAxisAngle(Utils.Z, -this.branchAngle)
                        .normalize();
                    currentBranchCondition.setDirection(newDirection);
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
        return FlatTree.PARAMS;
    }

    BranchCondition = class {
        constructor(position, direction, thickness, length) {
            this.position = position;
            this.direction = direction;
            this.thickness = thickness;
            this.length = length;
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

        clone() {
            return new this.constructor(
                this.position.clone(),
                this.direction.clone(),
                this.thickness,
                this.length
            );
        }
    };
}
