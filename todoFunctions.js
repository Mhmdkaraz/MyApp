function generateUniqueId() {
  var timestamp = new Date().getTime();
  var randomNumber = Math.floor(Math.random() * 1000000);
  return timestamp + '-' + randomNumber;
}
function addTodoItem(todoItem) {
  todoItem.id = generateUniqueId();
  var todos = localStorage.getItem('todos')
    ? JSON.parse(localStorage.getItem('todos'))
    : [];
  console.warn(todos, todoItem);
  todos.push(todoItem);
  localStorage.setItem('todos', JSON.stringify(todos));
}
function updateTodoItem(id, updatedTodoItem) {
  console.log(id);
  var todos = localStorage.getItem('todos')
    ? JSON.parse(localStorage.getItem('todos'))
    : [];
  var todoItemIndex = todos.findIndex(function (todo) {
    return todo.id == id;
  });
  if (todoItemIndex !== -1) {
    todos[todoItemIndex] = updatedTodoItem;
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}
function deleteTodoItem(id) {
  var todos = localStorage.getItem('todos')
    ? JSON.parse(localStorage.getItem('todos'))
    : [];
  var todoItemIndex = todos.findIndex(function (todo) {
    return todo.id == id;
  });
  if (todoItemIndex !== -1) {
    todos.splice(todoItemIndex, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}

function getTodosFromLocalStorage() {
  return JSON.parse(localStorage.getItem('todos')) || [];
}
