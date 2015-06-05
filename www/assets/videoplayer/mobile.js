var deviceSDID;
var root = this;
var focusedPopupID = undefined;
var clickOrTouchEvent  = "click";
var mouseDownOrTouchStart = "mousedown";
var mouseUpOrTouchEnd = "mouseup";
var deviceLocalizationString;

/* --------------------------------------- */
isMobile  = {
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



/* --------------------------------------- */
function onBodyLoad(){
  try{

    if(isMobile.any()){
        report('TEST','[mobile.js].onBodyLoad() DEVICE MODE [app:' + typeof(app) + ']. Waiting for app.initialize()...');
        createAndInitAppObject();
    }else{
        report('TEST','[mobile.js].onBodyLoad() NON-DEVICE MODE');
        _initApp();
    }

  }catch(e){
    catchError('ERROR in [mobile.js].onBodyLoad():',e);
  }
}

/* --------------------------------------- */
// initApp() should exist in the index.js or main js for the app
// if not this will just not run anything after onBodyLoad/deviceready
function _initApp(){
  getDeviceLocale(); // populates deviceLocalizationString
  if(typeof(initApp) == 'function') initApp();
}


/* --------------------------------------- */
function postDeviceReadyActions()
{
    report('TEST','[mobile.js].postDeviceReadyActions()');
    try{
        cordovaIsLoaded = true;
        clickOrTouchEvent = "touchstart";
        mouseDownOrTouchStart = "touchstart";
        mouseUpOrTouchEnd = "touchend";
        _initApp();
    }catch(e){
        console.log('ERROR in postDeviceReadyActions(): [' + e.message + ']');
    }
}

/* --------------------------------------- */
function createAndInitAppObject(){
    app = {
        // Application Constructor
        initialize: function() {
            if(!window.plugins) window.plugins = {};
            this.bindEvents();
        },
            // Bind Event Listeners
            //
            // Bind any events that are required on startup. Common events are:
            // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
            // deviceready Event Handler
            //
            // The scope of 'this' is the event. In order to call the 'receivedEvent'
            // function, we must explicity call 'app.receivedEvent(...);'
        onDeviceReady: function() {
            app.receivedEvent('deviceready');
            postDeviceReadyActions();
        },
            // Update DOM on a Received Event
        receivedEvent: function(id) {
            console.log('Received Event: ' + id);
        }
    };
    app.initialize();
}



/* --------------------------------------- */
function fixLocalFilePathsForAndroid(originalPath){
  if(!isMobile.Android()) return originalPath;
  var fixedPath = originalPath;
  try{
      if(
          (isMobile.Android()) &&
          (originalPath.toLowerCase().indexOf('android_asset',0) == -1) &&
          (originalPath.toLowerCase().indexOf('http:',0) == -1)
        ){
        fixedPath = "file:///android_asset/www/" + originalPath;
      }
  }catch(e){
      report('ERROR','!! ERROR: fixLocalFilePathsForAndroid() (originalPath:[' + originalPath + '| fixedPath:[' + fixedPath + '])');
  }
  report('TEST','\t--> fixLocalFilePathsForAndroid() (originalPath:[' + originalPath + '| fixedPath:[' + fixedPath + '])');
  return fixedPath;
}

/* --------------------------------------- */
function hasWifiConnection(){
  var connectionType = getConnectionType();
  var hasWifi = (connectionType.toUpperCase().indexOf("WIFI",0) > -1);
  report('TEST','hasWifiConnection() =' + hasWifi);
  return hasWifi;
}

/* --------------------------------------- */
function isConnectedToInternet(){
  var connectionType = getConnectionType();
  report('TEST','isConnectedToInternet:' + connectionType);
  return (
      (connectionType.toUpperCase().indexOf("NO NETWORK",0) == -1) &&
      (connectionType.toUpperCase().indexOf("UNKNOWN",0) == -1)
      );
}


/* --------------------------------------- */
function getConnectionType() {
    try{

        if((!cordovaIsLoaded) || (!navigator.connection)){
          return "wifi";
        }

        var networkState = navigator.connection.type;//navigator.network.connection.type;
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELLULAR] = 'Cellular generic connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        return states[networkState]; // alert('navigator.connection.type:' + navigator.connection.type + ' {states[networkState]=' + states[networkState] + '}');

    }catch(e){
        console.log('ERROR getConnectionType() [' + e.message + '] [lineNumber:' + e.lineNumber + ']');
    }

    return "wifi";

    // alert('Connection type: ' + states[networkState]);
}



