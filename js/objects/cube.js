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
        // debugMode: false,
    };

    static NAME = "Cube";

    constructor(
        scene,
        debugMode,
        width = Cube.PARAMS.width,
        height = Cube.PARAMS.height,
        depth = Cube.PARAMS.depth,
        widthSegments = Cube.PARAMS.widthSegments,
        heightSegments = Cube.PARAMS.heightSegments,
        depthSegments = Cube.PARAMS.depthSegments,
        colorRGB = Cube.PARAMS.color
    ) {
        super(scene, debugMode);
        this.geometry = new THREE.BoxGeometry(
            width,
            height,
            depth,
            widthSegments,
            heightSegments,
            depthSegments
        );
        const color = Utils.RGB2Color(colorRGB.r, colorRGB.g, colorRGB.b);
        this.material = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: debugMode,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    static getParams() {
        return Cube.PARAMS;
    }

    static getName() {
        return Cube.NAME;
    }
}
