# Exploring Firebase Services

This repo contains notes for [Firebase Firestore](https://github.com/Wangchimei/firebase_services#firebase-firestore), [Firebase Authentication](https://github.com/Wangchimei/firebase_services#firebase-authentication), and [Firebase Functions](https://github.com/Wangchimei/firebase_services#firebase-functions).

## Firebase Firestore

- [CRUD](https://github.com/Wangchimei/firebase_services#crud)
- [Query Data](https://github.com/Wangchimei/firebase_services#query-data)
- [Security Rules](https://github.com/Wangchimei/firebase_services#security-rules)

### CRUD

#### Add data

```js
firebase
  .firestore()
  .collection('users')
  .add({
    name: 'Someone',
    age: 35,
    privacy: true
  })
  .then((doc) => {
    console.log(doc.id);
  })
  .catch((err) => {
    console.error(err);
  });
```

#### Read data

##### Read data once

```js
firebase.firestore()
  .collection('collectionName')
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      console.log(`${doc.id}: ${doc.data()}`);
    });
```

##### Realtime update

```js
firebase
  .firestore()
  .collection('users')
  .onSnapshot(
    (snapshot) => {
      let changes = snapshot.docChanges();
      changes.forEach((change) => {
        if (change.type === 'added') {
          console.log('New user: ', change.doc.data());
        }
        if (change.type === 'modified') {
          console.log('Updated user: ', change.doc.data());
        }
        if (change.type === 'removed') {
          console.log('Removed user: ', change.doc.data());
        }
      });
    },
    (error) => console.log(error.message)
  );
```

#### Update data

##### Update certain properties

```js
firebase.firestore().collection('users').doc(id).update({
  age: 30
});
```

Only `age` will be updated.

##### Overwrite the whole document

```js
firebase.firestore().collection('users').doc(id).set({
  age: 30
});
```

After updating, `name` and `privacy` will be empty.

#### Delete data

```js
firebase.firestore().collection('users').doc(id).delete();
```

### Query data

- Filter using `where`, with 3 params (`value of field`, `comparison operation`, `what value we want)`)  
  The comparison can be `<`, `<=`, `==`, `>`, `>=`, `array-contains`, `in`, or `array-contains-any`
  ```js
  firebase
    .firestore()
    .collection('users')
    .where('pet', '==', 'dogs')
    .where('privacy', '==', true);
  ```
  If queries are chained with range filters, filter only on one field is recommended.
  ```js
  firebase
    .firestore()
    .collection('users')
    .where('age', '<=', 18)
    .where('age', '>=', 65);
  ```
- Order using `orderBy`
- Limit using `limit`
  ```js
  firebase.firestore().collection('users').orderBy('name', 'desc').limit(5);
  ```

### Security Rules

**NOTE:**
Even though data is secured, when requesting all data, the set security rules are not filters. Using a filter `where` is needed!

#### Data Hierarchy

```node
service cloud.firestore {
  match /databases/{database}/documents {

    // Matches any document in the 'posts' collection or subcollections.
    match /posts/{post} {
      allow read, write: if <condition>;
    }

    match /users/{user} {
      allow read, write: if <condition>;

        // Explicitly define rules for the 'certificates' (users' subcollection)
        match /certificates/{certificate} {
          allow read, write: if <condition>;
        }
    }
  }
}
```

#### Operations

You can break down basic rules `read` and `write` into more granular operations.

- `read` rule: includes `get` and `list`
  - `get`: Applies to single document read requests
  - `list`: Applies to queries and collection read requests
- `write` rule: includes `create`, `update`, and `delete`
  - `create`: Applies to writes to nonexistent documents
  - `update`: Applies to writes to existing documents
  - `delete`: Applies to delete operations

#### Conditions

- Authentication

  ```node
  match /users/{userId} {
    allow read, update, delete: if request.auth != null && request.auth.uid == userId;
    allow create: if request.auth != null;
  }
  ```

- Data validation

  ```node
  match /posts/{post} {
    allow read: if resource.data.visibility == 'public';
  }
  ```

  Only allow update if age is over 18 and name is unchanged.

  ```node
  match /posts/{post} {
    allow update: if request.resource.data.age > 18
                  && request.resource.data.name == resource.data.name;
  }
  ```

## Firebase Authentication

- [Basic Auth](https://github.com/Wangchimei/firebase_services#basic-auth)
- [Tracking Auth Status](https://github.com/Wangchimei/firebase_services#tracking-auth-status)
- [Custom Claims](https://github.com/Wangchimei/firebase_services#custom-claims)
- [User Data](https://github.com/Wangchimei/firebase_services#user-data)

### Basic Auth

#### Sign up

```js
firebase
  .auth()
  .createUserWithEmailAndPassword(email, password)
  .then((cred) => console.log(cred.user))
  .catch((err) => console.log(err.message));
```

#### Login

```js
firebase
  .auth()
  .signInWithEmailAndPassword(email, password)
  .then((cred) => console.log(cred.user))
  .catch((err) => console.log(err.message));
```

#### Logout

```js
firebase.auth().signOut();
```

### Tracking Auth Status

```js
firebase.auth().onAuthStateChanged((user) => {
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
       return { error: 'Unauthorized!' };
     }
     return admin
       .auth()
       .getUserByEmail(data.email)
       .then((user) => {
         return admin.auth().setCustomUserClaims(user.uid, {
           admin: true
         });
       })
       .then(() => {
         return { message: 'Success!' };
       })
       .catch((err) => {
         return err;
       });
   });
   ```

2. Reference the function on front-end and make request
   ```js
   const setAdmin = firebase.functions().httpsCallable('setAdmin');
   setAdmin({ email: 'some@email.com' })
     .then((res) => console.log(res))
     .catch((err) => console.log(err));
   ```
3. Detect the custom claims from the front-end.
   ```js
   user.getIdTokenResult().then((token) => {
     console.log(token.claims);
   });
   ```
   The user token will contain `admin: true`.
4. Update Firestore rules with custom claims
   ```js
    allow write: if request.auth.token.admin == true;
   ```

### User data

#### Get current user

- Set up an observer (recommended)

  ```js
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in.
    } else {
      // No user is signed in.
    }
  });
  ```

- Use `currentUser` property

  ```js
  var user = firebase.auth().currentUser;
  ```

  If a user isn't signed in, `currentUser` is null.

#### Get user's properties

Once the user is retrieved, the following properties are accessible.

```js
var user = firebase.auth().currentUser;

if (user) {
  var uid = user.uid;
  var displayName = user.displayName;
  var email = user.email;
  var emailVerified = user.emailVerified;
  var photoURL = user.photoURL;
  var isAnonymous = user.isAnonymous;
  var providerData = user.providerData;
}
```

#### Update user's properties

- Profile (name and photoURL)

  ```js
  var user = firebase.auth().currentUser;

  user
    .updateProfile({
      displayName: 'Someone',
      photoURL: 'https://somelink.jpg'
    })
    .then(() => {
      console.log('updated');
    })
    .catch((err) => {
      console.log(err);
    });
  ```

- Email

  ```js
  user
    .updateEmail('other_email@example.com')
    .then(() => {
      // Update successful.
    })
    .catch((err) => {
      // An error happened.
    });
  ```

- Password
  ```js
  user
    .updatePassword(newPassword)
    .then(() => {
      // Update successful.
    })
    .catch((err) => {
      // An error happened.
    });
  ```

## Firebase Functions

To be updated...
