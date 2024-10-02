class Dashboard {
    data = [];
    
    constructor() {
        let requests = REQUESTS;
        let data = [];
        requests.forEach(request => {
            if(request.getMaterial()) {
                data.push(request);
            }
        });
        this.data = data;
    }

    /**
     * update the state of a material
     */
    updateState() {
        this.data.forEach(request => {
            request.broke();
        });
    }

    /**
     * get DT Data of a spectific plan
     * 
     * @param p_code plan code (ex : A)
     */
    getDataPlan(p_code) {
        let codes = [];
        switch (p_code) {
            case "A":
                codes = ["A"];
                break;
            case "B":
                codes = ["B"];
                break;
            default:
                break;
        }

        let tempData = [];
        this.data.forEach(request => {
            codes.forEach(code => {
                if(request.getRf().includes(code)){
                    tempData.push(request);
                }
            });
        });
        this.data = tempData;
    }

    /**
     * summarizes DT data for index table
     * 
     * @returns data for index table
     */
    getIndexData() {
        let material;
        let dtDetail;
        let result = {
            "A": {
                "total" : 0,
                "priority1_2" : [],
                "priority3": [],
                "priority4": [],
                "codes": ["A"],
                "code" : "A"
            },
            "B": {
                "total" : 0,
                "priority1_2" : [],
                "priority3": [],
                "priority4": [],
                "codes": ["B"],
                "code" : "B"
            }
        };

        this.data.forEach(request => {
            if (request.getMaterial()) {
                material = request.getMaterial();

                dtDetail = {
                    'rf' : request.getRf(),
                    'num' : request.getNum(),
                    'priority' : request.getPriority(),
                    'basePriority' : request.getBasePriority(),
                    'comments' : request.getPriorityComments(),
                };

                for (var key in result) {
                    result[key].codes.forEach(code => {
                        if(request.getRf().includes(code)) {
                            result[key].total++;

                            if(material.getState().isBroken()){
                                result[key]["priority1_2"].push(dtDetail);
                            } else {
                                if (material.getState().isAtLowRisk()) {
                                    result[key]["priority4"].push(dtDetail);
                                } else if (material.getState().isAtHighRisk()) {
                                    result[key]["priority3"].push(dtDetail);
                                }
                            }
                        }
                    });
                }
            }
        });
        
        return result;
    }

    /**
     * get DT which has material from the reference csv
     */
    getDataMaterial(){
        let tempData = [];
        this.data.forEach(request => {
            if(request.getMaterial()){
                tempData.push(request);
            }
        });
        this.data = tempData;
    }

    /**
     * reset data
     */
    resetData() {
        this.data = REQUESTS;
    }

    /**
     * sort DT according to their priority (1 to 5)
     */
    sort() {
        let tempData = [];
        for (let i = 1; i <= 5; i++) {
            this.data.forEach(request => {
                if(request.getPriority() == i) {
                    tempData.push(request);
                }
            });
        }
        this.data = tempData;
    }

    /**
     * display popup on svg and trigger updateSvgItem function (from material) to display material color
     */
    updateSvgItems() {
        this.data.forEach(request => {
            if(request.getMaterial()) {
                let popup = new Popup(request);
                POPUPS.push(popup);
                popup.display();
                request.getMaterial().updateSvgItem();
            }
        });
    }

    /**
     * display the dashboard datas according to the pages
     * @param page string of a page (ex : "index" for displaying index.html dashboard data)
     */
    display(page) {
        const tbody = document.getElementById('tbody-data');
        let tbodyHTML = '';
        switch (page) {
            case 'index':
                const majDateDemande = document.getElementById('majDateDemande');
                majDateDemande.innerHTML = REQUEST_FILE_LAST_MODIFIED;

                this.updateState();
                
                let resumeData = this.getIndexData();

                for (var key in resumeData) {

                    tbodyHTML += '<tr>';
                    tbodyHTML += '<td class="uk-position-relative"><span class="uk-position-left-center uk-text-bold padding-top">'+key+'</span></td>';
                    tbodyHTML += '<td class="uk-position-relative"><span class="uk-position-left-center padding-top">'+resumeData[key].total+'</span></td>';

                    tbodyHTML += '<td class="uk-position-relative info-badge">';
                    if(resumeData[key]["priority1_2"].length > 0) {
                        tbodyHTML += `<span id="${key+"_priority1_2"}" class="badge urgent-badge uk-position-left-center">`;
                    }
                    else {
                        tbodyHTML += '<span class="uk-position-left-center uk-margin-small-left padding-top">';
                    }
                    tbodyHTML += resumeData[key]["priority1_2"].length+'</span></td>';

                    tbodyHTML += '<td class="uk-position-relative info-badge">';
                    if(resumeData[key]["priority3"].length > 0) {
                        tbodyHTML += `<span id="${key+"_priority3"}" class="badge mid-badge uk-position-left-center">`;
                    }
                    else {
                        tbodyHTML += '<span class="uk-position-left-center uk-margin-small-left padding-top">';
                    }
                    tbodyHTML += resumeData[key]["priority3"].length+'</span></td>';

                    tbodyHTML += '<td class="uk-position-relative info-badge">';
                    if(resumeData[key]["priority4"].length > 0) {
                        tbodyHTML += `<span id="${key+"_priority4"}" class="badge low-badge uk-position-left-center">`;
                    }
                    else {
                        tbodyHTML += '<span class="uk-position-left-center uk-margin-small-left padding-top">';
                    }
                    tbodyHTML += resumeData[key]["priority4"].length+'</span></td>';
                    tbodyHTML += '<td><a href="schema.html?code='+resumeData[key].code+'" class="uk-button uk-button-primary uk-border-rounded">Tableau de bord <span uk-icon="chevron-right" class="uk-margin-left"></span></a></td>';
                    tbodyHTML += '</tr>';
                }
                tbody.innerHTML = tbodyHTML;

                let popup;
                for (var key in resumeData) {
                    if (resumeData[key]["priority1_2"].length > 0) {
                        popup = new PopupIndex(resumeData[key]["priority1_2"], `${key+"_priority1_2"}`);
                        POPUPS.push(popup);
                        popup.display();
                    }
                    if (resumeData[key]["priority3"].length > 0) {
                        popup = new PopupIndex(resumeData[key]["priority3"], `${key+"_priority3"}`);
                        POPUPS.push(popup);
                        popup.display();
                    }
                    if (resumeData[key]["priority4"].length > 0) {
                        popup = new PopupIndex(resumeData[key]["priority4"], `${key+"_priority4"}`);
                        POPUPS.push(popup);
                        popup.display();
                    }
                }
                

                break;
            case 'schema':
                this.updateState();
                this.updateSvgItems();
                this.sort();

                // create table
                this.data.forEach(request => {
                    tbodyHTML += '<tr>';
                    tbodyHTML += '<td>'+request.getRf()+'</td>';
                    tbodyHTML += '<td>'+request.getLibelle()+'</td>';
                    if(request.getPriority() <= 2) {
                        tbodyHTML += '<td class="uk-position-relative"><span class="badge urgent-badge uk-position-center">'+request.getPriority()+'</span></td>';
                    } else if (request.getPriority() == 3) {
                        tbodyHTML += '<td class="uk-position-relative"><span class="badge mid-badge uk-position-center">'+request.getPriority()+'</span></td>';
                    } else if (request.getPriority() == 4) {
                        tbodyHTML += '<td class="uk-position-relative"><span class="badge low-badge uk-position-center">'+request.getPriority()+'</span></td>';
                    } else {
                        tbodyHTML += '<td>'+request.getPriority()+'</td>';
                    }
                    tbodyHTML += '<td><ul>';
                    if(request.getPc()){
                        tbodyHTML += '<li>'+request.getPc()+'</li>';
                    }
                    if(request.getMc()){
                        tbodyHTML += '<li>'+request.getMc()+'</li>';
                    }
                    if(request.getSc()){
                        tbodyHTML += '<li>'+request.getSc()+'</li>';
                    }
                    if(request.getCc()){
                        tbodyHTML += '<li>'+request.getCc()+'</li>';
                    }
                    tbodyHTML += '</ul></td>';
                    tbodyHTML += '<td>';
                    if(request.getNum()) {
                        tbodyHTML += '<a href="#" target="" class="uk-button uk-button-primary uk-border-rounded">Voir la requête <span uk-icon="icon: link-external; ratio: 1" class="uk-margin-left"></span></a>'
                    }
                    tbodyHTML +='</td></tr>';
                    tbody.innerHTML = tbodyHTML;
                });
                break;
            default:
                break;
        }
    }
}