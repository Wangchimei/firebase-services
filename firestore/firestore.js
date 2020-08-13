
const todoList = document.querySelector('#todo-list');
const form = document.querySelector('#addTodoForm');

const renderTodo = (doc) => {
  let li = document.createElement('li')
  li.classList.add('collection-item')
  li.setAttribute('data-id', doc.id)

  let todo = document.createElement('span')
  todo.classList.add('title')
  todo.textContent = doc.data().todo

  let type = document.createElement('p')
  type.textContent = doc.data().type

  let cross = document.createElement('p')
  cross.classList.add('cross')

  li.appendChild(todo)
  li.appendChild(type)
  li.appendChild(cross)
  todoList.appendChild(li)

  // DELETE DOCUMENT
  cross.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.dataset.id
    db.collection('todos').doc(id).delete()
  })
}

// GET DATA ONCE
// db.collection('todos').get().then(snapshot => {
// snapshot.docs.forEach(doc => {
//   console.log(doc.data());
// });
//   snapshot.forEach(doc => {
//     renderTodo(doc);
//   });
// });

// REALTIME LISTENER
db.collection('todos').orderBy('todo').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  console.log(changes)
  changes.forEach(change => {
    console.log(change.doc.data());
    if (change.type === "added") {
      renderTodo(change.doc);
    }
    if (change.type === "modified") {
      console.log(change.doc.data());
    }
    if (change.type === "removed") {
      let li = todoList.querySelector('[data-id=' + change.doc.id + ']');
      todoList.removeChild(li);
    }
  });
})

form.addEventListener('submit', (e) => {
  e.preventDefault();
  // ADD DOCUMENT
  db.collection('todos').add({
    todo: form.todo.value,
    type: form.type.value
  });
  form.reset();
})