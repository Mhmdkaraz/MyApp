Ext.onReady(function () {
  Ext.define('Todo', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'id', type: 'int' },
      { name: 'description', type: 'string' },
      { name: 'completed', type: 'boolean' },
    ],
    proxy: {
      type: 'localstorage',
      id: 'todo-app',
    },
  })
  var todoStore = Ext.create('Ext.data.Store', {
    model: 'Todo',
    data: [
      {
        id: 1,
        description: 'Buy groceries',
        completed: false,
      },
      {
        id: 2,
        description: 'Do laundry',
        completed: false,
      },
      {
        id: 3,
        description: 'Clean the house',
        completed: true,
      },
    ],
  })

  // Load data from local storage
  todoStore.load()

  var formPanel = Ext.create('Ext.form.Panel', {
    title: 'Add Todo',
    itemId: 'formPanel',
    width: 300,
    bodyPadding: 10,
    defaultType: 'textfield',
    items: [
      {
        fieldLabel: 'ID',
        name: 'id',
        id: 'id',
        xtype: 'hiddenfield',
        disabled: true,
      },
      {
        fieldLabel: 'Description',
        name: 'description',
        id: 'description',
        allowBlank: false,
        xtype: 'textarea',
      },
      {
        xtype: 'checkbox',
        id: 'completed',
        fieldLabel: 'Completed',
        name: 'completed',
      },
    ],
    buttons: [
      {
        text: 'Add',
        itemId: 'addBtn',
        handler: function () {
          var form = this.up('form').getForm()
          if (form.isValid()) {
            var values = form.getValues()
            console.log(values)
            values.id = todoStore.getCount() + 1 // Generate new ID for the todo
            var newTodo = Ext.create('Todo', {
              description: values.description,
              completed: values.completed === 'on' ? true : false,
            })
            form.reset()
            newTodo.save()
          }
        },
      },
      {
        text: 'Update',
        itemId: 'updateBtn',
        disabled: true,
        handler: function () {
          var form = this.up('form').getForm()
          if (form.isValid()) {
            var record = form.getRecord()
            var values = form.getValues()
            values.id = record.id // Set the ID in the form values
            record.set(values)
            form.reset()
            this.disable()
            formPanel.down('#addBtn').enable()
          }
        },
      },
    ],
  })

  var gridPanel = Ext.create('Ext.grid.Panel', {
    title: 'Todo List',
    width: 600,
    height: 300,
    store: todoStore,
    columns: [
      { header: 'ID', dataIndex: 'id', flex: 1 },
      { header: 'Description', dataIndex: 'description', flex: 2 },
      {
        header: 'Completed',
        dataIndex: 'completed',
        flex: 1,
        renderer: function (value) {
          return value ? 'Yes' : 'No'
        },
      },
      {
        xtype: 'actioncolumn',
        header: 'Actions',
        items: [
          {
            iconCls: 'x-icon-delete',
            tooltip: 'Delete',
            handler: function (grid, rowIndex, colIndex) {
              var store = grid.getStore()
              var rec = store.getAt(rowIndex).data

              store.remove(store.getAt(rowIndex))
              var todoId = rec.id

              var todos = localStorage.getItem('todo-app')
              var todosArr = todos.split(',')
              todosArr = todosArr.filter((id) => id !== String(todoId))
              todos = todosArr.join(',')
              localStorage.setItem('todo-app', todos)
              localStorage.removeItem('todo-app-' + todoId)
            },
          },
          {
            iconCls: 'x-icon-edit',
            tooltip: 'Edit',
            handler: function (grid, rowIndex, colIndex) {
              var rec = grid.getStore().getAt(rowIndex).data
              var todoId = rec.id
              console.log(todoId)
              const { id, description, completed } = rec
              Ext.getCmp('id').setValue(id)
              Ext.getCmp('description').setValue(description)
              Ext.getCmp('completed').setValue(completed)
              Ext.getCmp('tabpanel').setActiveTab(0)
              formPanel.down('#updateBtn').enable()
              formPanel.down('#addBtn').disable()
              formPanel.down('#updateBtn').on('click', function () {
                update(id)
              })
            },
          },
        ],
      },
    ],
    listeners: {
      itemclick: function (grid, record) {
        Ext.Msg.alert('Todo', record.get('description'))
      },
    },
  })
  function update(id) {
    var todoData = localStorage.getItem('todo-app-' + id)
    const rec = {
      id: Ext.getCmp('id').getValue(),
      description: Ext.getCmp('description').getValue(),
      completed: Ext.getCmp('completed').getValue(),
    }
    localStorage.setItem('todo-app-' + id, JSON.stringify(rec))
  }
  var tabPanel = Ext.create('Ext.tab.Panel', {
    renderTo: Ext.getBody(),
    id: 'tabpanel',
    activeTab: 0,
    items: [
      {
        title: 'Add Todo',
        items: [formPanel],
      },
      {
        title: 'Todo List',
        items: [gridPanel],
      },
    ],
  })
})
