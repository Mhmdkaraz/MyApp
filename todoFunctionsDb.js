function saveTodoForm(form, todoStore, todoModal) {
  if (form.isValid()) {
    Ext.Ajax.request({
      url: '/MyApp/api/save_todo.php',
      method: 'POST',
      params: form.getValues(),
      success: function (response) {
        var result = Ext.decode(response.responseText);
        if (result.success) {
          todoStore.reload();
          form.reset();
          todoModal.hide();
        } else {
          Ext.Msg.alert('Error', 'Failed to save todo');
        }
      },
      failure: function (response) {
        Ext.Msg.alert('Error', 'Failed to save todo');
      },
    });
  }
}

function updateTodoForm(form, todoStore, formPanel, todoModal) {
  if (form.isValid()) {
    Ext.Ajax.request({
      url: '/MyApp/api/save_todo.php',
      method: 'POST',
      params: form.getValues(),
      success: function (response) {
        var result = Ext.decode(response.responseText);
        if (result.success) {
          todoStore.reload();
          form.reset();
          formPanel.down('#addBtn').enable();
          formPanel.down('#updateBtn').disable();
          todoModal.hide();
        } else {
          Ext.Msg.alert('Error', 'Failed to update todo');
        }
      },
      failure: function (response) {
        Ext.Msg.alert('Error', 'Failed to update todo');
      },
    });
  }
}

function onCheckChange(todoid,completed,record) {
  Ext.Ajax.request({
    url: '/MyApp/api/update_todo_completed.php',
    method: 'POST',
    params: { todoid: todoid, completed: completed },
    success: function (response) {
      record.set('COMPLETED', completed);
    },
    failure: function (response) {
      Ext.Msg.alert('Error', 'Failed to update todo.');
    },
  });
}

function deleteTodo(todoid,grid){
  Ext.Ajax.request({
    url: '/MyApp/api/delete_todo.php',
    method: 'POST',
    params: { todoid: todoid },
    success: function (response) {
      var result = Ext.decode(response.responseText);
      if (result.success) {
        //reload the grid to reflect the changes
        grid.getStore().reload();
      } else {
        Ext.Msg.alert('Error', result.message);
      }
    },
    failure: function (response) {
      Ext.Msg.alert('Error', 'Failed to delete todo.');
    },
  });
}