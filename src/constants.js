//const host = "http://192.168.2.12:3003";//"http://192.168.43.149:3003";
const host = "http://localhost:3003";
const url = host + "/api/portal/";

let getCookie = function(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return -1;
}

let setCookie = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";";
}

let getFormatedDate = (date) => {
    date = new Date(date);
    return ( 
        (date.getDate() < 10) ? '0'+date.getDate() : date.getDate() 
    ) 
    + ":" + 
    ( (date.getMonth() + 1) < 10 ? '0'+(date.getMonth() + 1) : (date.getMonth() + 1) )
     + ":" + date.getFullYear();
}



const status_type = [
    ['PENDING',true],
    ['APPROVED',true],
    ['REJECTED',true],
    ['IN PROGRESS',true],
    ['COMPLETED',true]
]


const griev_type = [
    ['DAMAGED BRIDGE',true],
    ['DAMAGED BRIDGE PARAPET',true],
    ['BREACH ON A ROAD',true],
    ['DAMAGED RAILING',true],
    ['SHARP CURVE',true],
    ['ACCIDENT PRONE ZONE',true],
    ['DAMAGE STRUCTURES',true],
    ['POT HOLES',true],
    ['FALLEN TREE',true],
    ['DEGREDED ROADS',true],
    ['CRACKS LEVELING',true],
]

const hierarchy = [
    'Section Officer',
    'Deputy Executive Engineer',
    'Executive Engineer',
    'Superintending Engineer',
    'Chief Engineer'
]

export {
    host,
    url,
    getCookie,
    setCookie,
    getFormatedDate,
    griev_type,
    status_type,
    hierarchy
}
