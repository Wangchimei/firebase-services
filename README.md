# Exploring Firebase Services

## Firebase Firestore
### Read data
#### Read data once
  ```js
  firebase.firestore().collection('collectionName').get().then(snapshot => {
    snapshot.forEach(doc => {
      console.log(`${doc.id}: ${doc.data()}`);
    });
  ```
#### Realtime update
  ```js
  firebase.firestore().collection('users').onSnapshot(
    (snapshot) => {
      let changes = snapshot.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {
          console.log("New user: ", change.doc.data());
        }
        if (change.type === "modified") {
          console.log("Updated user: ", change.doc.data());
        }
        if (change.type === "removed") {
          console.log("Removed user: ", change.doc.data());
        }
      });
    },
    (error) => console.log(error.message)
  )
  ```

### Query data
- Filter using `where`, with 3 params (`value of field`, `comparison operation`, `what value we want)`)  
  The comparison can be `<`, `<=`, `==`, `>`, `>=`, `array-contains`, `in`, or `array-contains-any`
  ```js
  firebase.firestore().collection('users')
    .where("pet", "==", "dogs")
    .where("privacy", "==", true);
  ```
  If queries are chained with range filters, filter only on one field is recommended.
  ```js
  firebase.firestore().collection('users')
    .where("age", "<=", 18)
    .where("age", ">=", 65)
  ```
- Order using `orderBy`
- Limit using `limit`
  ```js
  firebase.firestore().collection('users')
    .orderBy("name", "desc")
    .limit(5)
  ```

### Add data
```js
firebase.firestore().collection("users").add({
    name: "Someone",
    age: 35,
    privacy: true
  })
  .then( doc => {
      console.log(doc.id);
  })
  .catch( err => {
      console.error(err);
  });
```

### Update data
#### Update certain properties
```js
firebase.firestore().collection('users').doc(id)
  .update({
    age: 30,
  })
```
Only `age` will be updated.

#### Overwrite the whole document
```js
firebase.firestore().collection('users').doc(id)
  .set({
    age: 30,
  })
```
After updating, `name` and `privacy` will be empty.

### Delete data
```js
firebase.firestore().collection('users').doc(id).delete()
```

## Firebase Authentication
### Sign up
```js
firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(cred => console.log(cred.user))
  .catch(err => console.log(err.message))
```
### Sign in
```js
firebase.auth().signInWithEmailAndPassword(email, password)
  .then(cred => console.log(cred.user))
  .catch(err => console.log(err.message))
```

### Tracking Auth Status (Listener)
```js
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // Do something if the user is just signed in.
  } else {
    // Do something if the user is just signed out.
  }
});
```
### Custom Claims
Using custom claims is able add special properties to a user (e.g. admin, premium), other than basic properties, which will be included in user token.

#### Examples
1. To keep the functions secure, use Firebase Functions to run on server.
  ```js
  const admin = require('firebase-admin');
  admin.initializeApp();

  exports.setAdmin = functions.https.onCall((data, context) => {
    if (context.auth.token.admin !== true) {
      return { error: "Unauthorized!" }
    }
    return admin.auth()
      .getUserByEmail(data.email)
      .then(user => {
        return admin.auth()
          .setCustomUserClaims(user.uid, {
            admin: true
          })
      }).then(() => {
        return { message: "Success!" }
      }).catch(err => { return err; })
    })
   ```
2. Reference the function on front-end and make request
   ```js
    const setAdmin = firebase.functions().httpsCallable('setAdmin');
    setAdmin({ email: "some@email.com"})
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
   ```
3. Detect the custom claims from the front-end.
   ```js
   user.getIdTokenResult()
    .then(token => {
      console.log(token.claims)
    })
   ```
   The user token will contain `admin: true`.
4. Update Firestore rules with custom claims
   ```js
    allow write: if request.auth.token.admin == true;
   ```
### User data
#### Get current user
##### Set up an observer (recommended)
```js
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User is signed in.
  } else {
    // No user is signed in.
  }
});
```
##### Use `currentUser` property
```js
var user = firebase.auth().currentUser;
```
If a user isn't signed in, `currentUser` is null.

#### User's profile
Once the user is retrieved, the following properties are accessible.
```js
var user = firebase.auth().currentUser;

if(user) {
  var uid = user.uid;
  var displayName = user.displayName;
  var email = user.email;
  var emailVerified = user.emailVerified;
  var photoURL = user.photoURL;
  var isAnonymous = user.isAnonymous;
  var providerData = user.providerData;
}
```
### Update User
#### Profile (name and photoURL)
```js
var user = firebase.auth().currentUser;

user.updateProfile({
  displayName: "Someone",
  photoURL: "https://somelink.jpg"
  }).then(() => {
    console.log("updated")
  }).catch(err => {
    console.log(err)
  });
```
#### Email
```js
user.updateEmail("other_email@example.com")
  .then(() => {
    // Update successful.
  }).catch(err => {
    // An error happened.
  });
```
#### Password
```js
user.updatePassword(newPassword)
  .then(() => {
    // Update successful.
  }).catch(err => {
    // An error happened.
  });
```
### Sign out
```js
firebase.auth().signOut()
  .then(() => {
    // Sign-out successful.
  }).catch((err) => {
    // An error happened.
  });
```

## Firebase Functions
To be updated...

