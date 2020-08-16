const requestModal = document.querySelector('.new-request');
const requestLink = document.querySelector('.add-request');

requestLink.addEventListener('click', () => {
  requestModal.classList.add('open');
});

requestModal.addEventListener('click', (e) => {
  if (e.target.classList.contains('new-request')) {
    requestModal.classList.remove('open');
  }
});

// const btn = document.querySelector('.test-btn');
// if (btn) {
//   btn.addEventListener('click', () => {
//     const greetings = firebase.functions().httpsCallable('greetings');
//     greetings({ name: 'Kimmy' }).then((result) => {
//       console.log(result.data);
//     });
//   });
// }
