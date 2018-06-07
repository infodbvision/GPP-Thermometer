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
* Handles the sign up button press.
*/
function handleSignUp() {
  var x = document.getElementById("snackbar");
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var displayName = document.getElementById('username').value;
  var usersRef = firebase.database().ref("users");
  var user = firebase.auth().currentUser;
  if (displayName.length == 0) {
    x.innerHTML = "Vul een gebruikersnaam in";
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);
    return;
  }
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
  // Sign in with email and pass.
  // [START createwithemail]
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
    // [END createwithemail]
    user.updateProfile({
      displayName: displayName
    }).then(function() {

    }, function(error) {
      // An error happened.
    });
    email = user.email;
    displayName = displayName;
    usersRef.child(user.uid).set({
      email: email,
      displayName: displayName
    });
    firebase.auth().currentUser.sendEmailVerification().then(function() {
      // Email Verification sent!
      // [START_EXCLUDE]
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
      x.innerHTML = "Verificatie email is gestuurd";
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); window.location = "/"; }, 2500);
    }).catch(function(error) {
      // An error happened.
    });
      // [END_EXCLUDE]
    }).catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error.code);
      // [START_EXCLUDE]
      if (errorCode == 'auth/invalid-email') {
        x.innerHTML = "Dit is geen geldig emailadres";
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);
      } else if (errorCode == 'auth/user-not-found') {
        x.innerHTML = "Er bestaat geen gebruiker met dit emailadres";
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);
      }
      console.log(error);
    });
  }, function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
      x.innerHTML = "Dit wachtwoord is niet sterk genoeg <br> Maak uw wachtwoord minstens 6 tekens lang";
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);
    }
    if (errorCode == 'auth/invalid-email') {
      x.innerHTML = "Dit is geen geldig emailadres";
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);
    }
    if(errorCode == 'auth/email-already-in-use'){
      x.innerHTML = "Dit emailadres is al in gebruik";
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);
    }
    console.log(error);
    // [END_EXCLUDE]
  });

  // [END createwithemail]
}

/**
* initApp handles setting up UI event listeners and registering Firebase auth listeners:
*  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
*    out, and that is where we update the UI.
*/
function initApp() {
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    }
  });
  // [END authstatelistener]
  document.getElementById('sign-up').addEventListener('click', handleSignUp, false);
  document.getElementById("password").onkeyup = function(e){
    if(e.keyCode === 13){
      handleSignUp();
    }
  }
  document.getElementById("email").onkeyup = function(e){
    if(e.keyCode === 13){
      handleSignUp();
    }
  }
  document.getElementById("username").onkeyup = function(e){
    if(e.keyCode === 13){
      handleSignUp();
    }
  }
}
window.onload = function() {
  initApp();
};
