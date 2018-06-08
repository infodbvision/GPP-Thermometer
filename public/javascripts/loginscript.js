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
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);
      return;
    }
    if (password.length == 0) {
      x.innerHTML = "Vul een wachtwoord in";
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);
      return;
    }
    if (user) {
      if (!user.emailVerified) {
  x.innerHTML = "Verifieer uw emailadres";
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);
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
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);
      } else {
        x.innerHTML = "Er bestaat geen gebruiker met deze gegevens";
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END authwithemail]
}

function sendPasswordReset() {
  var x = document.getElementById("snackbar");
  var email = document.getElementById('email').value;
  if (email.length == 0) {
    x.innerHTML = "Vul een emailadres in";
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);

    return;
  }
  // [START sendpasswordemail]
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    // Password Reset Email Sent!
    // [START_EXCLUDE]
    x.innerHTML = "Wachtwoord reset email is verstuurd";
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);

    // [END_EXCLUDE]
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/invalid-email') {
      x.innerHTML = "Dit is geen geldig emailadres";
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);
    } if (errorCode == 'auth/user-not-found') {
      x.innerHTML = "Er bestaat geen gebruiker met dit emailadres";
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);
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
  var x = document.getElementById("snackbar");
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        emailVerified = user.emailVerified;
        usersRef.child(user.uid).update({
          emailVerified: emailVerified
        });
        if (user.emailVerified) {
            window.location = "/";
        }
        if(!user.emailVerified) {
          x.innerHTML = "Verifieer uw emailadres";
          x.className = "show";
          setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);
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
