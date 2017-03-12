/**
 * Created by gurusrikar on 3/1/17.
 */
var windowTab;
function updateWindow(url) {
    if (windowTab){
        windowTab.location.href = url;
    }else{
        windowTab = window.open(url);
    }
}
