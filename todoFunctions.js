function generateUniqueId() {
  var timestamp = new Date().getTime();
  var randomNumber = Math.floor(Math.random() * 1000000);
  return timestamp + '-' + randomNumber;
}
function addTodoItem(todoItem, callback) {
  todoItem.id = generateUniqueId();
  todoItem.completed = false;
  var todos = getTodoItems();
  // console.warn(todos, todoItem);
  todos.push(todoItem);
  localStorage.setItem('todos', JSON.stringify(todos));
  if (callback) {
    callback();
  }
}
function updateTodoItem(id, updatedTodoItem) {
  // console.log(id)
  var todos = getTodoItems();
  var todoItemIndex = todos.findIndex(function (todo) {
    return todo.id == id;
  });
  if (todoItemIndex !== -1) {
    todos[todoItemIndex] = updatedTodoItem;
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}
function deleteTodoItem(id) {
  var todos = getTodoItems();
  var todoItemIndex = todos.findIndex(function (todo) {
    return todo.id == id;
  });
  if (todoItemIndex !== -1) {
    todos.splice(todoItemIndex, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}
// function completeTodoItem(id, callback) {
//   var todos = getTodoItems();
//   var todoItemIndex = todos.findIndex(function (todo) {
//     return todo.id == id;
//   });
//   if (todoItemIndex !== -1) {
//     todos[todoItemIndex].completed = true;
//     localStorage.setItem('todos', JSON.stringify(todos));
//   }
//    if (callback) {
//      callback();
//    }
// }
function handleCompleteChange(id, callback) {
  var todos = getTodoItems();
  var todoItemIndex = todos.findIndex(function (todo) {
    return todo.id == id;
  });
  console.log(todoItemIndex);
  console.log(todos[todoItemIndex]);
  if (todoItemIndex !== -1) {
    if (todos[todoItemIndex].completed) {
      todos[todoItemIndex].completed = false;
    } else {
      todos[todoItemIndex].completed = true;
    }
    localStorage.setItem('todos', JSON.stringify(todos));
  }
  if (callback) {
    callback();
  }
}
function getTodoItems() {
  return localStorage.getItem('todos')
    ? JSON.parse(localStorage.getItem('todos'))
    : [];
}
