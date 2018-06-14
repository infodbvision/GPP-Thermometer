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

//Hier wordt er ingelogd door de gebruiker eerst worden er checks gedaan of alle velden wel zijn ingevuld

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

    // Inloggen met email en wachtwoord als er een error komt vang dit af en laat het zien aan de gebruiker

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
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
    });
}

//In de functie wordt het wachtwoord gereset eerst komen er weer checks of alle velden wel zijn ingevuld

function sendPasswordReset() {
  var x = document.getElementById("snackbar");
  var email = document.getElementById('email').value;
  if (email.length == 0) {
    x.innerHTML = "Vul een emailadres in";
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);

    return;
  }

  // Hier wordt de reset emial verstuurt ook worden er errors afgevangen en aan de gebruiker laten zien

  firebase.auth().sendPasswordResetEmail(email).then(function() {
    x.innerHTML = "Wachtwoord reset email is verstuurd";
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2500);
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
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
  });
}

// Hier wordt er uitgelogd

function logOut(){
  firebase.auth().signOut().then(function() {
  }).catch(function(error) {
  });
}

// Deze functie wordt aangeroepen als de pagina wordt geopend. In deze functie wordt de user object in de database geupdate om te zien of zijn email is
//geverifieerd

function initApp() {
  var usersRef = firebase.database().ref("users");
  var x = document.getElementById("snackbar");
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        emailVerified = user.emailVerified;
        usersRef.child(user.uid).update({
          emailVerified: emailVerified
        });

        //als de email is geverifieerd mag er worden ingelogd anders krijgt de gebruiker een melding

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

  //Hier worden de functies gelinkt aan de knop die deze functie moet gaan uitvoeren. Ook wordt er met de enter knop de functie login aangeroepen 

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
