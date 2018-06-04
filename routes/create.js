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

    redirectUrl = "http://" + req.headers.host + "/execute";

    var paymentArray = [];
    var payments = req.param('description');
    var paymentString = payments.split(",");
    var payment = {
    	amount: 20 * paymentString.length,
    	description: req.param('description'),
    	redirectUrl: redirectUrl,
    	method: "ideal"
    };


    mollie.payments.create(payment, function(payment) {
    	if (payment.error) {
          console.error(payment.error);
          res.render('payment-error', { 'error': payment.error });
        }else {
        //store the payment.id in the session obj
        sess.paymentId = payment.id;

    	res.render('create-payment', { 'payment': payment });

        }
    });


});

module.exports = router;
