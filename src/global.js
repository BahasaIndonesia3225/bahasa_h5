var pcUrl= "http://studypc.bahasaindo.cn/";
if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) == false || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent)) == false){
  if(window.location.href.indexOf("?mobile") < 0){
    try{
      if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) == false){
        window.location.href = pcUrl;
      }
    }catch(e){}
  }
}
