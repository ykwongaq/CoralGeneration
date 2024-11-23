export default class RandomNumberGenerator {
    static seed = 584446;
    static m = 0x80000000;
    static a = 1103515245;
    static c = 12345;

    static setSeed(seed) {
        RandomNumberGenerator.seed = seed;
    }

    static getSeed() {
        return RandomNumberGenerator.seed;
    }

    static random() {
        return Math.random();
    }

    static seedRandom() {
        let newSeed =
            (RandomNumberGenerator.a * RandomNumberGenerator.seed +
                RandomNumberGenerator.c) %
            RandomNumberGenerator.m;
        RandomNumberGenerator.seed = newSeed;
        return newSeed / RandomNumberGenerator.m;
    }
}
