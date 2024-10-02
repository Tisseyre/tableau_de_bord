class State {
    name = "";

    constructor(name) {
        this.name = name;
    }

    // const definitions
    static FUNCTIONAL = new State('Functional'); // no DT
    static NO_RISK = new State('No Risk'); // 5
    static LOW_RISK = new State('Low Risk'); // 4
    static HIGH_RISK = new State('High Risk'); // 3
    static BROKEN = new State('Broken'); // 2
    static CRITICALLY_BROKEN = new State('Critically Broken'); // 1
    

    // wheter or not is it broken
    isBroken() {
        return this === State.CRITICALLY_BROKEN || this === State.BROKEN;
    }

    // wheter or not is it at risk
    isAtHighRisk() {
        return this === State.HIGH_RISK;
    }

    isAtLowRisk() {
        return this === State.LOW_RISK;
    }
}