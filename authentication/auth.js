const signupForm = document.querySelector("#signup-form");
const loginForm = document.querySelector("#login-form");
const signout = document.querySelector("#logout");

const dbRef = db.collection("notes")

// LISTEN TO AUTH STATUS CHANGES
auth.onAuthStateChanged(user => {
  // console.log(user)

  if (user) {
    // set navbar
    setLinks(user);
    // load notes
    dbRef.where("author", "==", user.uid)
      .get()
      .then((snapshot) => outputNotes(snapshot.docs))
  } else {
    // set navbar
    setLinks(user);
    outputNotes([]) // passing an empty array
  }
})

// SIGN UP
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // const email = signupForm["signup-email"].value;
  const email = signupForm.email.value;
  const password = signupForm.password.value;

  // Sign up in Firebase
  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      // console.log(cred);
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    }).catch(err => {
      M.toast({ html: err.message })
    })
})

// LOG OUT
signout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    M.toast({ html: "Successfully logout!" })
  })
})

// LOGIN
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  auth.signInWithEmailAndPassword(email, password)
    .then((cred) => {
      const modal = document.querySelector("#modal-login");
      M.Modal.getInstance(modal).close();
      loginForm.reset();
    }).catch(err => {
      M.toast({ html: err.message })
    })
})
