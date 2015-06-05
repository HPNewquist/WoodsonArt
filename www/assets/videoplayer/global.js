/* --------------------------------------- */

var isPublicBuild = true;
var cordovaIsLoaded = true;

var Utility = {
  formatTime: function(milliseconds) {
    if (milliseconds <= 0)
      return '00:00';
    var seconds = Math.round(milliseconds);
    var minutes = Math.floor(seconds / 60);
    if (minutes < 10)
      minutes = '0' + minutes;
    seconds = seconds % 60;
    if (seconds < 10)
      seconds = '0' + seconds;
    return minutes + ':' + seconds;
  },
  endsWith: function(string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
  }
};


/* --------------------------------------- */
function report(type,msg){

  // change back to if(cordovaIsLoaded) for PROD build
  if(isPublicBuild == true){
    if((cordovaIsLoaded) && (type != 'ERROR')) return false;  
  }

  switch(type){
    case 'VERBOSE':
      return false; // remove this line if verbose logging desired
      break;
    default:
      window.console.log(msg);
      break;
  }
}

/* --------------------------------------- */
function catchError(f,e){
  //*THIS LINE FOR TESTING/DEV USE ONLY --> */ alert('ERROR in (' + f + ')[Error Message: ' + e.message + ']');
  report('ERROR','ERROR in (' + f + ')[Error Message: ' + e.message + ']');
}


/* --------------------------------------- */
function clearTimeoutVar(tVar){

  try{
    if(typeof(tVar) != 'undefined'){
      window.clearTimeout(tVar);
    }
  }catch(e){ catchError('clearTimeoutVar()',e); }

}


/* --------------------------------------- */
function clearIntervalVar(iVar){

  try{
    if(typeof(iVar) != 'undefined'){
      window.clearInterval(iVar);
    }
  }catch(e){ catchError('clearIntervalVar()',e); }
}


function debugModeEnabled(){
  return true; //false;
}

/* --------------------------------------- */
window.onerror = function(message, url, linenumber) {
  report("ERROR","JavaScript error: " + message + " on line " + linenumber + " for " + url);
}


/* --------------------------------------- */
function preventBehavior(e) {
  e.preventDefault();
};

/* --------------------------------------- */
function initCap(str) {
if(!str) return false;
 var str = str.substring(0,1).toUpperCase() + str.substring(1,str.length).toLowerCase();
 return str;
}

/* ---------------------------------------- */
function addPaddedZero(num){
  if(num < 10) return String('0' + String(num));
  return String(num);
}

/*
 * Title Caps
 *
 * Ported to JavaScript By John Resig - http://ejohn.org/ - 21 May 2008
 * Original by John Gruber - http://daringfireball.net/ - 10 May 2008
 * License: http://www.opensource.org/licenses/mit-license.php
 */
