// Initialize Firebase
var config = {
  apiKey: "AIzaSyCmeDbv8eGM8sPlpIGBiT6fxJJD-wujSBM",
  authDomain: "gppthermometer.firebaseapp.com",
  databaseURL: "https://gppthermometer.firebaseio.com",
  projectId: "gppthermometer",
  storageBucket: "gppthermometer.appspot.com",
  messagingSenderId: "639524050247"
};
firebase.initializeApp(config);
var database = firebase.database();

/**
* Handles the sign in button press.
*/
function toggleSignIn() {
    var x = document.getElementById("snackbar");
    var user = firebase.auth().currentUser;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length == 0) {
      x.innerHTML = "Vul een emailadres in";
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
      return;
    }
    if (password.length == 0) {
      x.innerHTML = "Vul een wachtwoord in";
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
      return;
    }
    if (user) {
      if (!user.emailVerified) {
  x.innerHTML = "Verifieer uw emailadres";
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
      }
      else {
        window.location = "/"
      }
}

    // Sign in with email and pass.
    // [START authwithemail]
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        x.innerHTML = "Verkeerd wachtwoord";
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);

      } else {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END authwithemail]
}

/**
* Sends an email verification to the user.
*/
function sendEmailVerification() {
  var x = document.getElementById("snackbar");
  var email = document.getElementById('email').value;
  var user = firebase.auth().currentUser;
  if (email.length == 0) {
    x.innerHTML = "Vul een emailadres in";
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);

    return;
  }
  // [START sendemailverification]
  firebase.auth().currentUser.sendEmailVerification().then(function() {
    // Email Verification sent!
    // [START_EXCLUDE]
    x.innerHTML = "Verificatie email is gestuurd";
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
    // [END_EXCLUDE]
  }).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error.code);
    // [START_EXCLUDE]
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
  });
  // [END sendemailverification]
}
function sendPasswordReset() {
  var x = document.getElementById("snackbar");
  var email = document.getElementById('email').value;
  if (email.length == 0) {
    x.innerHTML = "Vul een emailadres in";
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);

    return;
  }
  // [START sendpasswordemail]
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    // Password Reset Email Sent!
    // [START_EXCLUDE]
    x.innerHTML = "Wachtwoord reset email is verstuurd";
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);

    // [END_EXCLUDE]
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END sendpasswordemail];
}

function logOut(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
}
/**
* initApp handles setting up UI event listeners and registering Firebase auth listeners:
*  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
*    out, and that is where we update the UI.
*/
function initApp() {
  var usersRef = firebase.database().ref("users");
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        emailVerified = user.emailVerified;
        usersRef.child(user.uid).update({
          emailVerified: emailVerified
        });
        if (!user.emailVerified) {
        }
        else {
          window.location = "/"
        }
      }
  });
  // [END authstatelistener]
  document.getElementById('sign-in').addEventListener('click', toggleSignIn, false);
  document.getElementById('password-reset').addEventListener('click', sendPasswordReset, false);
  document.getElementById("password").onkeyup = function(e){
    if(e.keyCode === 13){
      toggleSignIn();
    }
  }
  document.getElementById("email").onkeyup = function(e){
    if(e.keyCode === 13){
      toggleSignIn();
    }
  }
}
window.onload = function() {
  initApp();
};
