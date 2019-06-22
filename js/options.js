var CNCTA_SCRIPTS = JSON.parse(localStorage.getItem('CNCTA_SCRIPTS'));
var CNCTA_ENABLED = JSON.parse(localStorage.getItem('CNCTA_ENABLED'));


function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}

preload([
    'imgs/icon_star.png'
]);

var allscriptsincluded = [];


function list_scripts (){
	var allscriptsincludedTXT="";
	allscriptsincluded.sort(function(a, b)
{
    if (a.toLowerCase() == b.toLowerCase()) { return 0; }
    if (a.toLowerCase() > b.toLowerCase()) { return 1;
    }
    else { return -1;
    }
});
	for (var i in allscriptsincluded) {
	allscriptsincludedTXT += allscriptsincluded[i] + "\n";
	}
	console.log(allscriptsincludedTXT);
}


$(document).ready(function() {
var UNIQUE_SCRIPTS = [''];
$( "button" ).button();	

    for (var i in CNCTA_SCRIPTS) {
        var script = CNCTA_SCRIPTS[i];
		allscriptsincluded.push(script.name + script.version);
		var unique = "";
		if (script.cat === "simulator"){
		unique = " unique";	
		} else if (script.unique){
		unique = " unique" +script.unique;
		if (UNIQUE_SCRIPTS.indexOf(script.unique) === -1) {
        UNIQUE_SCRIPTS.push(script.unique);
    }   	
		}
		

        var li = $('<div>');
        var html = "<div class='name'>";
        html += "<input id='s-" + script.id + "' class='cb" + unique + "'" + ((CNCTA_ENABLED[script.id] === true) ? " checked='checked'" : '') + " name='cb-" + script.id + "' type='checkbox' value='" + script.id + "' >";
        html += "<label for='s-" + script.id + "'>" + script.name + "</label>";
        html += "<span class='version'>" + script.version + "</span>";
		if (script.hot){
        html += "<img id='HOT' alt='RECCOMENDED' title='RECCOMENDED' src='imgs/icon_star.png'/>";
		li.css('color', 'rgb(251, 225, 197)');
		li.addClass( "hot" );
		} else {li.addClass( "nohot" );}
		
		if (script.greasyfork){
        html += " [ <a target='_blank' href='https://greasyfork.org/en/scripts/" + script.greasyfork + "'>+info</a> ]";}
		else if (script.userscript) {
		html += " [ <a target='_blank' href='http://userscripts-mirror.org/scripts/show/" + script.userscript + "'>+info</a> ]";	
		}
		else if (script.info) {
		html += " [ <a target='_blank' href='" + script.info + "'>+info</a> ]";	
		}
		if (script.disab) {
		html += " <span class='disabled'> >>> NOT WORKING</span>";	
		}
        html += "</div>";
		var divloc;
		if (script.cat) {
		divloc = script.cat;
		} else {
		divloc = "other";
		}
        li.append(html).appendTo('#'+divloc);
    }


$( ".cat" ).each(

    function(){
        if ( $( this ).children().length === 1)  {
                $( this ).hide();
             
    }}
	
	);



    $("#close").click(function() {
        chrome.tabs.getCurrent(function(tab) {
    chrome.tabs.remove(tab.id, function() { });
});
    });
	
	
     $( "input[name='toggleview']" ).lc_switch('ON', 'OFF');
	 
$( "div.lcs_wrap" ).on('lcs-on', function() {
	$( "div#toggle span" ).text( "VIEWING ONLY RECCOMENDED + CHECKED SCRIPTS " );
     $('div.nohot').find('input:not(:checked)').parents('.nohot').hide();
	 $( ".cat" ).each(

    function(){
        if ( $( this ).children(':visible').length === 1 )  {
                $( this ).hide();
             
    }}
	
	);
});


$( "div.lcs_wrap" ).on('lcs-off', function() {
	$( "div#toggle span" ).text( "VIEWING ALL SCRIPTS " );
     $('div.nohot').show();
	 $( ".cat" ).show().each(

    function(){
        if ( $( this ).children().length === 1 )  {
                $( this ).hide();
             
    }}
	
	);
});

      

    $("#save").click(function() {
        var enabled = {};
        for (var i in CNCTA_SCRIPTS) {
            var script = CNCTA_SCRIPTS[i];
            enabled[CNCTA_SCRIPTS[i].id] = $('input[name="cb-' + script.id + '"]').is(':checked');

            var tmp = enabled[CNCTA_SCRIPTS[i].id] ? 'enabled' : 'disabled';
        }
        localStorage.setItem('CNCTA_ENABLED', JSON.stringify(enabled));

		$('#content').animate({
            opacity: 0
        }, 500, function() {
            $('#content').delay( 1500 ).animate({
                opacity: 1
            }, 2000);
        });
		
        $('#message').animate({
            opacity: 1
        }, 200, function() {
			
            $('#message').delay( 1500 ).animate({
            opacity: 0
        });
        });

    });
	
	for (var i in UNIQUE_SCRIPTS){
		var ucl = UNIQUE_SCRIPTS[i];
$('input.unique'+ucl).click({ui: ucl}, function(event) {
    $('input.unique'+event.data.ui).filter(':checked').not(this).prop( "checked", false );
});
	}


$('#content').show();
});