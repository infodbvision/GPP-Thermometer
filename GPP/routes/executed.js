var express = require('express');
var router = express.Router();
var Mollie = require('mollie-api-node');
var firebase = require("firebase");
require('firebase/auth');

var mollie = new Mollie.API.Client;
    mollie.setApiKey('test_3xP42vez8w5sbeaH2utVkSJ42SfWBW');

    var config = {
      apiKey: "AIzaSyCmeDbv8eGM8sPlpIGBiT6fxJJD-wujSBM",
      authDomain: "gppthermometer.firebaseapp.com",
      databaseURL: "https://gppthermometer.firebaseio.com",
      projectId: "gppthermometer",
      storageBucket: "gppthermometer.appspot.com",
      messagingSenderId: "639524050247"
    };
    firebase.initializeApp(config);
    // links to my firebase database
    var db = firebase.database();
    //sets the reference to the root of the database, or the server I'm not quite sure.
    //var ref = db.ref("/");
firebase.auth().onAuthStateChanged(function(user) {
  console.log(user);
});
router.get('/',function(req, res) {

    var paymentId = req.session.paymentId;
    var user = firebase.auth().currentUser;
    console.log(user);
    mollie.payments.get(paymentId, function(payment) {
        if (payment.error) {
          console.error(payment.error);
          res.render('payment-error', { 'error': payment.error });
        }
        if (payment.isPaid()) {
          var paymentStatus;
          var paymentDescription;
  //      if(user){
          console.log(user);
          paymentStatus = payment.status;
          paymentDescription = payment.description;
          var usersRef = firebase.database().ref("users");

          usersRef.child("K7gJyPuUkdMpjq5DRZoGxcdmYpu2" + "/payments").push({
            paymentStatus: paymentStatus,
            PuntID: paymentDescription
          });
    //    }

/*
          var user = firebase.auth().currentUser;
            var usersRef = firebase.database().ref("users");
            console.log(usersRef);
            if(user){
              usersRef.child(user.uid).set({
                betaald: "ja"
              });
          }*/
  //console.log(paymentDescription);
  //console.log(paymentStatus);

            res.render('executed-payment', { 'payment': payment });

        } else if(!payment.isOpen()){
          console.log("aborted");
          res.render('aborted');
        }


    });
});

module.exports = router;
