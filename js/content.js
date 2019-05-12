var USERSCRIPT_PATH = "https://greasyfork.org/en/scripts/";

function isStorageSupported() {
    try {
        return 'localStorage' in window && window.localStorage !== null;
    }
    catch (e) {
        return false;
    }
}
if (!isStorageSupported()) {
    console.warn("Local Storage is supported!");
}

function createScriptElement(url) {
    var script = document.createElement('script');
    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script);
}


function processResponse(settings) {
    var CNCTA_SCRIPTS = JSON.parse(settings['CNCTA_SCRIPTS']);
    var CNCTA_ENABLED = JSON.parse(settings['CNCTA_ENABLED']);

    for (var i in CNCTA_SCRIPTS) {
        var script = CNCTA_SCRIPTS[i];
		 var url = '';
        if (CNCTA_ENABLED[script.id] === true) {
			if (script.lib){
				  url = chrome.extension.getURL('/') + "libs/" + script.lib + ".js";
				  createScriptElement(url);
            console.log("Attaching lib: " + script.lib + ".js for" + script.name);
			}
                url = chrome.extension.getURL('/') + "scripts/" + script.id + ".user.js";
            
            console.log("Attaching script: " + script.name);
            createScriptElement(url);
        }
    }
}

function sendMessage(request, callback) {    
        chrome.runtime.sendMessage(request, callback);
   
}

/*------------------------------------------------*/
var CNCTA_SCRIPTS = null;

sendMessage({
    type: "get",
    name: ["CNCTA_SCRIPTS", "CNCTA_ENABLED"]
}, processResponse);
sendMessage({
    type: "pageAction"
}, function(response) {});