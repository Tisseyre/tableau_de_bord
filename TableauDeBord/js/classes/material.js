class Material {
    _rf = "";
    _libelle = "";
    _state = State.FUNCTIONAL;

    constructor(rf, libelle) {
        this._rf = rf;
        this._libelle = libelle;
    }

    getRf() {
        return this._rf;
    }
    getLibelle() {
        return this._libelle;
    }
    getState() {
        return this._state;
    }
    setState(state) {
        this._state = state;
    }

    /**
     * return a color depending on the material state
     */
    getItemColor() {
        switch (this._state) {
            case State.BROKEN:
                return RED;
            case State.CRITICALLY_BROKEN:
                return RED;
            case State.HIGH_RISK:
                return ORANGE;
            case State.LOW_RISK: 
                return YELLOW;
            default:
                return '';
        }
    }

    getSvgElement() {
        const svgElement = document.getElementById('svg-schema');
        let svgMaterialId = "_"+this._rf;

        if (!svgElement) {
            console.error('Cannot access svg element.');
            return;
        }

        return svgElement.querySelector(`#${svgMaterialId}`);
    }

    updateSvgItem() {
        let svgMaterial = this.getSvgElement();
        if (svgMaterial) {
            let svgMaterialColor = svgMaterial.querySelector('.couleur');
            if(svgMaterialColor) {
                svgMaterialColor.setAttribute('display', 'auto');
                for (let i = 0; i < svgMaterialColor.children.length; i++) {
                    const element = svgMaterialColor.children[i];
                    if(element.style.stroke && element.style.stroke != "none") {
                        element.style.stroke = this.getItemColor();
                    }
                    if(element.style.fill && element.style.fill != "none") {
                        element.style.fill = this.getItemColor();
                    }
                }
            }
        }
    }
}