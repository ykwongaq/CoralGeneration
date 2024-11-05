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

    constructor(
        scene,
        debugMode = false,
        radiusTop = Cylinder.PARAMS.radiusTop,
        radiusBottom = Cylinder.PARAMS.radiusBottom,
        height = Cylinder.PARAMS.height,
        radialSegments = Cylinder.PARAMS.radialSegments,
        heightSegments = Cylinder.PARAMS.heightSegments,
        openEnded = Cylinder.PARAMS.openEnded,
        thetaStart = Cylinder.PARAMS.thetaStart,
        thetaLength = Cylinder.PARAMS.thetaLength,
        colorRGB = Cylinder.PARAMS.color
    ) {
        super(scene, debugMode);
        this.geometry = new THREE.CylinderGeometry(
            radiusTop,
            radiusBottom,
            height,
            radialSegments,
            heightSegments,
            openEnded,
            thetaStart,
            thetaLength
        );
        const color = Utils.RGB2Color(colorRGB.r, colorRGB.g, colorRGB.b);
        this.material = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: debugMode,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    static getParams() {
        return Cylinder.PARAMS;
    }
}
