$(function () {
    // Reference the auto-generated proxy for the hub.
    var chat = $.connection.chatHub;
    // Create a function that the hub can call back to display messages.
    chat.client.addNewMessageToPage = function (name, message) {
        // Add the message to the page.
        var msg = htmlEncode(message);
        msg = embed(msg);
        msg = urlify(msg);
        if (myName !== name) {
            $('#discussion').append('<li style="background-color:#E8E8E8;"><strong>' + htmlEncode(name)
                + '</strong>: ' + msg + "<i> - Enviado as: " + getTime() + '</i></li>');
            notify(name, message);
        }
        else {
            $('#discussion').append('<li style="background-color:#c3c3c3;"><strong>' + htmlEncode(name)
                + '</strong>: ' + msg + "<i> - Enviado as: " + getTime() + '</i></li>');
        }
        HistorySave($('#discussion').html())
    };
    // Get the user name and store it to prepend to messages.
    var myName = getName();

    $('#displayname').val(myName);
    //Load History Messages
    $('#discussion').append(HistoryGet());
    // Set initial focus to message input box.
    $('#message').focus();
    // Start the connection.
    $.connection.hub.start().done(function () {
        $("#message").keyup(function (event) {
            if (event.keyCode == 13 && $('#message').val() !== '') {
                // Call the Send method on the hub.
                chat.server.send($('#displayname').val(), $('#message').val());
                //Auto Scroll to Bottom
                window.scrollTo(0, document.body.scrollHeight);
                // Clear text box and reset focus for next comment.
                $('#message').val('').focus();
            }
        });
        $('#sendmessage').click(function () {
            if ($('#message').val() !== '') {
                // Call the Send method on the hub.
                chat.server.send($('#displayname').val(), $('#message').val());
                //Auto Scroll to Bottom
                window.scrollTo(0, document.body.scrollHeight);
                // Clear text box and reset focus for next comment.
                $('#message').val('').focus();
            }
        });

    });
});
//Notificação no Browser
function notify(name, message) {
    Notification.requestPermission(function () {
        var notification = new Notification("Mesa de Bar", {
            icon: '../Content/Images/pndb-logo.jpg',
            body: name + ' diz: ' + message,
            tag: "Chat"
        });
        notification.onclick = function () {
            notification.close();
            window.focus();

        }
    });
}
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function getTime() {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    return h + ":" + m + ":" + s;
}
// This optional function html-encodes messages for display in the page.
function htmlEncode(value) {
    var encodedValue = $('<div />').text(value).html();
    return encodedValue;
}
function embed(text) {
    var imgRegex = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
    return text.replace(imgRegex, function (img) {
        return '<img src="' + img + '" class="img-thumbnail img-responsive" /><br />';
    })
}


//Função para identificar e converter url
function urlify(text) {
    var urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return text.replace(urlRegex, function (url) {
        var _http = new RegExp("^(http|https)://");
        if (_http.test(url)) {
            return '<a href="' + url + '" target="_blank">' + url + '</a>';
        }
        else {
            return '<a href="http://' + url + '" target="_blank">' + url + '</a>';
        }
    })
}
function getName() {
    var name = localStorage.getItem("Name");
    if (name == null) {
        name = promptName();
        localStorage.setItem("Name", name);
    }
    return name;
}
function promptName() {
    var setName = prompt("Digite seu nome:", "");
    if (setName == null || setName == "") {
        promptName();
    }
    return setName;
}
function HistorySave(htmlMessage) {
    var lS = "History";
    localStorage.setItem(lS, htmlMessage);
}

function HistoryGet() {
    var valor = localStorage.getItem("History");
    return valor;
}