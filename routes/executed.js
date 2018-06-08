var express = require('express');
var router = express.Router();
var Mollie = require('mollie-api-node');
var firebase = require("firebase");
var admin = require("firebase-admin");
require('firebase/auth');
require('firebase/database');

var serviceAccount = require("../gppthermometer-firebase-adminsdk-lrzzy-a41a8c4072.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gppthermometer.firebaseio.com"
});

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
    var db = firebase.database();
router.get('/',function(req, res) {
    var paymentId = req.session.paymentId;
    mollie.payments.get(paymentId, function(payment) {
        if (payment.error) {
          console.error(payment.error);
          res.render('payment-error', { 'error': payment.error });
        }
        if (payment.isPaid()) {
          var paymentStatus;
          var paymentDescription;
          var idToken = req.cookies['idToken'];
          paymentStatus = payment.status;
          paymentDescription = payment.description;
          var paymentArray = paymentDescription.split(",");
          paymentArray.forEach(function(id){
            var payments = id;
            var usersRef = firebase.database().ref("users");
            admin.auth().verifyIdToken(idToken)
              .then(function(decodedToken) {
                var uid = decodedToken.uid;
                usersRef.child(uid + "/payments").push({
                  Time: firebase.database.ServerValue.TIMESTAMP,
                  PuntID: payments
                });
              }).catch(function(error) {
                console.log(error);
              });
          });

            res.render('executed-payment', { 'payment': payment });

        } else if(!payment.isOpen()){
          res.render('aborted');
        }


    });
});

module.exports = router;
