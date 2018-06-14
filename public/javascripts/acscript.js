// Initialize Firebase
var config = {
  apiKey: "AIzaSyCmeDbv8eGM8sPlpIGBiT6fxJJD-wujSBM",
  authDomain: "gppthermometer.firebaseapp.com",
  databaseURL: "https://gppthermometer.firebaseio.com",
  projectId: "gppthermometer",
  storageBucket: "",
  messagingSenderId: "639524050247"
};
firebase.initializeApp(config);

//De uitlog functie als de gebruiker uitlogt vanaf een pagina wordt hij terug gestuurd naar de home pagina. Als de gebruiker niet is ingelogd wordt hij
//doorgestuurd naar de inlog pagina

function logOut() {
  if(firebase.auth().currentUser){
  firebase.auth().signOut().then(function() {
    window.location = "/";
  }).catch(function(error) {
  });
} else{
  window.location = "login.html";
}
}

//Als er een gebruiker is ingelogd of uitgelogd wordt de menu balk aangepast

firebase.auth().onAuthStateChanged(function(user) {
  if (user && user.emailVerified == true) {
    document.getElementById("displayName").innerHTML = "Welkom " + user.displayName;
  } else {
    document.getElementById("Logoutbutton").textContent = "Inloggen";
  }
});
