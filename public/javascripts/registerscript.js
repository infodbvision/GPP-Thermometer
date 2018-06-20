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

//In deze functie wordt er een gebruikers account aangemaakt als alle velden zijn ingevuld

function handleSignUp() {
  var x = document.getElementById("snackbar");
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var displayName = document.getElementById('gebruikersnaam').value;
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

  //Hier wordt het account aangemaakt en in de database gestopt met de naam en email van de gebruiker

  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
    user.updateProfile({
      displayName: displayName
    }).then(function() {

    }, function(error) {
    });
    email = user.email;
    displayName = displayName;
    usersRef.child(user.uid).set({
      email: email,
      displayName: displayName
    });

    // als er een account is aangemaakt en in de database is gestopt wordt er een email voor het verifieren van het account gestuurd. Er worden nog Errors
    //afgevangen en laten zien aan de gebruiker als er iets misgaat.

    firebase.auth().currentUser.sendEmailVerification().then(function() {
  firebase.auth().signOut().then(function() {
      x.innerHTML = "Verificatie email is gestuurd";
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); window.location = "/"; }, 2500);
    }).catch(function(error) {
    });
    }).catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error.code);
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
    var errorCode = error.code;
    var errorMessage = error.message;
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
  });
}

//Hier worden de functies gelinkt aan de knop die deze functie moet gaan uitvoeren. Ook wordt er met de enter knop de functie registreren aangeroepen

function initApp() {
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
  document.getElementById("gebruikersnaam").onkeyup = function(e){
    if(e.keyCode === 13){
      handleSignUp();
    }
  }
}
window.onload = function() {
  initApp();
};
