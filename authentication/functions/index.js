const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
  // check request is made by admin
  if (context.auth.token.admin !== true) {
    return { error: "Unauthorized" }
  }

  // get user and add custom claim
  return admin.auth().getUserByEmail(data.email)
    .then(user => {
      return admin.auth()
        .setCustomUserClaims(user.uid, {
          admin: true
        })
    }).then(() => {
      // what's been sent back to the front
      return {
        message: `Success! ${data.email} has been made an admin!`
      }
    }).catch(err => { return err; })
})