/* --------------------------------------- */
function doAlert(message, title){

  var alertButtonLabel = 'OK';
  try{
    if(isValidString(jQuery.i18n.map._term_ok)){
      alertButtonLabel = jQuery.i18n.map._term_ok.toString();
    }
  }catch(e){
    // ignore if error thrown
  }

  try{
    report('TEST','doAlert() --> [' + message + ' | ' + title);

    var alertText = message;
    var alertTitle = title;
    if(navigator.notification){ //isMobile.any()){
      navigator.notification.alert(
      alertText,  // message
      alertDismissed,         // callback
      alertTitle,            // title
      alertButtonLabel                  // buttonName
      );
    }else{

      // for non-device testing
      alertText = alertTitle + ':\n\n' + alertText + '\n\nButton: [' + alertButtonLabel + ']';


      alert(alertTitle + "\n\n" + alertText);
    }

  }catch(e){ catchError('doAlert()',e); }

  // return false;
}

/* ---------------------------------------- */
function alertDismissed(e){
    // nothing - just stub function
    // return false;
}


/* --------------------------------------- */
function doConfirm(confirmText, confirmTitle, confirmCallback, confirmButtonLabels){

  var confirmButtonLabelYes = 'Yes';
  var confirmButtonLabelNo = 'No';
  try{
    if(isValidString(jQuery.i18n.map._term_yes)) confirmButtonLabelYes = jQuery.i18n.map._term_yes.toString();
    if(isValidString(jQuery.i18n.map._term_no)) confirmButtonLabelNo = jQuery.i18n.map._term_no.toString();
  }catch(e){
    // ignore if error thrown
  }

  try{

    if(typeof(confirmButtonLabels) == 'undefined') confirmButtonLabels = String(confirmButtonLabelYes + ',' + confirmButtonLabelNo).split(",");
    report('doConfirm() [confirmText:' + confirmText + ', confirmCallback:' + confirmCallback + ']');

    if(navigator.notification){ //usingMobileDevice() && isNativeAppMode()){

      //fadePageContentOutBeforePopup();
       navigator.notification.confirm(
        confirmText,
        confirmCallback,
        confirmTitle,
        confirmButtonLabels
      );
      //fadePageContentInAfterPopup();

    }else{

      // for non-device testing
      confirmText = confirmTitle + ':\n\n' + confirmText + '\n\nButtons: [' + confirmButtonLabels + ']';

      var confirmDecisionIndex = 2; // represents "false"
      if(confirm(confirmText)) confirmDecisionIndex = 1;
      confirmCallback(confirmDecisionIndex);
    }

  }catch(e){ catchError('doConfirm()',e); }

}


/* --------------------------------------- */
function doPrompt(promptText, promptTitle, promptDefaultText, promptCallback, promptButtonLabels){

  var promptButtonLabelYes = 'Yes';
  var promptButtonLabelNo = 'No';
  try{
    if(isValidString(jQuery.i18n.map._term_yes)) promptButtonLabelYes = jQuery.i18n.map._term_yes.toString();
    if(isValidString(jQuery.i18n.map._term_no)) promptButtonLabelNo = jQuery.i18n.map._term_no.toString();
  }catch(e){
    // ignore if error thrown
  }


  try{

    if(typeof(promptButtonLabels) == 'undefined') promptButtonLabels = String(promptButtonLabelYes + ',' + promptButtonLabelNo).split(",");
    report('doPrompt() [promptText:' + promptText + ', promptCallback:' + promptCallback + ']');

    if(navigator.notification){ //usingMobileDevice() && isNativeAppMode()){

      //fadePageContentOutBeforePopup();
       navigator.notification.prompt(
        promptText,
        promptCallback,
        promptTitle,
        promptButtonLabels,
        promptDefaultText
      );
      //fadePageContentInAfterPopup();

    }else{

      // for non-device testing
      promptText = promptTitle + ':\n\n' + promptText + '\n\nButtons: [' + promptButtonLabels + ']';

      var promptInputText = prompt(promptText,promptDefaultText);
      var promptData = new Object();
      promptData.input1 = promptInputText;
      if(isValidString(promptInputText)){
        promptData.buttonIndex = 1;
      }else{
        promptData.buttonIndex = 2;
    }

      promptCallback(promptData);
    }

  }catch(e){ catchError('doPrompt()',e); }

}




/* ----------------------------------------------------------- /
  getClickOrTapLabel
/ ----------------------------------------------------------- */
function getClickOrTapLabel(){
  report('TEST','[mobile.js].getClickOrTapLabel()..');
  try{
    switch(clickOrTouchEvent){
      case 'click':
        return "click";
        break;
      default:
        return "tap";
        break;
    }
  }catch(e){ catchError('getClickOrTapLabel()',e); }
}

