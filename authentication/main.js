// UI for notes
const noteList = document.querySelector('.notes');
const outputNotes = (data) => {
  if (data.length) {
    let html = '';
    data.forEach(doc => {
      const note = doc.data();
      const li = `
      <li data-id="${doc.id}">
        <div class="collapsible-header indigo-text text-lighten-1">${note.title}</div>
        <div class="collapsible-body white"><span>${note.body}</span></div>
      </li>
    `
      html += li
    })

    const ul = document.createElement('ul');
    ul.classList.add('collapsible');
    M.Collapsible.init(ul);

    noteList.innerHTML = ''; // clear
    noteList.appendChild(ul).innerHTML = html;
  } else {
    noteList.innerHTML = `
    <div class="card-panel">
      <h6 class="center">Log in to see your progress notes.</h6>
    </div>
    `
  }
}

// UI: Nav Links
const loggedInLinks = document.querySelectorAll(".logged-in");
const loggedOutLinks = document.querySelectorAll(".logged-out");

const setLinks = (user) => {
  if (user) {
    loggedInLinks.forEach(item => item.classList.remove('hide'));
    loggedOutLinks.forEach(item => item.classList.add('hide'));
  } else {
    loggedInLinks.forEach(item => item.classList.add('hide'));
    loggedOutLinks.forEach(item => item.classList.remove('hide'));
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
});