
$(document).ready(function() {
	$( "button" ).button();	
    $('#options').click(function() {
        chrome.runtime.openOptionsPage();
    });
    $('#close').click(function() {
        chrome.tabs.getCurrent(function(tab) {
    chrome.tabs.remove(tab.id, function() { });
});
    });
    $('#version').text(chrome.runtime.getManifest().version);
    $('#changelog').load(chrome.runtime.getURL('CHANGELOG'));
	
});