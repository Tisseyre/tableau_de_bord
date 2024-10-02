/**
 * 
 * Set Requests Data from CSV File
 * 
 * @param fileData csv file
 * @param typeData request data
 */
function setData(fileData, typeData) {
    let rows = fileData.split('\r\n').map(row => row.split(';'));
    if (typeData == 'request') {
        // if the fileData is the request file data => create REQUESTS
        let request = null;
        rows.forEach(row => {
            if(REQUEST_STATUT_ALLOWED.includes(row[REQUEST_STATUT])) {
                let requestNum = row[REQUEST_NUM] ? row[REQUEST_NUM] : "";
                let requestRf = row[REQUEST_RF] ? row[REQUEST_RF] : "";
                let requestLibelle = row[REQUEST_LIBELLE] ? row[REQUEST_LIBELLE] : "";
                let requestPriority = row[REQUEST_PRIORITY] ? row[REQUEST_PRIORITY] : "";

                if(row[REQUEST_ETAT] == "B") {
                    request.setPc(row[REQUEST_PC]);
                    request.setMc(row[REQUEST_MC]);
                    request.setSc(row[REQUEST_SC]);
                    request.setCc(row[REQUEST_CC]);
                }        
                if(requestRf != "" && !isNaN(requestNum)) {
                    request = new Request(requestNum, requestRf, requestLibelle, requestPriority);
                    request.setMaterial();
                    REQUESTS.push(request);
                }
            }
        });
    } else {
        console.error('cannot find '+typeData+' datas');
    }
}

function setReferences() {
    jsonData.forEach(row => {
        let materialRf = row.RF ? row.RF : "";
        let materialLibelle = row.LIBELLE ? row.LIBELLE : "";
        if(materialRf != "") {
            let material = new Material(materialRf, materialLibelle);
            MATERIALS.push(material);
        }
    });
}

/**
 * 
 * Activate the SVG Schema
 * 
 * @param svgSchema 
 * @param code filter
 * 
 */
function activeSvg(svgSchema, code = null) {
    let isActive = false;
    for (let i = 0; i < svgSchema.children.length; i++) {
        if(code && svgSchema.children[i].id === code) {
            svgSchema.children[i].setAttribute('display', 'block');
            isActive = true;
        }
    }
    if(!isActive) {
        svgSchema.innerHTML = "<p>Pas de Schéma associé à : "+code;
        console.error('cannot find '+code+' svg schema');
    }
}

/**
 * Route to display pages content
 */
function pageContent() {
    let dashboard = new Dashboard();
    // if the current page is index.html => display index dashboard
    if (window.location.pathname.includes('index')) {
        dashboard.display('index');
    } else if (window.location.pathname.includes('schema')) { 
        // if the current page is schema.html => display schema dashboard
        const svgSchema = document.getElementById('svg-schema');
        let code = window.location.search.substring(6);
        if (code != "" && CODE_ALLOWED.includes(code)) {
            // if the code (ex : 0SEH) is allowed and not empty => display svg and data
            // else => redirect to index.html
            activeSvg(svgSchema, code);
            dashboard.getDataPlan(code);

            let title = document.getElementById('title-schema');
            switch (code) {
                case "A":
                    title.innerHTML = "Tableau de bord A";
                    break;
                case "B":
                    title.innerHTML = "Tableau de bord B";
                    break;            
                default:
                    break;
            }

            dashboard.display('schema');
        } else {
            window.location.replace("index.html");
        }
        
    }
}

document.addEventListener('DOMContentLoaded', (event) => {

    setReferences();

    // If there is no session storage item, display the file picker popup
    if(!getSessionStorageItems()) {
        const popupModal = document.getElementById('popup-modal');
        const popupSubmitButton = document.getElementById('popup-submit');
        let requestData = '';
    
        document.getElementById('requestInput').value = "";
        document.getElementById('requestTableName').textContent = "";
    
        popupSubmitButton.disabled = true;
    
        if (!sessionStorage.getItem('filesSelected')) {
            popupModal.style.display = 'block';
        }
    
        document.getElementById('requestSelect').addEventListener('click', () => {
            document.getElementById('requestInput').click();
        });
    
        document.getElementById('requestInput').addEventListener('change', (event) => {
            const fileName = event.target.files[0].name;
            document.getElementById('requestTableName').textContent = fileName;
            popupSubmitButton.disabled = false;
        });
    
        popupSubmitButton.addEventListener('click', () => {
            const requestInput = document.getElementById('requestInput');
    
            if (requestInput.files.length > 0) {
                /*sessionStorage.setItem('filesSelected', 'true');*/
                setSessionStorageItems('filesSelected', 'true');

                let requestInputDate = new Date(requestInput.files[0].lastModified);
                //sessionStorage.setItem('requestFileDate', requestInputDate.getDate()+"/"+requestInputDate.getMonth()+"/"+requestInputDate.getFullYear());
                setSessionStorageItems('requestFileDate', requestInputDate);

                readFile(requestInput.files[0], (data) => {
                    requestData = data;
                    popupModal.style.display = 'none';
                    setData(requestData, 'request');
                    setSessionStorageItems('requests', REQUESTS);
                
                    pageContent();
                });
            } else {
                alert('Veuillez sélectionner les deux fichiers.');
            }
        });
    } else {
        pageContent();
    }
    
});
function readFile(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;        
        callback(content);
    };
    reader.readAsText(file, 'ISO-8859-1');
}