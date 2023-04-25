Ext.onReady(function () {
  var todos = getTodoItems();
  var todoStore = Ext.create('Ext.data.Store', {
    fields: ['id', 'title', 'description', 'completed'],
    proxy: {
      type: 'localstorage',
      id: 'todos',
    },
    data: todos,
  });

  var formPanel = Ext.create('Ext.form.Panel', {
    itemId: 'formPanel',
    width: 400,
    bodyPadding: 10,
    cls: 'my-form-panel',
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
        fieldLabel: 'Title',
        name: 'title',
        allowBlank: false,
        xtype: 'textfield',
      },
      {
        fieldLabel: 'Description',
        name: 'description',
        allowBlank: false,
        xtype: 'textarea',
      },
    ],
    buttons: [
      {
        text: 'Save',
        itemId: 'addBtn',
        handler: function () {
          var form = this.up('form').getForm();
          if (form.isValid()) {
            var values = form.getValues();
            values.id = Ext.id();
            var callback = () => {
              gridPanel.getStore().loadData(getTodoItems())
            };
            addTodoItem(values, callback);
            form.reset();
            todoModal.hide();
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
            todoStore.loadRawData(getTodoItems(), false);
            form.reset();
            this.disable();
            formPanel.down('#addBtn').enable();
            todoModal.hide();
          }
        },
      },
    ],
  });

  var todoModal = Ext.create('Ext.window.Window', {
    modal: true,
    closable: true,
    closeAction: 'hide',
    width: 420,
    layout: 'fit',
    items: [formPanel],
  });

  var gridPanel = Ext.create('Ext.grid.Panel', {
    title: 'Todo List',
    width: 600,
    height: 300,
    margin: '10',
    cls: 'my-grid-panel',
    store: todoStore,
    columns: [
      {
        header: 'Title',
        dataIndex: 'title',
        flex: 1,
        renderer: function (value, metaData, record) {
          if (record.get('completed')) {
            return (
              '<span style="text-decoration: line-through; -webkit-text-stroke-color: black;">' +
              value +
              '</span>'
            );
          } else {
            return value;
          }
        },
        listeners: {
          click: function (grid, item, index, e) {
            // show the record data in a modal
            todoModal.setTitle('Todo Details');
            todoModal.show();
            var record = todoStore.getAt(index);
            formPanel.getForm().loadRecord(record);
            formPanel.down('#addBtn').hide();
            formPanel.down('#updateBtn').hide();
          },
        },
      },
      {
        header: 'Description',
        dataIndex: 'description',
        flex: 2,
        renderer: function (value, metaData, record) {
          if (record.get('completed')) {
            return (
              '<span style="text-decoration: line-through; -webkit-text-stroke-color: black;">' +
              value +
              '</span>'
            );
          } else {
            return value;
          }
        },
        listeners: {
          click: function (grid, item, index, e) {
            // show the record data in a modal
            todoModal.setTitle('Todo Details');
            todoModal.show();
            var record = todoStore.getAt(index);
            formPanel.getForm().loadRecord(record);
            formPanel.down('#addBtn').hide();
            formPanel.down('#updateBtn').hide();
          },
        },
      },
      {
        xtype: 'checkcolumn',
        header: 'Completed',
        dataIndex: 'completed',
        listeners: {
          checkchange: function (grid, rowIndex, colIndex) {
            var record = todoStore.getAt(rowIndex);
            var todoId = record.get('id');
            console.log(todoId);
            var todo = record.data;
            var callback = () => {
              gridPanel.getStore().loadData(getTodoItems())
            };
            handleCompleteChange(todoId, callback);
          },
        },
      },
      {
        xtype: 'actioncolumn',
        header: 'Actions',
        flex: 1,
        items: [
          {
            xtype: 'actioncolumn',
            icon: './images/edit.png',
            handler: function (grid, rowIndex, colIndex) {
              formPanel.down('#updateBtn').show();
              formPanel.down('#addBtn').hide();
              var rec = grid.getStore().getAt(rowIndex);
              formPanel.getForm().loadRecord(rec);
              todoModal.setTitle('Edit Todo');
              todoModal.show();
              formPanel.down('#updateBtn').enable();
              formPanel.down('#addBtn').disable();
            },
          },
          {
            xtype: 'actioncolumn',
            icon: './images/trash.png',
            handler: function (grid, rowIndex, colIndex) {
              Ext.Msg.confirm(
                'Delete',
                'Are you sure you want to delete this todo?',
                function (btn) {
                  if (btn == 'yes') {
                    var rec = grid.getStore().getAt(rowIndex);
                    deleteTodoItem(rec.get('id'));
                    grid.getStore().remove(rec);
                  }
                }
              );
            },
          },
        ],
      },
    ],
  });

  var container = Ext.create('Ext.container.Container', {
    layout: {
      type: 'vbox',
      align: 'stretch',
    },
    items: [
      {
        xtype: 'container',
        layout: {
          type: 'hbox',
          align: 'center',
        },
        items: [
          {
            xtype: 'component',
            flex: 1,
          },
          {
            xtype: 'button',
            text: 'Add Todo',
            style: 'background-size:contain;',
            margin: '10 10 0 10',
            padding: '10 10 10 10',
            icon: './images/plus.png',
            handler: function () {
              formPanel.down('#updateBtn').hide();
              formPanel.down('#addBtn').show();
              todoModal.setTitle('Add Todo');
              todoModal.show();
              formPanel.down('#addBtn').enable();
              formPanel.down('#updateBtn').disable();
            },
          },
        ],
      },
      gridPanel,
    ],
  });

  var viewport = Ext.create('Ext.container.Viewport', {
    layout: 'fit',
    items: [container],
  });
});
