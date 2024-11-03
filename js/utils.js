class Utils {
    static UP = new THREE.Vector3(0, 1, 0);
    static Y = Utils.UP;
    static Z = new THREE.Vector3(0, 0, 1);
    static X = new THREE.Vector3(1, 0, 0);

    static RGB2Color(r, g, b) {
        return new THREE.Color().setRGB(r / 255, g / 255, b / 255);
    }
}
