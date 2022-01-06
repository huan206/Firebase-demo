$(function () {
  $('#login_btn').click(function () {
    $('#signup_div').hide();
    $('#login_div').show();
    return false;
  });
});
$(function () {
  $('#register_btn').click(function () {
    $('#signup_div').show();
    $('#login_div').hide();
    return false;
  });
});

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
var ggProvider = new firebase.auth.GoogleAuthProvider();
const btnGoogle = document.getElementById('btnGoogle');
const sighUp = document.getElementById('sighUp');
const login = document.getElementById('login');
const logout = document.getElementById('logout');
const sendMail = document.getElementById('sendMail');

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    document.getElementById("user_div").style.display = "block";
    document.getElementById("signup_div").style.display = "none";
    document.getElementById("login_div").style.display = "none";

    if (user != null) {
      var emailVerified = user.emailVerified;
      var email = user.email;
      const dbRef = db.ref("users/" + user.uid);
      dbRef.once('value').then((snapshot) => {
        var username = snapshot.val().username;
        var data = '<h1> Hello, ' + username + '</h1>' +
          '<h3>Your email: ' + email + '</h3>' +
          '<h3>Account verified: ' + emailVerified + '</h3>';
        document.getElementById("user_para").innerHTML = data;
        if (emailVerified == true) {
          document.getElementById("sendMail").style.display = "none"

        }
      });
    }
  } else {
    document.getElementById("user_div").style.display = "none";
  }
});

btnGoogle.addEventListener('click', e => {
  firebase.auth().signInWithPopup(ggProvider).then((result) => {
    var token = result.credential.accessToken;
    var user = result.user;

  }).catch(function (error) {
    var errorMessage = error.message;

    window.alert(errorMessage);
  })
}, false)



sendMail.addEventListener('click', (e) => {
  // extracting the user from the firebase
  var user = firebase.auth().currentUser;

  user.sendEmailVerification().then(function () {
    window.alert("Verification link sent to your email. Kinldy check to verify your account")
  }).catch(function (error) {
    var errorMessage = error.message;

    window.alert(errorMessage);
  });
});

sighUp.addEventListener('click', (e) => {

  var userEmail = document.getElementById("email_signup").value;
  var userPass = document.getElementById("password_signup").value;
  var name = document.getElementById('name_signup').value;

  firebase.auth().createUserWithEmailAndPassword(userEmail, userPass)
    .then((userCredential) => {
      // Signed in 
      var user = userCredential.user;
      db.ref('users/' + user.uid).set({
        username: name,
        email: userEmail
      });
      window.alert('User created!');
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;

      window.alert(errorMessage);
    });
});

login.addEventListener('click', (e) => {

  var userEmail = document.getElementById("email_login").value;
  var userPass = document.getElementById("password_login").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      window.alert("Error : " + errorMessage);
    });

});

logout.addEventListener('click', (e) => {
  firebase.auth().signOut();
  location.reload();
});
