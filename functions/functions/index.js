const functions = require('firebase-functions');

// HTTP Request
exports.randomNumber = functions.https.onRequest((request, response) => {
  const number = Math.round(Math.random() * 100);
  console.log(number); // this will be logged for debugging
  response.send(number.toString());
});

// HTTP Request 2
exports.ToGoogle = functions.https.onRequest((request, response) => {
  response.redirect('https://google.com');
});

// HTTP Callable
exports.greetings = functions.https.onCall((data, context) => {
  return `Hello! ${data.name}`;
});
