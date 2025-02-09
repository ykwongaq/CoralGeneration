import * as THREE from "three";
import { NURBSCurve } from "three/examples/jsm/curves/NURBSCurve.js";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";

import MyObject from "./myObject";
import Utils from "../utils";

export default class Curve extends MyObject {
    static CATNULL_ROM = "CatmullRom";
    static BSPLINE = "BSpline";

    static PARAMS = {
        // Control Point 1
        controlPoint1X: -2,
        controlPoint1Y: -2 + 5,
        controlPoint1Z: 2,

        // Control Point 2
        controlPoint2X: 2,
        controlPoint2Y: 2 + 5,
        controlPoint2Z: -2,

        // Curve Type
        curveType: Curve.CATNULL_ROM,

        // Width
        startWidth: 10,
        endWidth: 1,

        // Color
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

    static NAME = "Curve";

    static DEFAULT_STARTING_POINT = new THREE.Vector3(-5, 5, 0);
    static DEFAULT_ENDING_POINT = new THREE.Vector3(5, 5, 0);

    constructor(
        scene,
        debugMode = false,
        controlPoints = null,
        startWidth = Curve.PARAMS.startWidth,
        endWidth = Curve.PARAMS.endWidth,
        startColorRGB = Curve.PARAMS.startColor,
        endColorRGB = Curve.PARAMS.endColor,
        curveType = Curve.PARAMS.curveType
    ) {
        super(scene, debugMode);

        if (controlPoints === null) {
            this.controlPoints = [
                Curve.DEFAULT_STARTING_POINT,
                new THREE.Vector3(
                    Curve.PARAMS.controlPoint1X,
                    Curve.PARAMS.controlPoint1Y,
                    Curve.PARAMS.controlPoint1Z
                ),
                new THREE.Vector3(
                    Curve.PARAMS.controlPoint2X,
                    Curve.PARAMS.controlPoint2Y,
                    Curve.PARAMS.controlPoint2Z
                ),
                Curve.DEFAULT_ENDING_POINT,
            ];
        } else {
            this.controlPoints = controlPoints;
        }

        this.curve = null;
        if (curveType === Curve.CATNULL_ROM) {
            this.curve = new THREE.CatmullRomCurve3(this.controlPoints);
        } else if (curveType === Curve.BSPLINE) {
            const degree = 3;
            const knots = this.genKnots(degree, this.controlPoints.length);
            console.log(degree, this.controlPoints.length, knots.length);
            this.curve = new NURBSCurve(degree, knots, this.controlPoints);
        }

        this.startWidth = startWidth;
        this.endWidth = endWidth;
        this.startColor = new THREE.Color(
            startColorRGB.r / 255,
            startColorRGB.g / 255,
            startColorRGB.b / 255
        );
        this.endColor = new THREE.Color(
            endColorRGB.r / 255,
            endColorRGB.g / 255,
            endColorRGB.b / 255
        );
    }

    getCurve() {
        return this.curve;
    }

    generate() {
        const totalPoints = 40;
        const curvePoints = this.curve.getPoints(totalPoints);

        const segmentCount = 20;
        const pointsPerSegment = totalPoints / segmentCount;

        for (let segmentIdx = 0; segmentIdx < segmentCount; segmentIdx++) {
            const segmentStart = segmentIdx * pointsPerSegment;
            const segmentEnd =
                segmentIdx === segmentCount - 1
                    ? totalPoints + 1 // For the final segment, include the last point
                    : (segmentIdx + 1) * pointsPerSegment;

            const segmentPoints = curvePoints.slice(
                segmentIdx === 0 ? segmentStart : segmentStart - 1, // Include the last point of the previous segment
                segmentEnd
            );

            const positions = [];
            for (const point of segmentPoints) {
                positions.push(point.x, point.y, point.z);
            }

            // Calculate the average width for this segment
            const tStart = segmentStart / (totalPoints - 1);
            const tEnd = (segmentEnd - 1) / (totalPoints - 1);
            const widthStart = THREE.MathUtils.lerp(
                this.startWidth,
                this.endWidth,
                tStart
            );
            const widthEnd = THREE.MathUtils.lerp(
                this.startWidth,
                this.endWidth,
                tEnd
            );
            const averageWidth = (widthStart + widthEnd) / 2;

            // Interpolate color for this segment
            const tMid = (tStart + tEnd) / 2;
            const interpolatedColor = this.startColor
                .clone()
                .lerp(this.endColor, tMid);

            const lineGeometry = new LineGeometry();
            lineGeometry.setPositions(positions);

            const lineMaterial = new LineMaterial({
                color: interpolatedColor,
                linewidth: averageWidth,
                dashed: false,
            });

            const line = new Line2(lineGeometry, lineMaterial);
            line.isMyObject = true;
            this.scene.add(line);
        }

        if (this.debugMode) {
            // Draw the spher to represent the control points
            for (let i = 0; i < this.controlPoints.length; i++) {
                const sphere = this.genSphere(this.controlPoints[i]);
                this.scene.add(sphere);
            }
        }
    }

    genSphere(position) {
        const geometry = new THREE.SphereGeometry(
            Math.max(this.startWidth * 0.01, this.endWidth * 0.01),
            32,
            32
        );
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(position);
        sphere.isMyObject = true;
        return sphere;
    }

    genKnots(degree, numControlPoints) {
        const knotCount = numControlPoints + degree + 1;
        const knots = [];

        for (let i = 0; i <= degree; i++) {
            knots.push(0);
        }

        // Middle knots (evenly spaced non-clamped knots)
        const numMiddleKnots = knotCount - 2 * (degree + 1); // Number of middle knots
        for (let i = 1; i <= numMiddleKnots; i++) {
            knots.push(i);
        }

        // End clamped (degree + 1 max values)
        for (let i = 0; i <= degree; i++) {
            knots.push(numMiddleKnots + 1);
        }

        return knots;
    }

    static getParams() {
        return Curve.PARAMS;
    }
}
