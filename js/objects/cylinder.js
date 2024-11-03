class Cylinder extends MyObject {
    static PARAMS = {
        radiusTop: 1,
        radiusBottom: 1,
        height: 1,
        radialSegments: 8,
        heightSegments: 1,
        openEnded: false,
        thetaStart: 0,
        thetaLength: Math.PI * 2,
        color: {
            r: 52,
            g: 141,
            b: 182,
        },
    };

    static NAME = "Cylinder";

    constructor(scene) {
        super(scene);
        const params = Cylinder.getParams();
        this.geometry = new THREE.CylinderGeometry(
            params.radiusTop,
            params.radiusBottom,
            params.height,
            params.radialSegments,
            params.heightSegments,
            params.openEnded,
            params.thetaStart,
            params.thetaLength
        );
        const color = Utils.RGB2Color(
            params.color.r,
            params.color.g,
            params.color.b
        );
        this.material = new THREE.MeshBasicMaterial({ color: color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.isMyObject = true;

        this.wireframe = new THREE.WireframeGeometry(this.geometry);
        this.line = new THREE.LineSegments(this.wireframe);
        this.line.material.depthTest = false;
        this.line.material.opacity = 0.5;
        this.line.material.transparent = true;
        this.line.isMyObject = true;
    }

    generate() {
        super.generate();
        this.scene.add(this.line);
    }

    static getParams() {
        return Cylinder.PARAMS;
    }
}
