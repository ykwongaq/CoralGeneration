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
    // getAABB() {
    //     const halfHeight = this.geometry.parameters.height / 2;
    //     const radius = Math.max(
    //         this.geometry.parameters.radiusTop,
    //         this.geometry.parameters.radiusBottom
    //     );

    //     return {
    //         min: {
    //             x: this.mesh.position.x - radius,
    //             y: this.mesh.position.y - halfHeight,
    //             z: this.mesh.position.z - radius,
    //         },
    //         max: {
    //             x: this.mesh.position.x + radius,
    //             y: this.mesh.position.y + halfHeight,
    //             z: this.mesh.position.z + radius,
    //         },
    //     };
    // }

    isCollidingWith(object) {
        if (!(object instanceof Cylinder)) {
            throw new Error("Cylinder can only collide with another Cylinder");
        }

        this.mesh.updateMatrixWorld(true);
        object.mesh.updateMatrixWorld(true);

        const obb1 = this.computeOBB();
        const obb2 = object.computeOBB();

        const obbHelper1 = new THREE.Box3Helper(obb1, 0xffff00);
        obbHelper1.isMyObject = true;
        const obbHelper2 = new THREE.Box3Helper(obb2, 0xffff00);
        obbHelper2.isMyObject = true;

        this.scene.add(obbHelper1);
        this.scene.add(obbHelper2);

        return obb1.intersectsBox(obb2);

        // const aabb1 = this.getAABB();
        // const aabb2 = object.getAABB();

        // return (
        //     aabb1.min.x <= aabb2.max.x &&
        //     aabb1.max.x >= aabb2.min.x &&
        //     aabb1.min.y <= aabb2.max.y &&
        //     aabb1.max.y >= aabb2.min.y &&
        //     aabb1.min.z <= aabb2.max.z &&
        //     aabb1.max.z >= aabb2.min.z
        // );
    }
}
