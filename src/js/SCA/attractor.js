import SCAObject from "./SCAObject";
import * as THREE from "three";

export default class Attractor extends SCAObject {
    static PARAMS = {
        influenceDistance: 5,
        killDistance: 1,
    };

    static NAME = "Attractor";

    constructor(
        scene,
        debugMode,
        position,
        influenceDistance = Attractor.PARAMS.influenceDistance,
        killDistance = Attractor.PARAMS.killDistance
    ) {
        super(scene, debugMode, position);
        this.influenceDistance = influenceDistance;
        this.killDistance = killDistance;

        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
        });

        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.position.copy(this.position);
        this.sphere.isMyObject = true;
        this.sphere.isAttractor = true;
    }

    getInfluenceDistance() {
        return this.influenceDistance;
    }

    getKillDistance() {
        return this.killDistance;
    }

    generate() {
        if (this.debugMode) {
            this.scene.add(this.sphere);
        }
    }

    showInference() {
        // Draw sphere of influence
        const influenceGeometry = new THREE.SphereGeometry(
            this.influenceDistance,
            32,
            32
        );
        const influenceMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            transparent: true,
            opacity: 0.2,
        });

        const influenceMesh = new THREE.Mesh(
            influenceGeometry,
            influenceMaterial
        );
        influenceMesh.position.copy(this.position);
        influenceMesh.isMyObject = true;

        this.scene.add(influenceMesh);
    }

    showKill() {
        // Draw kill sphere
        const killGeometry = new THREE.SphereGeometry(
            this.killDistance,
            32,
            32
        );
        const killMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.2,
        });
        const killMesh = new THREE.Mesh(killGeometry, killMaterial);
        killMesh.position.copy(this.position);
        killMesh.isMyObject = true;
        this.scene.add(killMesh);
    }
}
