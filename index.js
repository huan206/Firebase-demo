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

var ggProvider = new firebase.auth.GoogleAuthProvider();
const btnGoogle = document.getElementById('btnGoogle');

btnGoogle.addEventListener('click', e => {
  firebase.auth().signInWithPopup(ggProvider).then((result) => {
      var token = result.credential.accessToken;
      var user = result.user;

  }).catch(function(error) {
    var errorMessage = error.message;

    window.alert(errorMessage);
  })
}, false)

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    document.getElementById("user_div").style.display = "block";
    document.getElementById("signup_div").style.display = "none";
    document.getElementById("login_div").style.display = "none";
    
    var user = firebase.auth().currentUser;
    if (user != null) {
      var emailVerified = user.emailVerified;
      var email = user.email;
      var data =  '<h4> Hello, ' + email + '</h4>' +
                        '<h4>Account verified: ' + emailVerified + '</h1>';
      document.getElementById("user_para").innerHTML = data;
      if(emailVerified == true){
        document.getElementById("verify").style.display = "none"
    }
    }
  } else {
    document.getElementById("user_div").style.display = "none";
  }
});

function sendEmail() {
  // extracting the user from the firebase
  var user = firebase.auth().currentUser;

  user.sendEmailVerification().then(function() {
      window.alert("Verification link sent to your email. Kinldy check to verify your account")
  }).catch(function(error) {
    var errorMessage = error.message;

    window.alert(errorMessage);
  });
}

function signup() {

  var userEmail = document.getElementById("email_signup").value;
  var userPass = document.getElementById("password_signup").value;

  firebase.auth().createUserWithEmailAndPassword(userEmail, userPass)
    .then((userCredential) => {
      // Signed in 
      var user = userCredential.user;
      window.alert('User created!');
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;

      window.alert(errorMessage);
    });
}
function login() {

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

}

function logout() {
  firebase.auth().signOut();
  location.reload();
}
