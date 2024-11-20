class StochasticLSystem {
    constructor(axiom, rules) {
        /*
            Example:
            const axiom = "F";
            const rules = {
                "F": [
                    { replacement: "F[+F][-F]", probability: 0.3 },
                    { replacement: "F[+F]F", probability: 0.3 },
                    { replacement: "F[-F]F", probability: 0.4 }
                ]
            };
        */
        this.axiom = axiom;
        this.rules = rules;

        this.verifyProbabilities();
    }

    verifyProbabilities() {
        for (let char in this.rules) {
            const rules = this.rules[char];
            let sum = 0;
            for (let rule of rules) {
                sum += rule.probability;
            }
            if (Math.abs(sum - 1) > 1e-6) {
                throw new Error(
                    `Invalid probabilities for character ${char} with sum ${sum}`
                );
            }
        }
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
            nextSentence += this.applyStochasticRule(char);
        }
        return nextSentence;
    }

    applyStochasticRule(char) {
        if (!this.rules[char]) {
            return char;
        }

        const ruleSet = this.rules[char];
        let rand = RandomNumberGenerator.seedRandom();
        let cumulativeProbability = 0;

        for (let rule of ruleSet) {
            cumulativeProbability += rule.probability;
            if (rand <= cumulativeProbability) {
                return rule.replacement;
            }
        }

        // Fallback in case of rounding errors
        return char;
    }
}
