const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.getElementById("send-message").addEventListener("submit", postChat);
function postChat(e) {
    const user = firebase.auth().currentUser;
    const dbRef = db.ref("users/" + user.uid);
    e.preventDefault();
    const timestamp = Date.now();
    const chatTxt = document.getElementById("chat-txt");
    const message = chatTxt.value;
    chatTxt.value = "";
    dbRef.once('value').then((snapshot) => {
        var username = snapshot.val().username;
        db.ref("messages/" + timestamp).set({
            usr: username,
            msg: message,
        });
    });
    var myConnectionsRef = db.ref('users/' + user.uid + '/connections');

    var lastOnlineRef = db.ref('users/' + user.uid + '/lastOnline');

    var connectedRef = db.ref('.info/connected');
    connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
            var con = myConnectionsRef.push();
            con.onDisconnect().remove();
            con.set(true);
            lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
        }
    });
}
const fetchChat = db.ref("messages/");
fetchChat.on("child_added", function (snapshot) {
    const messages = snapshot.val();
    let msg = '';
    const user = firebase.auth().currentUser;
    const dbRef = db.ref("users/" + user.uid);
    dbRef.once('value').then((snapshot) => {
        var username = snapshot.val().username;
        if (messages.usr == username) {
            msg = `<li class="receiver"><span>` + messages.msg + " : " + messages.usr  + "</span></li>";
        }
        else {
            msg = `<li class="sender"><span>` + messages.usr + " : " + messages.msg + "</span></li>";
        }
        document.getElementById("messages").innerHTML += msg;
    });
    //   document.querySelector('#chat ul').scrollHeight(0);
    
});