/* ---------------------------------------- */
function appInSubFolderOfWWW(){
  var currentAppFolder = getURLRoot("ROOT_FOLDER_NAME").toUpperCase(); // www or other?
  inSubFolder = (currentAppFolder != 'WWW');
  return inSubFolder;
}


/* --------------------------------------- */
function isIOSSimulatorMode(){

  var _isIOSSimulatorMode = false;;
  try{
    if(!usingMobileDevice()) return false;
    var _platform = getDeviceType().toUpperCase();// device.name
    _isIOSSimulatorMode =(_platform.indexOf('SIMULATOR',0) > -1);
  }catch(ex){
    catchError('isIOSSimulatorMode()',ex);
  }

  //window.console.log('isIOSSimulatorMode(' + _isIOSSimulatorMode + ') platform:' +  device.name);
  return _isIOSSimulatorMode;
}


/* --------------------------------------- */
function isNativeAppMode(){
  // re-test if/when using non-Apple devices

  var isNative;
  var isSafari = navigator.userAgent.match(/Safari/i) != null;

  if(
      (document.location.href.toUpperCase().indexOf('FILE://',0) > -1)
       //&&
  //    (usingMobileDevice()) &&
//      (getDeviceType() != "WebBrowser")
    ){
    isNative = true;
  }else{
    isNative = false;
  }

  // report('\t\t isNativeAppMode() isSafari [' + isSafari + '] [isNative "FILE:" link?:' + isNative + ']');
  //*DEBUG */ report('[mobile.js].isNativeAppMode(' + isNative + ')');
  return isNative;
}

function usingMobileDevice(){
  var _isMobile = isMobile.any(); // globals.js
  // var userAgent = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
  return _isMobile;
}


// DEVICE DETECTION: Device API mode
function isiPhone(){
    return (
        //Detect iPhone
        (navigator.platform.indexOf("iPhone") != -1) ||
        //Detect iPod
        (navigator.platform.indexOf("iPod") != -1)
    );
}


function getDeviceLocale() {

  report('TEST','getDeviceLocale()..');

  try{

    if(!cordovaIsLoaded){
      // can we get this via javascript?

      // default to English for now when not on device
      deviceLocalizationString = navigator.language;
      deviceLocalizationString = deviceLocalizationString.replace("-","\_");

    }else{
        navigator.globalization.getLocaleName(
          function (locale) {
            // alert('locale: ' + locale.value + '\n');
            report('TEST','\t... getLocalizationCode() navigator.globalization.getLocaleName() [' + locale.value + ']');
            deviceLocalizationString = locale.value;
          },
          function () {
            // error - default to english
            deviceLocalizationString = 'en\_US';
          }
        );
    }

  }catch(e){
    report('ERROR','ERROR with getDeviceLocale() [' + e.message + ']');
    deviceLocalizationString = "en\_US";
  }


}


/* Currently Depends on Cordova plugin SecureDeviceIdentifier */
function getDeviceID(){
  /* DEBUG */ // doAlert('getDeviceID() [cordovaIsLoaded:' + cordovaIsLoaded + ']','???');
  try{
    if(cordovaIsLoaded){
      // _id = device.uuid; uuid deprecated...

          // APPLE method
          if(isMobile.iOS()){
            // this only works if SecureDeviceIdentifier plugin is loaded into xcode/app
            var secureDeviceIdentifier = window.plugins.secureDeviceIdentifier;
            /* DEBUG */ // doAlert('getDeviceID() [secureDeviceIdentifier:' + secureDeviceIdentifier + ']');

            secureDeviceIdentifier.get({
                domain: SDID_DOMAIN,
                key: SDID_KEY
            }, function(udid) {
                /* DEBUG */ //   navigator.notification.alert("SecureUDID=" + udid);
                deviceSDID = udid;
                // navigator.notification.alert("SecureUDID=" + udid);
                // report('TEST','CORDOVA: DEVICE ID:' + deviceSDID);
                /* DEBUG */ //  alert(deviceSDID);
                return deviceSDID;
            })
            // report('TEST',"*** plugins.uniqueDeviceId.secureDeviceIdentifier() ID?:" + _id + "***");
            // report('TEST','WEB: DEVICE ID:' + deviceSDID);

          }else{
            // EVERY OTHER DEVICE(?)
            deviceSDID = device.uuid;

          }


        }else{
          deviceSDID = "UNKNOWN (" + getDeviceType() + ")";
        }
  }
  catch(e){
    report('ERROR','ERROR with getDeviceID() [' + e.message + ']');
  }

}



