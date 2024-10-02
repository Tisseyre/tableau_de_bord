class PopupIndex {
    constructor(arr, elementId) {
        this.arr = arr;
        this.elementId = elementId;
        this.popupId = "popup_"+elementId;
    }

    /**
     * display the popup
     */
    display() {
        const popupIndex = document.getElementById('popup-table');
        
        const element = document.getElementById(`${this.elementId}`)
        let coordinates = element.getBoundingClientRect();
        let left = coordinates.left - 75;
        let top = coordinates.top;

        element.setAttribute('uk-toggle','target:#'+this.popupId+' ;animation: uk-animation-fade');
        //element.classList.add("uk-button");

        let popupHTML = '<div id="'+this.popupId+'" class="uk-card uk-card-default uk-border-rounded card-popup uk-card-body uk-position-absolute uk-position-large" style="left: '+left+'px; top:'+(top+20)+'px" hidden>';
        popupHTML += '<button id="close_'+this.rf+'" type="button" uk-close onclick="closePopup(this)" class="uk-position-absolute uk-position-small uk-position-top-right"></button>';
        popupHTML += '<table class="uk-table uk-table-divider">';
        popupHTML += '<thead>';
        popupHTML += '<tr class="uk-background-primary">';
        popupHTML += '<th><strong>Référence</strong></th>';
        popupHTML += '<th><strong>Priorité</strong></th>';
        popupHTML += '<th><strong>Informations</strong></th>';
        popupHTML += '<th><strong>Lien</strong></th>';
        popupHTML += '</tr>';
        popupHTML += '</thead>';
        popupHTML += '<tbody uk-height-match="target: td">';
        this.arr.forEach(request => {
            popupHTML += '<tr>';

            popupHTML += '<td>';
            popupHTML += request.rf;
            popupHTML += '</td>';

            popupHTML += '<td>';
            if (request.priority == request.basePriority) {
                if(request.priority <= 2) {
                    popupHTML += '<span class="badge urgent-badge">';
                } else if (request.priority == 3) {
                    popupHTML += '<span class="badge mid-badge">';
                } else if (request.priority == 4) {
                    popupHTML += '<span class="badge low-badge">';
                }
                popupHTML += request.priority+'</span>';
            } else {
                if(request.basePriority <= 2) {
                    popupHTML += '<span class="badge urgent-badge">';
                } else if (request.basePriority == 3) {
                    popupHTML += '<span class="badge mid-badge">';
                } else if (request.basePriority == 4) {
                    popupHTML += '<span class="badge low-badge">';
                }
                popupHTML += request.basePriority+'</span>';

                popupHTML += '<span uk-icon="icon: arrow-right"></span>';

                if(request.priority <= 2) {
                    popupHTML += '<span class="badge urgent-badge">';
                } else if (request.priority == 3) {
                    popupHTML += '<span class="badge mid-badge">';
                } else if (request.priority == 4) {
                    popupHTML += '<span class="badge low-badge">';
                }
                popupHTML += request.priority+'</span>';
            }
            popupHTML += '</td>';

            popupHTML += '<td>';
            popupHTML += request.comments;
            popupHTML += '</td>';

            popupHTML += '<td>';
            popupHTML += '<a class="uk-button uk-button-primary uk-border-rounded" href="#" target="_blank">Voir la requête <span uk-icon="link-external"></span></a>';
            popupHTML += '</td>';

            popupHTML += '</tr>';
            
        });
        popupHTML += '</tbody>';
        popupHTML += '</table>';

        popupHTML += '</div>';

        popupIndex.innerHTML += popupHTML;

        element.addEventListener('click', () => {
            this.closeOthers();
        });
    }

    /**
     * close all other popups than the last triggered
     */
    closeOthers() {
        let popup;
        POPUPS.forEach(p => {
            popup = document.getElementById(p.popupId);
            if (p.popupId !== this.popupId && popup.getAttribute('hidden') == null) {
                popup.setAttribute('hidden', '');
            }
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