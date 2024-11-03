class MyObject {
    constructor(scene, mesh = null) {
        this.scene = scene;
        this.mesh = mesh;
    }

    generate() {
        this.scene.add(this.mesh);
    }

    clear() {
        try {
            this.scene.traverse((object) => {
                if (object.isMyObject) {
                    this.scene.remove(object);
                }
            });
        } catch (error) {
            // Just try again
            this.scene.traverse((object) => {
                if (object.isMyObject) {
                    this.scene.remove(object);
                }
            });
        }
    }

    setMesh(mesh) {
        this.mesh = mesh;
    }

    getMesh() {
        return this.mesh;
    }

    setPosition(position) {
        this.mesh.position.copy(position);
    }

    lookAt(direction) {
        const lookAtDirection = new THREE.Vector3().addVectors(
            this.mesh.position,
            direction
        );
        this.mesh.lookAt(lookAtDirection);
    }

    getPosition() {
        return this.mesh.position;
    }

    getLookingDirection() {
        return this.mesh.getWorldDirection();
    }
}
