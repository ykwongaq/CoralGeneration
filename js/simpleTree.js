class SimpleTree {
    static DEFAULT_POSITION = new THREE.Vector3(0, 0, 0);
    static DEFAULT_DIRECTION = new THREE.Vector3(0, 1, 0);
    static DEFAULT_THICKNESS = 0.1;
    static DEFUALT_ITERATIONS = 3;
    static DEFAULT_LENGTH = 1;
    static DEFAULT_COLOR = 0x8b4513;
    static DEFAULT_LENGHT_SCALER = 0.8;
    static DEFAULT_THICKNESS_SCALER = 0.8;

    constructor(
        scene,
        iterations = SimpleTree.DEFUALT_ITERATIONS,
        position = SimpleTree.DEFAULT_POSITION,
        direction = SimpleTree.DEFAULT_DIRECTION,
        thickness = SimpleTree.DEFAULT_THICKNESS,
        length = SimpleTree.DEFAULT_LENGTH,
        color = SimpleTree.DEFAULT_COLOR,
        lengthScaler = SimpleTree.DEFAULT_LENGHT_SCALER,
        thicknessScaler = SimpleTree.DEFAULT_THICKNESS_SCALER
    ) {
        this.scene = scene;
        this.iterations = iterations;
        this.position = position;
        this.direction = direction;
        this.thickness = thickness;
        this.length = length;
        this.color = color;
        this.lengthScaler = lengthScaler;
        this.thicknessScaler = thicknessScaler;
    }

    genCylinder(topRadius, bottomRadius, height, color) {
        const geometry = new THREE.CylinderGeometry(
            topRadius,
            bottomRadius,
            height
        );
        const material = new THREE.MeshBasicMaterial({ color });
        return new THREE.Mesh(geometry, material);
    }

    createBranch(position, direction, thickness, length, color, iterations) {
        if (iterations <= 0) {
            return;
        }

        const cylinder = this.genCylinder(thickness, thickness, length, color);
        const axis = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
            axis,
            direction.clone().normalize()
        );
        cylinder.applyQuaternion(quaternion);
        cylinder.position.copy(
            position.clone().add(direction.clone().multiplyScalar(length / 2))
        );

        this.scene.add(cylinder);

        const newLength = length * this.lengthScaler;
        const newThickness = thickness * this.thicknessScaler;
        const newIterations = iterations - 1;

        const angle = Math.PI / 6;
        const leftDir = direction
            .clone()
            .applyAxisAngle(new THREE.Vector3(0, 0, 1), angle);
        const rightDir = direction
            .clone()
            .applyAxisAngle(new THREE.Vector3(0, 0, 1), -angle);

        const endPosition = position
            .clone()
            .add(direction.clone().multiplyScalar(length));

        this.createBranch(
            endPosition,
            leftDir,
            newThickness,
            newLength,
            color,
            newIterations
        );
        this.createBranch(
            endPosition,
            rightDir,
            newThickness,
            newLength,
            color,
            newIterations
        );
    }

    createTree() {
        this.createBranch(
            this.position,
            this.direction,
            this.thickness,
            this.length,
            this.color,
            this.iterations
        );
    }
}