function getDeviceName(){
  var name = getOS();

  try{
    if(cordovaIsLoaded){
      name = device.model; // iPad 2,5
      //name;
    }
  }
  catch(e){
    report('VERBOSE','ERROR','ERROR with getDeviceName() [' + e.message + ']');
  }

  report('VERBOSE','DEVICE NAME:' + name);

  return name; // removeNonAlphaNumericChars(name);
}




function getDeviceType(){
  var type;

  try{
    if(cordovaIsLoaded){
       type = device.model; // "name" deprecated after CDV 2.3 name;  // iPhone, iPad, iPod Touch
    }else{
       type = "WebBrowser";
    }
  }
  catch(e){
    report('VERBOSE','ERROR','ERROR with getDeviceType() [' + e.message + ']');
  }

  // alert('getDeviceType() = [' + type + ']');

  return type;
}

function getOS(){
  var OSName="Unknown OS";

  try{
    if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
    if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
    if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
    if((navigator.appVersion.indexOf("Mobile")!=-1)) OSName += " Mobile";
    if(cordovaIsLoaded) OSName = device.platform;

  }catch(e){ catchError('getOS()',e); }


  return OSName;
}

/* ----------------------------------------------------------- /
  getOSVersionFromUserAgent
/ ----------------------------------------------------------- */
function getOSVersionFromUserAgent(){
  report('TEST','[mobile.js].getOSVersionFromUserAgent()..');
  try{
    var _parts1 = navigator.userAgent.split("(");
    var _parts2 = _parts1[1].split(";");

    return _parts2[0];
  }catch(e){ catchError('getOSVersionFromUserAgent()',e); }
}

function getDeviceVersion(){
  var version;

  try{
    if(cordovaIsLoaded){
            version = getOS() + ' ' + device.version; // "name" deprecated after CDV 2.3 name;  // iPhone, iPad, iPod Touch
    }else{
       version = getOSVersionFromUserAgent();
    }
  }
  catch(e){
    report('VERBOSE','ERROR','ERROR with getDeviceVersion() [' + e.message + ']');
  }

  return version;
}

function getDeviceModel(){
  var model = "Unknown";

  try{
    if(cordovaIsLoaded){
      model = device.model; // iPad 2,5
    }else{
      model = getOS();
    }
  }
  catch(e){
    report('VERBOSE','ERROR','ERROR with getDeviceModel() [' + e.message + ']');
  }

  report('VERBOSE','DEVICE NAME:' + model);

  return model;
}

function getDevicePlatform(){
  var platform;

  try{
    if(cordovaIsLoaded){
      if(isIOSSimulatorMode()){
        platform = "iOS Simulator";
      }else{
        platform = device.platform; // iPad, iPhone
      }

    }else{
      platform = getDeviceType(); // WebBrowser likely
    }
  }
  catch(e){
    report('VERBOSE','ERROR','ERROR with getDevicePlatform() [' + e.message + ']');
  }

  report('VERBOSE','DEVICE NAME:' + platform);

  return platform;
}





/* ----------------------------------------------------------- /
  viewPDF
/ ----------------------------------------------------------- */
function viewPDF(strPDFURL){
  console.log('[mobile.js].viewPDF(strPDFURL:' + strPDFURL + ')..');
  try{

    var _pdfWindowType = "_blank";
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
    var windowX = 0;
    var windowY = 0;
    var pdfView;

    if(SCREEN_FORCE_LANDSCAPE){
      windowWidth = 660;
      windowHeight = 748;
      windowX = 182;
      windowY = 22;
    }

   //  if(isMobile.Android()){
   //    var pdfFilePrefix = getFilenameFromURL(strPDFURL,true);
   //    pdfView = window.open(rootURL + 'assets/web/pdf.html?file=' + pdfFilePrefix +
   //                                    '&vw=' + windowWidth +
   //                                    '&vh=' + windowHeight,
   //                                    '_blank',
   //                                    'enableviewportscale=yes,location=no');
   //  }else{
    strPDFURL = rootURL + strPDFURL; //if(appInAppletMode()) //alert('about to window.open(' + strPDFURL + ',' + _pdfWindowType + ')...');

    pdfView = window.open(strPDFURL.toLowerCase(),_pdfWindowType,'enableviewportscale=yes,location=no' +
                                                    ',fullscreenbuttonenabled=no,arrowbuttonsenabled=no' +
                                                    ',vw=' + windowWidth +
                                                    ',vh=' + windowHeight +
                                                    ',vx=' + windowX +
                                                    ',vy=' + windowY);
     pdfView.addEventListener('loadstart', function(){ setBodyPDFClass(); });
     pdfView.addEventListener('exit', function(){ pdfView.close(); clearBodyPDFClass(); });
   // }


  }catch(e){ catchError('viewPDF()',e); }
}


