class Cube extends MyObject {
    static PARAMS = {
        width: 1,
        height: 1,
        depth: 1,
        widthSegments: 1,
        heightSegments: 1,
        depthSegments: 1,
        color: {
            r: 52,
            g: 141,
            b: 182,
        },
    };

    static NAME = "Cube";

    constructor(scene) {
        super(scene);
        const params = Cube.getParams();
        this.geometry = new THREE.BoxGeometry(
            params.width,
            params.height,
            params.depth,
            params.widthSegments,
            params.heightSegments,
            params.depthSegments
        );
        const color = Utils.RGB2Color(
            params.color.r,
            params.color.g,
            params.color.b
        );
        this.material = new THREE.MeshBasicMaterial({ color: color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.isMyObject = true; // Important for

        this.wireframe = new THREE.WireframeGeometry(this.geometry);
        this.line = new THREE.LineSegments(this.wireframe);
        this.line.material.depthTest = false;
        this.line.material.opacity = 0.5;
        this.line.material.transparent = true;
        this.line.isMyObject = true;
    }

    // clear() {
    //     try {
    //         this.scene.traverse((object) => {
    //             if (object.isCube) {
    //                 this.scene.remove(object);
    //             }
    //         });
    //     } catch (error) {
    //         console.log("error occured while clearing the scene");
    //     }
    // }

    generate() {
        super.generate();
        this.scene.add(this.line);
    }

    static getParams() {
        return Cube.PARAMS;
    }

    static getName() {
        return Cube.NAME;
    }
}
