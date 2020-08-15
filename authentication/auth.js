const signupForm = document.querySelector('#signup-form');
const loginForm = document.querySelector('#login-form');
const createForm = document.querySelector('#create-form');
const adminForm = document.querySelector('#add-admin-form');
const signout = document.querySelector('#logout');
const dbNote = db.collection('notes');
const dbUser = db.collection('users');

let currentUser;

// ADD ADMIN FUNCTION
adminForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const adminEmail = adminForm.email.value;
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({ email: adminEmail }).then((res) => {
    M.toast({ html: res.message });
  });
});

// LISTEN TO AUTH STATUS CHANGES
auth.onAuthStateChanged((user) => {
  // console.log(user)
  if (user) {
    // check admin
    user.getIdTokenResult().then((token) => {
      // console.log(token.claims)
      user.admin = token.claims.admin;
      currentUser = user;
      updateUI(user);
    });
    // LISTEN TO DATABASE CHANGES (realtime)
    dbNote.where('author', '==', user.uid).onSnapshot(
      (snapshot) => outputNotes(user, snapshot.docs),
      (err) => console.log(err)
    );
    // load notes (not realtime)
    // dbNote.where("author", "==", user.uid)
    //   .get()
    //   .then((snapshot) => outputNotes(snapshot.docs))
  } else {
    updateUI(user);
    outputNotes(user, []); // passing an empty array
  }
});

// SIGN UP
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // const email = signupForm["signup-email"].value;
  const name = signupForm.name.value;
  const email = signupForm.email.value;
  const password = signupForm.password.value;
  const bio = signupForm.bio.value;

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      // console.log(cred);
      // using "add" will have a random id, so not okay for this
      return dbUser.doc(cred.user.uid).set({ name, bio });
    })
    .then(() => {
      const modal = document.querySelector('#modal-signup');
      M.Modal.getInstance(modal).close();
      signupForm.reset();
      signupForm.querySelector('.error').innerHTML = '';
    })
    .catch((err) => {
      signupForm.querySelector('.error').innerHTML = err.message;
    });
});

// LOG OUT
signout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    M.toast({ html: 'Successfully logout!' });
  });
});

// LOGIN
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((cred) => {
      const modal = document.querySelector('#modal-login');
      M.Modal.getInstance(modal).close();
      loginForm.reset();
      loginForm.querySelector('.error').innerHTML = '';
    })
    .catch((err) => {
      loginForm.querySelector('.error').innerHTML = err.message;
    });
});

// Create
createForm.addEventListener('submit', (e) => {
  e.preventDefault();
  dbNote
    .add({
      author: currentUser.uid,
      title: createForm.title.value,
      body: createForm.body.value
    })
    .then((res) => {
      console.log(res);
      const modal = document.querySelector('#modal-create');
      M.Modal.getInstance(modal).close();
      createForm.reset();
    })
    .catch((err) => {
      M.toast({ html: err.message });
    });
});
