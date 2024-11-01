class Cube {
    constructor(position = { x: 0, y: 0, z: 0 }, size = 1, color = 0x00ff00) {
        this.geometry = new THREE.BoxGeometry(size, size, size);
        this.material = new THREE.MeshBasicMaterial({ color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(position.x, position.y, position.z);
    }

    getGeometry() {
        return this.geometry;
    }

    getMaterial() {
        return this.material;
    }

    getMesh() {
        return this.mesh;
    }

    rotate(angle) {
        this.mesh.rotation.y += angle;
        this.mesh.rotation.x += angle;
    }
}
