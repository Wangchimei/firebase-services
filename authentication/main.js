// UI for notes
const noteList = document.querySelector('.notes');
const loggedInLinks = document.querySelectorAll('.logged-in');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const adminOnlyLinks = document.querySelectorAll('.admin');
const accountDetails = document.querySelector('.account-details');

// UI: Load and output notes
const outputNotes = (user, data) => {
  if (user && !!data.length) {
    let html = '';
    data.forEach((doc) => {
      const note = doc.data();
      const li = `
      <li data-id="${doc.id}">
        <div class="collapsible-header indigo-text text-lighten-1">${note.title}</div>
        <div class="collapsible-body white"><span>${note.body}</span></div>
      </li>
    `;
      html += li;
    });

    const ul = document.createElement('ul');
    ul.classList.add('collapsible');
    M.Collapsible.init(ul);

    noteList.innerHTML = ''; // clear
    noteList.appendChild(ul).innerHTML = html;
  } else if (user) {
    noteList.innerHTML = `
    <div class="card-panel">
      <h6 class="center">No notes written by you.</h6>
    </div>
    `;
  } else {
    noteList.innerHTML = `
    <div class="card-panel">
      <h6 class="center">Log in to see your progress notes.</h6>
    </div>
    `;
  }
};

// UI: Nav Links
const updateUI = (user) => {
  if (user) {
    if (user.admin) {
      adminOnlyLinks.forEach((item) => item.classList.remove('hide'));
    }
    // Nav links
    loggedInLinks.forEach((item) => item.classList.remove('hide'));
    loggedOutLinks.forEach((item) => item.classList.add('hide'));
    // Account Info
    setAccountInfo(user);
  } else {
    // Nav links
    adminOnlyLinks.forEach((item) => item.classList.add('hide'));
    loggedInLinks.forEach((item) => item.classList.add('hide'));
    loggedOutLinks.forEach((item) => item.classList.remove('hide'));
    // Account Info
    accountDetails.innerHTML = '';
  }
};

// UI: Set user info
const setAccountInfo = (user) => {
  db.collection('users')
    .doc(user.uid)
    .get()
    .then((snapshot) => {
      let html = `
      <h6 class="center">
        Logged in as ${snapshot.data().name} (${user.admin ? 'Admin' : ''})
      </h6>
      <h6 class="center">${user.email}</h6>
      <h6 class="center">${snapshot.data().bio}</h6>
      <h6 class="center">Joined from ${user.metadata.creationTime}</h6>
    `;
      accountDetails.innerHTML = html;
    })
    .catch(
      (err) =>
        (accountDetails.innerHTML = `
        <h5 class="center"> ERROR! <h5>
      `)
    );
};

document.addEventListener('DOMContentLoaded', function () {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
});
