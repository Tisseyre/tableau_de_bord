class Popup {
    rf = "";
    priority = "";
    popupId = "popup_";

    constructor(request) {
        this.rf = request.getRf();
        this.priority = request.getPriority();
        this.svgElement = request.getMaterial().getSvgElement();
        this.popupId += request.getRf();
    }

    /**
     * close all other popups than the last triggered
     */
    closeOthers() {
        let popup;
        POPUPS.forEach(p => {
            popup = document.getElementById(p.popupId);
            if (p.rf !== this.rf && popup.getAttribute('hidden') == null) {
                popup.setAttribute('hidden', '');
            }
        });
    }

    /**
     * display the popup
     */
    display() {
        const popupSchema = document.getElementById('popup-schema');
        let left = 0;
        let top = 0;

        if (this.svgElement) {
            // if we found the svg element, then get his coordinates and setup a margin
            let coordinates = this.svgElement.getBoundingClientRect();
            left = coordinates.left + 30;
            top = coordinates.top - 120;
        }

        this.svgElement.setAttribute('uk-toggle','target:#'+this.popupId+' ;animation: uk-animation-fade');
        this.svgElement.classList.add("uk-button");

        let popupHTML = '<div id="'+this.popupId+'" class="uk-card uk-card-default card-popup uk-card-body uk-position-absolute uk-position-large" style="left: '+left+'px; top:'+top+'px" hidden>';
        
        if(this.priority <= 2) {
            popupHTML += '<span class="uk-position-absolute uk-position-top-left badge urgent-badge">'+this.priority+'</span>';
        } else if (this.priority == 3) {
            popupHTML += '<span class="uk-position-absolute uk-position-top-left badge mid-badge">'+this.priority+'</span>';
        } else if (this.priority == 4) {
            popupHTML += '<span class="uk-position-absolute uk-position-top-left badge low-badge">'+this.priority+'</span>';
        }

        popupHTML += '<button id="close_'+this.rf+'" type="button" uk-close onclick="closePopup(this)" class="uk-position-absolute uk-position-small uk-position-top-right"></button>';
        popupHTML += '<h5 class="uk-text-bold popup-title">'+this.rf+'</h5>';
        /*popupHTML += '<p>Priorité : '+this.priority+'</p>';*/

        popupHTML += '<a href="#" target="_blank" class="uk-button uk-button-primary uk-border-rounded">Voir la requête <span uk-icon="icon: link-external; ratio: 1" class="uk-margin-left"></span></a>';
        popupHTML += '</div>';

        popupSchema.innerHTML += popupHTML;

        this.svgElement.addEventListener('click', () => {
            this.closeOthers();
        });
    }
}
/**
 * close the popup
 * 
 * @param e html element (uk-close)
 */
function closePopup(e) {
    e.parentNode.setAttribute('hidden', '');
}