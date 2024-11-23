import * as THREE from "three";
import { NURBSCurve } from "three/examples/jsm/curves/NURBSCurve.js";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";

import MyObject from "./myObject";

export default class CurveTest extends MyObject {
    static CATNULL_ROM = "CatmullRom";
    static BSPLINE = "BSpline";

    static PARAMS = {
        // Control Point 1
        controlPoint1X: -2,
        controlPoint1Y: -2,
        controlPoint1Z: 2,

        // Control Point 2
        controlPoint2X: 2,
        controlPoint2Y: 2,
        controlPoint2Z: -2,

        // Curve Type
        curveType: CurveTest.CATNULL_ROM,

        // Width
        startWidth: 10,
        endWidth: 1,
    };

    static NAME = "CurveTest";

    static DEFAULT_STARTING_POINT = new THREE.Vector3(-5, 0, 0);
    static DEFAULT_ENDING_POINT = new THREE.Vector3(5, 0, 0);

    constructor(
        scene,
        debugMode = false,
        controlPoint1X = CurveTest.PARAMS.controlPoint1X,
        controlPoint1Y = CurveTest.PARAMS.controlPoint1Y,
        controlPoint1Z = CurveTest.PARAMS.controlPoint1Z,
        controlPoint2X = CurveTest.PARAMS.controlPoint2X,
        controlPoint2Y = CurveTest.PARAMS.controlPoint2Y,
        controlPoint2Z = CurveTest.PARAMS.controlPoint2Z,
        curveType = CurveTest.PARAMS.curveType,
        startWidth = CurveTest.PARAMS.startWidth,
        endWidth = CurveTest.PARAMS.endWidth
    ) {
        super(scene, debugMode);

        this.controlPoints = [
            CurveTest.DEFAULT_STARTING_POINT,
            new THREE.Vector3(controlPoint1X, controlPoint1Y, controlPoint1Z),
            new THREE.Vector3(controlPoint2X, controlPoint2Y, controlPoint2Z),
            CurveTest.DEFAULT_ENDING_POINT,
        ];

        this.curve = null;
        if (curveType === CurveTest.CATNULL_ROM) {
            this.curve = new THREE.CatmullRomCurve3(this.controlPoints);
        } else if (curveType === CurveTest.BSPLINE) {
            const degree = 3;
            const knots = this.genKnots(degree, this.controlPoints.length);
            this.curve = new NURBSCurve(degree, knots, this.controlPoints);
        }

        this.startWidth = startWidth;
        this.endWidth = endWidth;
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

            const lineGeometry = new LineGeometry();
            lineGeometry.setPositions(positions);

            const lineMaterial = new LineMaterial({
                color: 0xff0000,
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
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
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
        return CurveTest.PARAMS;
    }
}