/* ----------------------------------------------------------- /
    clearBodyPDFClass
/ ----------------------------------------------------------- */
function clearBodyPDFClass(){
    report('TEST','[mobile.js].clearBodyPDFClass()..');
    try{
        // alert('clearBodyPDFClass..');
        $('body').removeClass('pdf_visible');
    }catch(e){ catchError('clearBodyPDFClass()',e); }
}

/* ----------------------------------------------------------- /
    setBodyPDFClass
/ ----------------------------------------------------------- */
function setBodyPDFClass(){
    report('TEST','[mobile.js].setBodyPDFClass()..');
    try{
        //alert('setBodyPDFClass..');
        $('body').addClass('pdf_visible');
    }catch(e){ catchError('setBodyPDFClass()',e); }
}





// onSuccess Callback
//
function cordovaOnSuccess() {
  console.log("cordovaOnSuccess()");
}

// onError Callback
//
function cordovaOnError(error) {
  alert('code: '    + error.code    + '\n' +
      'message: ' + error.message + '\n');
}


function doGenericConnectionAlert(){
  doAlert('This feature requires an internet connection. Please connect this device to a WiFi or a 3G/4G network and try again.','Internet Connection Required');
}




// function sendEmail(strTo,strSubject,strBody){

//   if(isEmpty(strTo)) return;
//   if(isEmpty(strSubject)) strSubject = '';
//   if(isEmpty(strBody)) strBody = '';

//   //strBody += '------------------------' + getEncodedLineBreakChar(); // + '---- contacts ----' + getEncodedLineBreakChar() + emailContactsList;

//   if(emailComposerConfiguredInApp && cordovaIsLoaded){
//     var emailArgs = {
//       toRecipients:strTo,
//       subject:strSubject,
//       body:strBody,
//       isHTML:false
//     };
//     cordova.exec(null, null, "EmailComposer", "showEmailComposer", [emailArgs]);
//   }else{
//     document.location = "mailto:" + strTo + "?Subject=" + strSubject + "&Body=" + strBody;
//   }
// }

// Cordova: PowerManagement Helper methods (where to move to?)
/* ----------------------------------------------------------- /
    PWpreventAutoLock (iOS only)
/ ----------------------------------------------------------- */
function PWpreventAutoLock(){
    if(cordovaIsLoaded) report('TEST','[mobile.js].PWpreventAutoLock() [iOS? {' + isMobile.iOS() + '}]');
    try{
        if(cordovaIsLoaded && isMobile.iOS()) cordova.require('cordova/plugin/powermanagement').acquire( powerMgmtSuccess, powerMgmtError );
    }catch(e){ catchError('PWpreventAutoLock()',e); }
}

/* ----------------------------------------------------------- /
    PWpreventAutoLockButAllowDim (iOS only)
/ ----------------------------------------------------------- */
function PWpreventAutoLockButAllowDim(){
    if(cordovaIsLoaded) report('TEST','[mobile.js].PWpreventAutoLockButAllowDim() [iOS? {' + isMobile.iOS() + '}]');
    try{
        if(cordovaIsLoaded && isMobile.iOS()) cordova.require('cordova/plugin/powermanagement').dim( powerMgmtSuccess, powerMgmtError );
    }catch(e){ catchError('PWpreventAutoLockButAllowDim()',e); }
}

/* ----------------------------------------------------------- /
    PWreenableAutoLock (iOS only)
/ ----------------------------------------------------------- */
function PWreenableAutoLock(){
    if(cordovaIsLoaded) report('TEST','[mobile.js].PWreenableAutoLock() [iOS? {' + isMobile.iOS() + '}]');
    try{
        if(cordovaIsLoaded && isMobile.iOS()) cordova.require('cordova/plugin/powermanagement').release( powerMgmtSuccess, powerMgmtError );
    }catch(e){ catchError('PWreenableAutoLock()',e); }
}

function powerMgmtError(error){ report('ERROR','powerMgmtError() [error(' + error + ')]'); }
function powerMgmtSuccess(success){ report('TEST','powerMgmtSuccess() success: ' + powerMgmtSuccess + '...');}



/* ----------------------------------------------------------- /
  getHeaderHeight
/ ----------------------------------------------------------- */
function getHeaderHeight(){
  var h = 0;
  try{
    h = (parseInt($('.page.active .page_title').height()) + parseInt($('#header').height()));
  }catch(e){ catchError('getHeaderHeight()',e); }

  report('TEST','getHeaderHeight() [' + h + ']');

  return h;
}

console.log('[mobile.js] LOADED ...');
