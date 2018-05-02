const http = require('http');

const hostname = '127.0.0.1';
const port = 4200;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  //res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');

  Mollie = require('mollie-api-node');
  fs = require("fs");

  var orderId;
  orderId = new Date().getTime();

mollie = new Mollie.API.Client;
mollie.setApiKey('test_3xP42vez8w5sbeaH2utVkSJ42SfWBW');

mollie.payments.create({
    amount:      10.00,
    description: 'My first payment',
    redirectUrl: "http://" + req.headers.host + "/3-return-page?orderId=" + orderId,
    webhookUrl: "http://" + req.headers.host + "/2-webhook-verification?orderId=" + orderId,
    metadata: {
        orderId: orderId
    }
},  function (payment) {
    if (payment.error) {
        console.error(payment.error);
        return res.end();
    }

    /*
     * Send the customer off to complete the payment.
     */
    res.writeHead(302, {
        Location: payment.getPaymentUrl()
    });
    return res.end();
});
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
