Ext.onReady(function () {
  var todos = localStorage.getItem('todos')
    ? JSON.parse(localStorage.getItem('todos'))
    : [];

  var todoStore = Ext.create('Ext.data.Store', {
    fields: ['id', 'description', 'completed'],
    proxy: {
      type: 'localstorage',
      id: 'todos',
    },
    data: todos,
  });

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
        hidden: true,
        allowBlank: true,
      },
      {
        fieldLabel: 'Description',
        name: 'description',
        allowBlank: false,
        xtype: 'textarea',
      },
      {
        xtype: 'checkbox',
        fieldLabel: 'Completed',
        name: 'completed',
      },
    ],
    buttons: [
      {
        text: 'Add',
        itemId: 'addBtn',
        handler: function () {
          var form = this.up('form').getForm();
          if (form.isValid()) {
            var values = form.getValues();
            // console.log(values)
            addTodoItem(values);
            form.reset();
          }
        },
      },
      {
        text: 'Update',
        itemId: 'updateBtn',
        disabled: true,
        handler: function () {
          var form = this.up('form').getForm();
          if (form.isValid()) {
            var values = form.getValues();
            updateTodoItem(values.id, values);
            todoStore.loadRawData(getTodosFromLocalStorage(), false);
            form.reset();
            this.disable();
            formPanel.down('#addBtn').enable();
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
      // { header: 'ID', dataIndex: 'id', flex: 1 },
      { header: 'Description', dataIndex: 'description', flex: 2 },
      {
        header: 'Completed',
        dataIndex: 'completed',
        flex: 1,
        xtype: 'booleancolumn',
        trueText: 'Yes',
        falseText: 'No',
        listeners: {
          headerclick: function () {
            this.up('grid').getStore().sort('completed', 'ASC')
          },
        },
      },
      {
        header: 'Action',
        xtype: 'actioncolumn',
        flex: 1,
        items: [
          {
            icon: './images/edit.png',
            handler: function (grid, rowIndex, colIndex) {
              var rec = grid.getStore().getAt(rowIndex);
              formPanel.getForm().loadRecord(rec);
              Ext.getCmp('tabpanel').setActiveTab(0);
              formPanel.down('#updateBtn').enable();
              formPanel.down('#addBtn').disable();
            },
          },
          {
            icon: './images/trash.png',
            handler: function (grid, rowIndex, colIndex) {
              var rec = grid.getStore().getAt(rowIndex);
              var id = rec.get('id');
              deleteTodoItem(id);
              grid.getStore().remove(rec);
            },
          },
        ],
      },
    ],
    dockedItems: [
      {
        xtype: 'toolbar',
        dock: 'top',
        items: [
          {
            xtype: 'button',
            text: 'Refresh',
            handler: function () {
              gridPanel.getStore().loadData(getTodosFromLocalStorage());
            },
          },
        ],
      },
    ],
  })

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
        listeners: {
          tabchange: function (tabPanel, newCard, oldCard) {
            if (newCard.title === 'Todo List') {
              window.location.reload();
            }
          },
        },
      },
    ],
  })
})
