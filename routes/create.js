//Deze file handelt de betalingen af wanneer er vanaf de homepagina op betalen wordt gedrukt.

var express = require('express');
var router = express.Router();
var Mollie = require('mollie-api-node');
var firebase = require("firebase");
var admin = require("firebase-admin");

require('firebase/auth');
require('firebase/database');

var mollie = new Mollie.API.Client;
    mollie.setApiKey('test_3xP42vez8w5sbeaH2utVkSJ42SfWBW');

router.get('/',function(req, res) {
	var sess = req.session
  //Naar deze url wordt er verwezen wanneer er is betaald
    redirectUrl = "http://" + req.headers.host + "/execute";
    //Hier wordt de url aangemaakt met de punten in de url die er betaald gaan worden.
    var paymentArray = [];
    var payments = req.param('description');
    var paymentString = payments.split(",");
    var payment = {
    	amount: 20 * paymentString.length,
    	description: req.param('description'),
    	redirectUrl: redirectUrl,
    	method: "ideal"
    };

    //Hier wordt de betaallink gemaakt en wordt er een sessie meegestuurd naar de mollie website.
    mollie.payments.create(payment, function(payment) {
    	if (payment.error) {
        //als er een error onstaat wordt er een payment-error pagina gerendered.
          console.error(payment.error);
          res.render('payment-error', { 'error': payment.error });
        }else {
        sess.paymentId = payment.id;
        //als er geen errors zijn wordt de betaal pagina gerendered.
    	res.render('create-payment', { 'payment': payment });

        }
    });


});

module.exports = router;
