//console.log = function() {}

var lang = "EN";

function storeLang(activeLang){
    localStorage.setItem('lang', activeLang);
}


function retrieveLang(){
  if (localStorage.getItem('lang')) {
    lang = localStorage.getItem('lang');
    return lang;
  } else {
    return "EN";
  }
}


function reset(){
 localStorage.clear();
 window.location = window.location;
}