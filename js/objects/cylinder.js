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

    computeOBB() {
        const transformedVertices = [];
        const positionAttribute = this.geometry.attributes.position;

        for (let i = 0; i < positionAttribute.count; i++) {
            const vertex = new THREE.Vector3(
                positionAttribute.getX(i),
                positionAttribute.getY(i),
                positionAttribute.getZ(i)
            );
            vertex.applyMatrix4(this.mesh.matrixWorld);
            transformedVertices.push(vertex);
        }
        // console.log(transformedVertices);

        return new THREE.Box3().setFromPoints(transformedVertices);
    }
}
