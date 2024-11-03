class BranchesCondition {
    constructor(position, direction, thickness, length, color) {
        this.position = position;
        this.direction = direction;
        this.thickness = thickness;
        this.length = length;
        this.color = color;
    }

    setPosition(position) {
        this.position = position;
    }

    setDirection(direction) {
        this.direction = direction;
    }

    setThickness(thickness) {
        this.thickness = thickness;
    }

    setLength(length) {
        this.length = length;
    }

    setColor(color) {
        this.color = color;
    }

    getPosition() {
        return this.position;
    }

    getDirection() {
        return this.direction;
    }

    getThickness() {
        return this.thickness;
    }

    getLength() {
        return this.length;
    }

    getColor() {
        return this.color;
    }

    clone() {
        return new BranchesCondition(
            this.position.clone(),
            this.direction.clone(),
            this.thickness,
            this.length,
            this.color
        );
    }
}

class LSystemTree {
    static DEFAULT_POSITION = new THREE.Vector3(0, 0, 0);
    static DEFAULT_DIRECTION = new THREE.Vector3(0, 1, 0);
    static DEFAULT_THICKNESS = 0.1;
    static DEFUALT_ITERATIONS = 3;
    static DEFAULT_LENGTH = 1;
    static DEFAULT_COLOR = 0x8b4513;
    static DEFAULT_LENGHT_SCALER = 0.8;
    static DEFAULT_THICKNESS_SCALER = 0.8;
    static DEFAUTL_BRANCH_ANGLE = Math.PI / 6;

    constructor(
        scene,
        axiom,
        position = LSystemTree.DEFAULT_POSITION,
        direction = LSystemTree.DEFAULT_DIRECTION,
        thickness = LSystemTree.DEFAULT_THICKNESS,
        length = LSystemTree.DEFAULT_LENGTH,
        color = LSystemTree.DEFAULT_COLOR,
        lengthScaler = LSystemTree.DEFAULT_LENGHT_SCALER,
        thicknessScaler = LSystemTree.DEFAULT_THICKNESS_SCALER,
        branchAngle = LSystemTree.DEFAUTL_BRANCH_ANGLE
    ) {
        this.scene = scene;
        this.axiom = axiom;
        this.position = position;
        this.direction = direction;
        this.thickness = thickness;
        this.length = length;
        this.color = color;
        this.lengthScaler = lengthScaler;
        this.thicknessScaler = thicknessScaler;
        this.branchAngle = branchAngle;
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

    createBranch(position, direction, thickness, length, color) {
        const cylinder = this.genCylinder(thickness, thickness, length, color);

        // Rotate the cylinder to align with the direction vector
        if (!direction.equals(Utils.UP)) {
            const axis = new THREE.Vector3()
                .crossVectors(Utils.UP, direction)
                .normalize();
            const angle = Math.acos(
                Utils.UP.dot(direction) / Utils.UP.length() / direction.length()
            );
            const matrix = new THREE.Matrix4().makeRotationAxis(axis, angle);
            cylinder.applyMatrix4(matrix);
        }

        // Position the cylinder
        cylinder.position.copy(
            position.clone().add(direction.clone().multiplyScalar(length / 2))
        );

        this.scene.add(cylinder);

        return position.clone().add(direction.clone().multiplyScalar(length));
    }

    generate() {
        const stack = [];
        let currentBranchCondition = new BranchesCondition(
            this.position,
            this.direction,
            this.thickness,
            this.length,
            this.color
        );

        let currentDirection;
        let newDirection;

        for (const char of this.axiom) {
            switch (char) {
                case "F":
                    currentBranchCondition.position = this.createBranch(
                        currentBranchCondition.getPosition(),
                        currentBranchCondition.getDirection(),
                        currentBranchCondition.getThickness(),
                        currentBranchCondition.getLength(),
                        currentBranchCondition.getColor()
                    );
                    break;
                case "+":
                    currentDirection = currentBranchCondition.getDirection();
                    newDirection = currentDirection.applyAxisAngle(
                        Utils.Z,
                        this.branchAngle
                    );
                    currentBranchCondition.setDirection(newDirection);
                    break;
                case "-":
                    currentDirection = currentBranchCondition.getDirection();
                    newDirection = currentDirection.applyAxisAngle(
                        Utils.Z,
                        -this.branchAngle
                    );
                    currentBranchCondition.setDirection(newDirection);
                    break;
                case "[":
                    stack.push(currentBranchCondition.clone());
                    break;
                case "]":
                    currentBranchCondition = stack.pop();
                    break;
                default:
                    console.error(`Invalid character: ${char}`);
                    break;
            }
        }
    }
}
