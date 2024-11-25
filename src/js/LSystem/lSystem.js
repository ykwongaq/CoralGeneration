export default class LSystem {
    constructor(axiom, rules) {
        this.axiom = axiom;
        this.rules = rules;
    }

    generate(iterations) {
        let sentence = this.axiom;
        for (let i = 0; i < iterations; i++) {
            sentence = this.applyRules(sentence);
        }
        return sentence;
    }

    applyRules(sentence) {
        let nextSentence = "";
        for (let char of sentence) {
            nextSentence += this.rules[char] || char;
        }
        return nextSentence;
    }
}
