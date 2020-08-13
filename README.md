# Exploring Firebase Services

## Firebase Firestore
### Read data
#### Read data once
  ```js
  db.collection('collectionName').get().then(snapshot => {
    snapshot.forEach(doc => {
      console.log(`${doc.id}: ${doc.data()}`);
    });
  ```
#### Realtime update
  ```js
  db.collection('users').onSnapshot(snapshot => {
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
  })
  ```

### Query data
- Filter using `where`, with 3 params (`value of field`, `comparison operation`, `what value we want)`)
  The comparison can be `<`, `<=`, `==`, `>`, `>=`, `array-contains`, `in`, or `array-contains-any`
  ```js
  db.collection('users').where("privacy", "==", true)
  ```
  ```js
  db.collection('users')
    .where("pet", "==", "dogs")
    .where("privacy", "==", true);
  ```
  If queries are chained with range filters, filter only on one field is recommended.
  ```js
  db.collection('users')
    .where("age", "<=", 18)
    .where("age", ">=", 65)
  ```
- Order using `orderBy`
- Limit using `limit`
  ```js
    db.collection('users').orderBy("name", "desc").limit(5)
  ```

### Add data
```js
db.collection("users").add({
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
db.collection('users').doc(id).update({
  age: 30,
})
```
Only age will be updated.

#### Overwrite the whole document
```js
db.collection('users').doc(id).set({
  age: 30,
})
```
After updating, `name` and `privacy` will be empty

### Delete data
```js
db.collection('users').doc(id).delete()
```
## Firebase Authentication
To be updated...

## Firebase Functions
To be updated...

