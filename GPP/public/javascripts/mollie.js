// Generated by CoffeeScript 1.12.7
(function() {
  var Mollie, mollie;

  Mollie = require("../lib/mollie");


  /*
  	Initialize the Mollie API library with your API key.
  	See: https://www.mollie.com/beheer/account/profielen/
   */

  mollie = new Mollie.API.Client();

  mollie.setApiKey("test_3xP42vez8w5sbeaH2utVkSJ42SfWBW");

  module.exports = mollie;

}).call(this);