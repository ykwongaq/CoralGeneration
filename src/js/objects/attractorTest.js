import * as THREE from "three";
import MyObject from "./myObject";
import RandomNumberGenerator from "../randomNumberGenerator";
import Attractor from "../SCA/attractor";

import fs from "fs";
import { Scene, Mesh, MeshStandardMaterial, Color } from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"; // Modern FontLoader
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"; // Modern TextGeometry
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js"; // Modern GLTFExporter
export default class AttractorTest extends MyObject {
    static PARAMS = {
        radius: 10,
        numPoints: 1000,

        influenceDistance: 5,
        killDistance: 1,
    };

    static NAME = "AttractorTest";

    static getParams() {
        return AttractorTest.PARAMS;
    }

    constructor(
        scene,
        debugMode,
        radius = AttractorTest.PARAMS.radius,
        numPoints = AttractorTest.PARAMS.numPoints,
        influenceDistance = AttractorTest.PARAMS.influenceDistance,
        killDistance = AttractorTest.PARAMS.killDistance
    ) {
        super(scene, debugMode);
        RandomNumberGenerator.setSeed(RandomNumberGenerator.DEFAULT_SEED);
        this.radius = radius;
        this.numPoints = numPoints;
        this.influenceDistance = influenceDistance;
        this.killDistance = killDistance;

        const geometry = new THREE.SphereGeometry(
            this.radius,
            32,
            32,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2
        );
        const material = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            transparent: true,
            opacity: 0.5,
        });

        // this.mesh = new THREE.Mesh(geometry, material);
    }

    async generate() {
        const fontLoader = new FontLoader();
        const font = await new Promise((resolve, reject) => {
            fontLoader.load(
                "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
                resolve,
                undefined,
                reject
            );
        });

        // Create 3D Text Geometry
        const textGeometry = new TextGeometry("H", {
            font: font,
            size: 2, // Letter size
            depth: 0.5, // Extrusion depth
            curveSegments: 12, // Smoothness of curves
            bevelEnabled: true, // Add bevel (rounded edges)
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 5,
        });

        // Create material and mesh
        const textMaterial = new THREE.MeshStandardMaterial({
            color: 0x0077ff,
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 0, 0);
        textMesh.isMyObject = true;
        this.scene.add(textMesh);
    }
}
