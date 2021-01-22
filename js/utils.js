/**
   HTTP GET method.

   @param theUrl - Url of the API, including Get parameters
   @return Http response object
*/
function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.setRequestHeader('Content-Type', 'text/html');
    xmlHttp.setRequestHeader('charset', 'utf-8');
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

/**
   Adds sprintf style string formatting to the prototype of string.
*/
if (!String.prototype.format) {
    String.prototype.format = function() {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number) {
	    return typeof args[number] != 'undefined'
		? args[number]
		: match
	    ;
	});
    };
}

/**
   Switches the first child of one DOM element with the given DOM Element
*/
function switchFirstChild(parentId, newContent) {
    var parentEl = document.getElementById(parentId)
    var oldChild = parentEl.firstChild;
    oldChild.remove();
    parentEl.append(newContent);
}

/**
  Display problems
*/
function replace_special_chars(str) {
    str = str.replace('Ã¢Â€Â¦', '-');
    str = str.replace('Ã¢Â€Â“', '-');
    str = str.replace('Ã¢Â€Â', '-');
    str = str.replace('â€“', '-');
    str = str.replace('Ã¶', 'ö');
    str = str.replace('Ã¸', 'ø');
    str = str.replace('â€™', '\'');
    str = str.replace('Ã¼', 'ü');
    str = str.replace('â€˜', '\'');
    str = str.replace('â€', '');
    str = str.replace('â€˜', '');
//    str = str.replace("Î¼ ", "\u03BC");
//    str = str.replace(" Î¼", "\u03BC");
    str = str.replace("Î¼", "\u03BC");
    str = str.replace('“', '-');
    str = str.replace('Â±', '+-');
    str = str.replace('Â°', '°');
    str = str.replace('Â', ' ');
    str = str.replace('-™', "'");    
    return str;
}
