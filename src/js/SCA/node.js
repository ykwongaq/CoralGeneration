import SCAObject from "./SCAObject";
import * as THREE from "three";
import Utils from "../utils";

import { Line2 } from "three/addons/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";

export default class Node extends SCAObject {
    static PARAMS = {
        basicThickness: 1,
        canalizeThickness: 0.1,
        maxThickness: 20,
        color: {
            r: 139,
            g: 69,
            b: 19,
        },
    };

    static NAME = "Node";

    static getParams() {
        return Node.PARAMS;
    }

    constructor(
        scene,
        debugMode = false,
        position = new THREE.Vector3(),
        parent = null,
        basicThickness = Node.PARAMS.basicThickness,
        canalizeThickness = Node.PARAMS.canalizeThickness,
        maxThickness = Node.PARAMS.maxThickness,
        color = Node.PARAMS.color
    ) {
        super(scene, debugMode, position);
        this.basicThickness = basicThickness;
        this.addOnThickness = 0;
        this.canalizaeThickness = canalizeThickness;
        this.maxThickness = maxThickness;
        this.color = color;

        this.parent = parent;
        this.isLeaf = true;

        this.influencedBy = [];
        this.line = null;
    }

    addInfluencingAttractor(attractor) {
        this.influencedBy.push(attractor);
    }

    getInflueceingAttractors() {
        return this.influencedBy;
    }

    clearInfluenceList() {
        this.influencedBy = [];
    }

    setIsLeaf(isLeaf) {
        this.isLeaf = isLeaf;
    }

    isLeafNode() {
        return this.isLeaf;
    }

    startAuxinCanalization() {
        if (!this.parent) {
            return;
        }

        const parentThickness = this.parent.getThickness();
        if (parentThickness > this.maxThickness) {
            return;
        }

        this.parent.addThickness(this.canalizaeThickness);
        this.parent.startAuxinCanalization();
    }

    setParent(parent) {
        this.parent = parent;
    }

    getParent() {
        return this.parent;
    }

    getThickness() {
        return this.basicThickness + this.addOnThickness;
    }

    setThickness(thickness) {
        this.basicThickness = thickness;
    }

    addThickness(addOnThickness) {
        this.addOnThickness += addOnThickness;
    }

    spawnNewNode(direction, segmentLength) {
        const newPosition = new THREE.Vector3();
        newPosition.copy(this.position);
        newPosition.addScaledVector(direction, segmentLength);

        const node = new Node(
            this.scene,
            this.debugMode,
            newPosition,
            this,
            this.basicThickness,
            this.canalizaeThickness,
            this.maxThickness,
            this.color
        );

        this.setIsLeaf(false);

        return node;
    }

    generate() {
        if (!this.parent) {
            return;
        }

        if (this.line) {
            this.line.material.linewidth = this.getThickness();
            this.line.material.color = Utils.RGB2Color(
                this.color.r,
                this.color.g,
                this.color.b
            );
            this.line.material.dashed = false;
            this.line.material.needsUpdate = true;
        } else {
            // Draw a line from this node to its parent
            const positions = [];
            const parentPosition = this.parent.getPosition();
            positions.push(
                parentPosition.x,
                parentPosition.y,
                parentPosition.z
            );
            positions.push(this.position.x, this.position.y, this.position.z);

            const lineGeometry = new LineGeometry();
            lineGeometry.setPositions(positions);

            const lineMaterial = new LineMaterial({
                color: Utils.RGB2Color(
                    this.color.r,
                    this.color.g,
                    this.color.b
                ),
                linewidth: this.getThickness(),
                dashed: false,
            });

            this.line = new Line2(lineGeometry, lineMaterial);
            this.line.isMyObject = true;
            this.scene.add(this.line);
        }
    }
}
