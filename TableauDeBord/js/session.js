/**
 * remove all session storage items
 */
function removeSessionStorageItems() {
    sessionStorage.removeItem('filesSelected');
    sessionStorage.removeItem('requests');
    sessionStorage.removeItem('requestFileDate');
    window.location.reload();
}

/**
 * 
 * @returns boolean => if we get REQUESTS and materials session storage datas
 */
function getSessionStorageItems() {
    let res = false;
    if(sessionStorage.getItem('requests')) {
        // if we have requests and materials stored in session => create them
        let requestsJSON = JSON.parse(sessionStorage.getItem('requests'));

        requestsJSON.forEach(requestJSON => {
            let request = new Request(requestJSON.num, requestJSON.rf, requestJSON.libelle, requestJSON.priority, requestJSON.pc, requestJSON.mc, requestJSON.sc, requestJSON.cc);
            request.setMaterial();
            REQUESTS.push(request);
        });
        
        res = true;
    }
    if (sessionStorage.getItem('requestFileDate')) {
        // if we have DT File last modified Date in session => store it into REQUEST_FILE_LAST_MODIFIED
        REQUEST_FILE_LAST_MODIFIED = sessionStorage.getItem('requestFileDate');
    }
    return res;
}

function setSessionStorageItems(name, data) {
    if (name === "requests") {
        let requests = [];
        data.forEach(request => {
            requests.push({
                'num': request.getNum(),
                'rf': request.getRf(),
                'libelle': request.getLibelle(),
                'priority': request.getPriority(),
                'pc': request.getPc(),
                'mc': request.getMc(),
                'sc': request.getSc(),
                'cc': request.getCc()
            });
        });
        sessionStorage.setItem(name, JSON.stringify(requests));
    } else if (name == "requestFileDate") {
        let day = data.getDate();
        let month = data.getMonth();
        let year = data.getFullYear();

        if(day < 10)
            day = "0"+day;
        if(month < 10)
            month = "0"+month;

        sessionStorage.setItem(name, day+"/"+month+"/"+year);
        REQUEST_FILE_LAST_MODIFIED = sessionStorage.getItem('requestFileDate');
    } else {
        sessionStorage.setItem(name, data);
    }
}