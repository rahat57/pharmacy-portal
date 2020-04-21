function getParamValue(paramName) {
    var url = window.location.search.substring(1);
    var qArray = url.split('&');
    for (var i = 0; i < qArray.length; i++) {
        var pArr = qArray[i].split('=');
        if (pArr[0] == paramName)
            return pArr[1];
    }
}
var apiKey = getParamValue('api_key');

var script = document.createElement('script');
if (apiKey == '' || apiKey == undefined || apiKey == null) {
    script.src = '/assets/tplmaps.js?api_key=$2a$10$FIC4ZAY4wHH3a75k4QuukuPuoU8gYloZcHXeDxb0E3fCVAYD6fSfy' ;
    //   script.src = '/js-api-v2-impl/assets/tplmaps.js?api_key=YOUR_API_KEY';
//     // script.src = 'https://api.tplmaps.com/js-api-v2/assets/tplmaps.js?api_key=YOUR_API_KEY';
} else {
   script.src = '/assets/tplmaps.js?api_key=$2a$10$FIC4ZAY4wHH3a75k4QuukuPuoU8gYloZcHXeDxb0E3fCVAYD6fSfy';
//     //   script.src = '/js-api-v2-impl/assets/tplmaps.js?api_key=' + apiKey;
//     // script.src = 'https://api.tplmaps.com/js-api-v2/assets/tplmaps.js?api_key=' + apiKey;
}

document.getElementsByTagName('head')[0].getElementsByTagName('script')[0].after(script);