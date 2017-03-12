/**
 * Created by gurusrikar on 2/15/17.
 */

function initiateConnection() {
    var deviceName = document.getElementById("dev-name").value;

    var socket = io();
    console.log("socket established");

    socket.emit('namaste', deviceName);

    socket.on('redirect', function (msg) {
        console.log('redirect received from server' + msg);
        // window.location.replace(msg);
        // document.getElementById("view-frame").src = msg;
        updateWindow(msg);
    });

    return false;
}