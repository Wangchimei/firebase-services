const authWrapper = document.querySelector('.auth');
const authModals = document.querySelectorAll('.auth .modal');
const switchLink = document.querySelectorAll('.switch');

const signupForm = document.querySelector('.register');
const authGoogle = document.querySelectorAll('.google');
const loginForm = document.querySelector('.login');
const signoutLink = document.querySelector('.sign-out');
var google = new firebase.auth.GoogleAuthProvider();

switchLink.forEach((link) => {
  link.addEventListener('click', () => {
    authModals.forEach((modal) => modal.classList.toggle('active'));
  });
});

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user);
    authWrapper.classList.remove('open');
    authModals.forEach((modal) => modal.classList.remove('active'));
  } else {
    console.log(user);
    authWrapper.classList.add('open');
    authModals[0].classList.add('active');
  }
});

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      signupForm.reset();
    })
    .catch((error) => {
      signupForm.querySelector('.error').innerHTML = error.message;
    });
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((cred) => {
      console.log(cred.user);
      loginForm.reset();
    })
    .catch((error) => {
      loginForm.querySelector('.error').innerHTML = error.message;
    });
});

if (authGoogle) {
  authGoogle.forEach((btn) => {
    btn.addEventListener('click', () => {
      auth
        .signInWithPopup(google)
        .then((res) => {})
        .catch((error) => {
          console.log(`Auth Failed: ${error.message}`);
        });
    });
  });
}

signoutLink.addEventListener('click', () => {
  auth.signOut();
});