/* ---------------------------------------- */
(function(){
  var small = "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)";
  var punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";

  this.titleCaps = function(title){
    var parts = [], split = /[:.;?!] |(?: |^)["Ò]/g, index = 0;

    while (true) {
      var m = split.exec(title);

      parts.push( title.substring(index, m ? m.index : title.length)
        .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function(all){
          return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
        })
        .replace(RegExp("\\b" + small + "\\b", "ig"), lower)
        .replace(RegExp("^" + punct + small + "\\b", "ig"), function(all, punct, word){
          return punct + upper(word);
        })
        .replace(RegExp("\\b" + small + punct + "$", "ig"), upper));

      index = split.lastIndex;

      if ( m ) parts.push( m[0] );
      else break;
    }

    return parts.join("").replace(/ V(s?)\. /ig, " v$1. ")
      .replace(/(['Õ])S\b/ig, "$1s")
      .replace(/\b(AT&T|Q&A)\b/ig, function(all){
        return all.toUpperCase();
      });
  };

  function lower(word){
    return word.toLowerCase();
  }

  function upper(word){
    return word.substr(0,1).toUpperCase() + word.substr(1);
  }
})();


/* --------------------------------------- */
function disableClickAndTouchEvents(e){
  e.stopPropagation();
}


/* --------------------------------------- */
function getCurrentPageName(upperCase){

  var sPath = window.location.pathname;
  var sPage;
  if(sPath.indexOf("\\",0) > -1){
    // use back slash
    sPage = sPath.substring(sPath.lastIndexOf('\\') + 1);
  }else{
    // use forward slash
    sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
  }
  if(upperCase == true){
    return sPage.toUpperCase();
  }else{
    return sPage;
  }
}


/* --------------------------------------- */
function isValidString(str){
  if(
    (typeof(str) != 'undefined') &&
    (str != '') &&
    (str != undefined) &&
    (str != null) &&
    (str != 'undefined')
  ){
    return true;
  }else{
    return false;
  }
}

/* ----------------------------------------------------------- /
  getFilenameFromURL
/ ----------------------------------------------------------- */
function getFilenameFromURL(url, removeExtension){
  var file = "";
  try{
        file = url.substring(url.lastIndexOf('/')+1);
        if(removeExtension == true){
          file = file.slice(0, -4); // assumes 3 letter extension for now
        }
        report('TEST','[global.js].getFilenameFromURL() [file:' + file + ']');

  }catch(e){ catchError('getFilenameFromURL()',e); }

  return file;
}


/* --------------------------------------- */
function getURLRoot(specialCase){
  var appURL = document.location.href;
  var appURLString = appURL.split("/");
  var appRoot = "/" + appURLString[appURLString.length-2];

  var appPath = "";
  for(var p=0;p<appURLString.length-1;p++){
    appPath += appURLString[p] + '/';
  }

  // alert('\n\t- [url:' + appURLString + '] \n\t- [root:' + appRoot + ']');
  if(specialCase == "ROOT_FOLDER_NAME"){
    var urlParts = appPath.split("/");
    var lastURLPart = urlParts[(urlParts.length-1)];
    if(lastURLPart == '') lastURLPart = urlParts[(urlParts.length-2)];
    return lastURLPart; //urlParts.length; // lastURLPart;
  }else{
    return appPath; //appRoot;
  }

}

/* --------------------------------------- */
function DecodeHTML(encodedHTML){
  var htmlJSONreply = $("<div/>").html(encodedHTML).text();
  return htmlJSONreply;
}


var shakeTimeout ;
function initDelayedBounce(elementID, milliseconds, overrideDefault){
  report('TEST','[global.js].initDelayedBounce()...[pageAlreadyVisited:' + pageAlreadyVisited() + ']..');

  $("#"+elementID).removeClass("bounce");
  window.setTimeout(function(){ $("#"+elementID).addClass("bounce");}, milliseconds);
}

/* --------------------------------------------*/
function removeSpaces(originalString){
    var newString = originalString.split(' ').join('');
    return newString;
    //alert(newString);
}

/* --------------------------------------------*/
function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent||tmp.innerText;
}


/* --------------------------------------------*/
function ellipsisText(strText,nLength){
  if(strText.length > nLength){
    return strText.substring(0,nLength) + "...";
  }else{
    return strText;
  }
}

/* --------------------------------------------*/
function randomRange(min,max) {
  return Math.round(Math.random() * (max-min) + min);
}



function browserDetection(){
    if((navigator.appVersion.toLowerCase().indexOf("safari",0) == -1) &&
    (navigator.appVersion.toLowerCase().indexOf("webkit",0) == -1)){
        return false;
    }
    return true;
}


function itemHasDisabledStyle(elementID){
    if ($("#" + elementID).attr("class").toLowerCase().indexOf("disable",0) > -1){
  return true;
    }else{
  return false;
    }
}


function devMessage(){
  alert('functionality not available yet...');
}

// /* ---------------------------------- */
// function resetVideo(videoID){
//   report('resetVideo(videoID:' + videoID + ')...');
//   try{
//     var video = document.getElementById(videoID);
//     video.setAttribute("src", "");
//     video.pause();
//     video.stop();
//   }
//   catch(e){
//     // video likely doesnt exist/not init yet
//   }
// }



function nullClickEvent(e){
  // do nothing
  e.stopPropagation();
}


function screenRefreshNoCache(){
  var timeNow = new Date();
  var timeStamp = timeNow.getHours() + timeNow.getSeconds() + timeNow.getMilliseconds();
  document.location.href = document.location.href + "?NOCACHE=" + timeStamp;
}

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;
}


function capitalize(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function pluralizeName(nameString){

  var lastLetter = nameString.substring(nameString.length-1,nameString.length);
  report('TEST','[global.js].pluralizeName()... lastLetter was [' + lastLetter + ']..');
  if(lastLetter.toUpperCase() == "S"){
    return nameString + "'";
  }else{
    return nameString + "'s";
  }
}


function getCurrentDateString(){
  var dte = new Date();
  return (String(parseInt(dte.getMonth()+1)) + '/' + dte.getDate() + '/' + dte.getFullYear());
}

function getCurrentTimeString(){
  var dte = new Date();
  var _time = getBasicTimeString(dte.getHours(),dte.getMinutes());
  return _time;
}




function getRandomID(){
  var dateNow = new Date();
  return String(Number(dateNow.getMilliseconds() * dateNow.getSeconds()));
}










function removeNonAlphaNumericChars(str){
  str = str.replace(/[ ]+/g,'_');
  str = str.replace(/[^a-zA-Z0-9_-]+/g,'');
  return str;
}


function removeProtectedDelimeters(str){
  str = str.replace(/[,;|]+/g,'');
  return str;
}


function openExternalURL(strURL){
    try{

    if(!isConnectedToInternet()){
      doGenericConnectionAlert();
      return false;
    }

    if(
      ((isIOSSimulatorMode()) || (!isMobile.any())) &&
      (strURL.toUpperCase().indexOf('ITUNES.APPLE.COM',0)>-1)
      ){
      doAlert('App Store links do not work in web browsers or device simulators. Please try this feature on a mobile device to confirm it is working properly.','App Store Link');
      return false;
    }

       window.open(strURL,'_blank','location=no');

    }catch(e){
        catchError('openExternalURL()...',e);
    }
}


/* ------------------------------------ */
function isIE(){ return !!window.ActiveXObject;}

/* ------------------------------------ */
function exploreObject(obj){

  var objInfo = "";
      for(var prop in obj){
        if(typeof(obj[prop]) == "object"){
          for(var oprop in obj[prop]){
            objInfo += "\n\t\t ----- [" + prop + "." + oprop + "] = [" + obj[prop][oprop] + "]";
          }
        }else{
          objInfo += "\n\t [" + prop + "] = [" + obj[prop] + "]";
        }

      }

      report('TEST',objInfo);
      return objInfo;
}


function isiPhone(){
    return (
        //Detect iPhone
        (navigator.platform.indexOf("iPhone") != -1) ||
        //Detect iPod
        (navigator.platform.indexOf("iPod") != -1)
    );
}



/* ------------------------------------------- */
function getTouchedPosition(element,e){

  var x,y;
  if(window.Touch){
    x = endCoords.pageX - $(element).offset().left; //e.targetTouches[0].pageX
    y = endCoords.pageY - $(element).offset().top; //e.targetTouches[0].pageY
  }else{
    x = e.pageX- $(element).offset().left;
    y = e.pageY- $(element).offset().top;

  }

  // alert('getTouchedPosition()...[' + $(element).attr('id') + ' was touched at [x:' + x + '] [y:' + y + ']');
  report('TEST','[global.js].getTouchedPosition()...[' + $(element).attr('id') + ' was touched at [x:' + x + '] [y:' + y + ']');
  return {'x':x,'y':y};

}


Array.prototype.avg = function() {
var av = 0;
var cnt = 0;
var len = this.length;
for (var i = 0; i < len; i++) {
var e = +this[i];
if(!e && this[i] !== 0 && this[i] !== '0') e--;
if (this[i] == e) {av += e; cnt++;}
}
return av/cnt;
}


function scrollToTop(){
  $(window).scrollTop(0); //window.scrollTo(0,0);
}


function getURLParameter(name,usePoundInsteadOfQuestionMarkIfAvailable) {
  var url = window.location.href;

  // use #param=value method?
  if(url.indexOf('?',0) == -1) usePoundInsteadOfQuestionMarkIfAvailable = true;
  var poundExistsInURL = (url.indexOf('#',0) > -1);
  if(
      (usePoundInsteadOfQuestionMarkIfAvailable == true) &&
      (poundExistsInURL)){
    return getHashParams()[name];
  }

  // otherwise use ?param=value method
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  if( results == null )
    return "";
  else
    return results[1];
}

function getUniqueIDString(){
  var time = new Date();
  return String(time.getMilliseconds() + time.getSeconds() + time.getDate());
}


function maskHalfString(origString){
  var stringParts = origString.split("");
  var maskedString = "";
  for(var s=0;s<stringParts.length;s++){
    if(s < stringParts.length/2){
      maskedString += "*";
    }else{
      maskedString += stringParts[s];
    }
  }
  return maskedString;
}

function maskFrontOfString(origString,charsToReveal){
  var stringParts = origString.split("");
  var maskedString = "";
  for(var s=0;s<stringParts.length;s++){
    if(s < (stringParts.length-charsToReveal)){
      maskedString += "*";
    }else{
      maskedString += stringParts[s];
    }
  }
  return maskedString;
}






String.prototype.stringContains = function(it) { return this.indexOf(it) != -1; };

if (typeof String.prototype.trim != 'function') { // detect native implementation
  String.prototype.trim = function () {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  };
}


/* ----------------------------------------------------------- /
  isDisabled(element)
/ ----------------------------------------------------------- */
function isDisabled(element){
  report('VERBOSE','[global.js].isDisabled()..');
  try{
    return ($(element).hasClass('disabled'));

  }catch(e){ catchError('isDisabled()',e); }
}


/* ----------------------------------------------------------- /
  togglePopup
/ ----------------------------------------------------------- */
function togglePopup(id){
  report('TEST','[global.js].togglePopup(id:' + id + ')..');
  try{
    if(typeof(focusedPopupID) != 'undefined'){
      $('#'+focusedPopupID).toggle();
      focusedPopupID = undefined;
    }

    if(!!id){
      focusedPopupID = id;
      $('#'+id).toggle();
      $('body').addClass('popup_mode'); //$('#app_body').addClass('hidden');
    }else{
      $('.popup').hide();
      $('body').removeClass('popup_mode'); //$('#app_body').removeClass('hidden');
    }


  }catch(e){ catchError('togglePopup()',e); }
}


if (!String.prototype.contains) {
    String.prototype.contains = function (arg) {
        return !!~this.indexOf(arg);
    };
}

String.prototype.removeLeadingOrTrailingCommasOrSemicolons = function(){
  var arg = this;
  var oldarg = arg;
  if((arg.substring(0,1) == ',') || (arg.substring(0,1) == ';')) arg = arg.substring(1,arg.length);
  if((arg.substring(arg.length-1,arg.length) == ',') || (arg.substring(arg.length-1,arg.length) == ';')) arg = arg.substring(0,arg.length-1);
  // report('VERBOSE',' removeLeadingOrTrailingCommasOrSemicolons() OLD:(' + oldarg + ') | NEW:(' + arg + ')');
  return arg;
};

function hideKeyboard(){
  document.activeElement.blur();
  $("input").blur();
  $("body").focus();
};

function validateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function secondsBetweenTwoDates(date1, date2){
  var difference = (date2 - date1) / 1000;
  return difference;
}


/* ----------------------------------------------------------- /
  getBasicTimeString
  example: 5:23 PM
/ ----------------------------------------------------------- */
function getBasicTimeString(h,m,excludeSuffix){

  try{

    var _hour = h;
    var _min = m;
    var _ampm = "AM";

        if(_hour > 11){ _ampm = "PM";}
    if(_hour > 12){ _hour -= 12;}

    // integrate [excludeSuffix] later
    if(_min < 10) _min = "0" + m.toString();
    _timeString = _hour + ":" + _min + " " + _ampm;


    report('TEST','[global.js].getBasicTimeString(h:' + h + ',m:' + m + ',excludeSuffix:' + excludeSuffix + ').. [' + _timeString + ']');

    return _timeString;

  }catch(e){ catchError('getBasicTimeString()',e); }
}



function isEmpty(value){
  return (value == null || value.length === 0);
}

String.prototype.replaceAll = function(str1, str2, ignore)
{
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}




/* ----------------------------------------------------------- /
  renderBooleanAsYesOrNo
/ ----------------------------------------------------------- */
function renderBooleanAsYesOrNo(boolean){
  report('VERBOSE','[global.js].renderBooleanAsYesOrNo(' + boolean + ')..');
  try{
    switch(boolean){
      case true:
        return "YES";
        break;
      case false:
        return "NO";
        break;
    }

  }catch(e){ catchError('renderBooleanAsYesOrNo()',e); }
}




/* ----------------------------------------------------------- /
  getThreeDigitIDFromInteger
/ ----------------------------------------------------------- */
function getThreeDigitIDFromInteger(strInt){
  report('VERBOSE','[global.js].getThreeDigitIDFromInteger()..');
  try{
    // if(parseInt(strInt) == "NaN") return strInt;
    // strInt = parseInt(strInt);
    var _ID = "";

    if(strInt.length < 2){ // if(strInt < 10){
      _ID = "00" + strInt;
    }else if(strInt.length < 3){ //}else if(strInt < 100){
      _ID = "0" + strInt;
    }else{
      _ID = strInt;
    }

    return _ID

  }catch(e){ catchError('getThreeDigitIDFromInteger()',e); }
}

function isLocalHost(){ return (document.location.href.indexOf('localhost',0) > -1); }

function isDebugMode(specificMode){

  var querystringflag = false;
  var devEmailInUse = false;
  var _isDebugMode = false;

  if(specificMode == 'USE_INIT_STATE') return debugInitialState;

  // DEV EMAIL IN USE?
  try{
    // if activation form email is developer
    var activationFormEmail = document.getElementById("activate_email").value;
    var activationFormVisible = (document.getElementById('app_activation').style.display != 'none');
    refreshCurrentUserEmail();

    if(activationFormVisible){
      // if valid email and is dev email then dev/debug mode
      if(activationFormEmail == developerEmail){
        if(validateEmail(activationFormEmail)) devEmailInUse = true;
      }
    }else if(currentUserEmail == developerEmail){
      devEmailInUse = true;
    }

    // QUERYSTRING ?DEBUG=anything found?
    if(document.location.href.toUpperCase().indexOf('DEBUG',0) > -1) querystringflag = true;
    //window.console.log('localstorageflag:' + localstorageflag + ', querystringflag:' + querystringflag);
    if(specificMode == 'QUERYSTRING') return querystringflag;

    window.console.log('isDebugMode() ... querystringflag:' + querystringflag + ' | devEmailInUse:' + devEmailInUse + ' [' + currentUserEmail + '?=' + developerEmail + '] | activationFormVisible:' + activationFormVisible + ' | validActFormEmail:' + validateEmail(activationFormEmail));
    _isDebugMode = ((querystringflag) || (devEmailInUse));
  }catch(e){
    _isDebugMode = false;
  }
  //window.console.log('_isDebugMode:' + _isDebugMode);
  return _isDebugMode;
}


// aspect ratio helper (greatest common divisor)
function gcd (a, b) {
    return (b == 0) ? a : gcd (b, a%b);
}

function isHighResScreen(){
  if(!window.devicePixelRatio) return false;
  var _isHighRes = (window.devicePixelRatio > 1);
  report('TEST','[global.js].isHighResScreen() [' + _isHighRes + ']');
  return _isHighRes;
}

function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
       http://www.cnn.com/2013/09/18/us/oklahoma-lake-car-bodies/index.html?hpt=hp_t1 _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}


function clearFakeActiveClass(){
  $('.faked-active').removeClass('faked-active');
}


/* ----------------------------------------------------------- /
  clearElementHTML
/ ----------------------------------------------------------- */
function clearElementHTML(elementID){
  report('TEST','[global.js].clearElementHTML()..');
  try{
    $('#'+elementID).html('');
  }catch(e){ catchError('clearElementHTML()',e); }
}

/* --------------------------  /
/ getHashParams()
/ Method to help fetch qstring params similar to getURLParameter(name)
/ when a # is used instead of a ? mark in the url
/ Usage: getHashParams().ID  would return "myIDValue" from google.com?ID=myIDValue
/ Reason: http://stackoverflow.com/questions/7855429/loading-url-in-webview-for-android-3-1-fails-on-device-but-works-on-emulator
/ Src: http://stackoverflow.com/a/4198132/826308
/ ---------------------------- */
function getHashParams() {
    var hashParams = {};
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&;=]+)=?([^&;]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.hash.substring(1);

    while (e = r.exec(q))
       hashParams[d(e[1])] = d(e[2]);
    return hashParams;
}

// ascending sort
function asc_sort(a, b){
    report('TEST','[global.js].asc_sort()...');
    return ($(b).text().toUpperCase()) < ($(a).text().toUpperCase()) ? 1 : -1;
}

// descending sort
function desc_sort(a, b){
    report('TEST','[global.js].desc_sort()...');
    return ($(b).text().toUpperCase()) > ($(a).text().toUpperCase()) ? 1 : -1;
}

$.fn.stripClass = function (partialMatch, endOrBegin) {
  /// <summary>
  /// The way removeClass should have been implemented -- accepts a partialMatch (like "btn-") to search on and remove
  /// </summary>
  /// <param name="partialMatch">the class partial to match against, like "btn-" to match "btn-danger btn-active" but not "btn"</param>
  /// <param name="endOrBegin">omit for beginning match; provide a 'truthy' value to only find classes ending with match</param>
  /// <returns type=""></returns>
  var x = new RegExp((!endOrBegin ? "\\b" : "\\S+") + partialMatch + "\\S*", 'g');

  // http://stackoverflow.com/a/2644364/1037948
  this.attr('class', function (i, c) {
    if (!c) return;
    return c.replace(x, '');
  });
  return this;
};



$("#hello").removeClass (function (index, css) {
        return (css.match (/\bcolor-\S+/g) || []).join(' ');
    });


// 20140407
/* -------------------------------------------------- /
/   isPastDate
/   true/false if we're past the date passed in - normally in mm/dd/yyyy format
/ -------------------------------------------------- */
function isPastDate (strDate) {
    var isPast = false;
    try{
      var dateToPass = new Date(strDate);
      var today = new Date();
      var isPast = (today >= dateToPass);            
  }catch(ex){
    catchError('isPastDate',ex);
  }

  report('GLOBAL','\t\t\t isPastDate(strDate:' + strDate + ') [isPast:' + isPast + ']');
  return isPast;  

}

// 20140407
var isMobile  = {
    Android: function() {
        var isAndroid;
        if(
            (typeof(getURLParameter) == 'function') &&
            (getURLParameter('DEVICE') == 'ANDROID')
          ){
          isAndroid = true;
        }else{
          isAndroid = navigator.userAgent.match(/Android/i) ? true : false;
        }
        return isAndroid;
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};


/* -------------------------------------------------- /
/   ellipsisIfNecessary
/   had to roll my own method - couldnt find something exactly like this
/ -------------------------------------------------- */
function ellipsisIfNecessary (str,maxlen) {
    try{
      // report('GLOBAL','ellipsisIfNecessary(,maxlen)');

      // string isn't past max length 
      if(str.length < maxlen) return str;
      // string has no spaces - trimming w/out handling for around word spacing
      if(str.indexOf(' ',0) == -1) return str.substring(0,maxlen) + '...';
      
      // string has words/spaces - trimming intelligently so we dont cut a word in half
      var words = str.split(" ");
      var currentLength = 0;
      var trimmedString = "";
      var nextLength = 0;
      maxlen -= 4; // accounting for the " ..." we're going to add
      for(var w=0;w<words.length;w++){        
          var nextWord = words[w];
          if(w > 0){
              nextWord = ' ' + nextWord; // add space after first word
          }        
          nextLength += nextWord.length;
          if(nextLength > maxlen){            
              break;
          }else{
              trimmedString += nextWord;
              currentLength = nextLength;    
          }        
      }    
      return trimmedString + ' ...';
  
  }catch(ex){
    catchError('ellipsisIfNecessary',ex);
  }

}

console.log('[global.js] LOADED ...');