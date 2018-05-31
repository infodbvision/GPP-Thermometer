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

function logOut() {
  if(firebase.auth().currentUser){
  firebase.auth().signOut().then(function() {
    window.location = "/";
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
} else{
  window.location = "login.html";
}
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user && user.emailVerified == true) {
    document.getElementById("displayName").innerHTML = user.displayName;
  } else {
    document.getElementById("Logoutbutton").textContent = "Inloggen";
  }
});
