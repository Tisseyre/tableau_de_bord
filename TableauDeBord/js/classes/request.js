class Request {
    _num = "";
    _rf = "";
    _libelle = "";
    _priority = "";
    _basePriority = "";
    _priorityComments = "";
    _pc = "";
    _mc = "";
    _sc = "";
    _cc = "";
    _material = null;
    
    constructor(num, rf, libelle, priority, pc = "", mc = "", sc = "", cc = "") {
        this._num = num;
        this._rf = rf;
        this._libelle = libelle;
        this._priority = priority;
        this._basePriority = priority;
        this._pc = pc;
        this._mc = mc;
        this._sc = sc;
        this._cc = cc;
    }

    // return num for DT page
    getNum() {
        return this._num;
    }
    // return Reference
    getRf() {
        return this._rf;
    }
    // return DT Libelle
    getLibelle() {
        return this._libelle;
    }
    // return priority
    getPriority() {
        return this._priority;
    }
    setPriority(priority) {
        this._priority = priority;
    }
    // return base priority
    getBasePriority() {
        return this._basePriority;
    }
    // return priority comments
    getPriorityComments() {
        return this._priorityComments;
    }
    setPriorityComments(priorityComments) {
        this._priorityComments = priorityComments;
    }
    // return DT project comments
    getPc() {
        return this._pc;
    }
    setPc(dtPc) {
        this._pc = dtPc;
    }
    // return DT "commentaire métier"
    getMc() {
        return this._mc;
    }
    setMc(dtMc) {
        this._mc = dtMc;
    }
    // return DT "commentaire sureté"
    getSc() {
        return this._sc;
    }
    setSc(dtSc) {
        this._sc = dtSc;
    }
    // return DT "commentaire conduite"
    getCc() {
        return this._cc;
    }
    setCc(dtCc) {
        this._cc = dtCc;
    }
    // return material
    getMaterial() {
        return this._material;
    }
    // set material
    setMaterial() {
        let material = MATERIALS.find(material => material.getRf() === this._rf);
        this._material = material;
    }

    /**
     * set state to material and material linked
     * 
     * use the priority to set a state
     * 1 => critically broken (red)
     * 2 => broken (red)
     * 3 => high risk (orange)
     * 4 => low risk (yellow)
     * 5 => no risk (no color)
     * default => functional
     * 
     * if there is cumulative materials, set them to priority 1
     * 
     */
    broke() {
        if(this._material) {
            switch (this._priority) {
                case "1":
                    this._material.setState(State.CRITICALLY_BROKEN);
                    break;
                case "2":
                    this._material.setState(State.BROKEN);
                    break;
                case "3":
                    this._material.setState(State.HIGH_RISK);
                    break;
                case "4":
                    this._material.setState(State.LOW_RISK);
                    break;
                case "5":
                    this._material.setState(State.NO_RISK);
                    break;
                default:
                    this._material.setState(State.FUNCTIONAL);
                    break;
            }
            
            LINKED_MATERIALS.forEach(materials => {
                if (materials.includes(this._material.getRf())) {
                    let criticalBreak = true;

                    materials.forEach(m => {
                        let material = MATERIALS.find(material => material.getRf() === m);
                        if (!material.getState().isBroken() && !material.getState().isAtHighRisk() && !material.getState().isAtLowRisk()) {
                            criticalBreak = false;
                        }
                    });

                    if (criticalBreak) {
                        materials.forEach(m => {
                            let material = MATERIALS.find(material => material.getRf() === m);
                            let dt = REQUESTS.find(dt => dt.getRf() === m);
                            dt.setPriorityComments("Cumulable");
                            dt.setPriority(1);
                            material.setState(State.CRITICALLY_BROKEN);
                        });
                    }
                }
            });
        }
    }
}