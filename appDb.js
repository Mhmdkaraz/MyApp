Ext.onReady(function () {
  var todoStore = Ext.create('Ext.data.Store', {
    fields: ['TODOID', 'TITLE', 'DESCRIPTION', 'COMPLETED'],
    proxy: {
      type: 'ajax',
      url: '/MyApp/api/get_todo.php',
      reader: {
        type: 'json',
        rootProperty: 'results',
      },
    },
    autoLoad: true,
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
          const form = this.up('form').getForm();
          saveTodoForm(form, todoStore, todoModal);
        },
      },
      {
        text: 'Update',
        itemId: 'updateBtn',
        disabled: true,
        handler: function () {
          const form = this.up('form').getForm();
          updateTodoForm(form, todoStore, formPanel, todoModal);
        },
      },
    ],
    listeners: {
      render: function (formPanel) {
        var updateBtn = formPanel.down('#updateBtn');
        formPanel.getForm().on('load', function (form, record) {
          if (record && record.data.id) {
            updateBtn.enable();
            formPanel.down('#addBtn').disable();
          }
        });
      },
    },
  });

  var todoModal = Ext.create('Ext.window.Window', {
    modal: true,
    closable: true,
    closeAction: 'hide',
    width: 420,
    height: 250,
    layout: 'fit',
    items: [formPanel],
  });

  var mod = Ext.create('Ext.window.Window', {
    modal: true,
    closable: true,
    closeAction: 'hide',
    width: 420,
    height: 200,
    layout: 'fit',
    items: [
      {
        xtype: 'form',
        items: [
          {
            xtype: 'displayfield',
            fieldLabel: 'Title',
            name: 'title',
          },
          {
            xtype: 'displayfield',
            fieldLabel: 'Description',
            name: 'description',
          },
        ],
      },
    ],
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
        dataIndex: 'TITLE',
        flex: 1,
        renderer: function (value, metaData, record) {
          if (record.get('COMPLETED') == true) {
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
            //get the form from the modal window
            var form = mod.down('form');

            //get the clicked record
            var record = grid.getStore().getAt(index);
            mod.setTitle('Todo ' + record.get('TODOID') + ' Details');
            //populate the form fields with the record data
            form.getForm().setValues({
              title: record.get('TITLE'),
              description: record.get('DESCRIPTION'),
            });

            //show the modal window
            mod.show();
          },
        },
      },
      {
        header: 'Description',
        dataIndex: 'DESCRIPTION',
        flex: 2,
        listeners: {
          click: function (grid, item, index, e) {
            mod.setTitle('Todo Details');
            //get the form from the modal window
            var form = mod.down('form');

            //get the clicked record
            var record = grid.getStore().getAt(index);
            mod.setTitle('Todo ' + record.get('TODOID') + ' Details');
            //populate the form fields with the record data
            form.getForm().setValues({
              title: record.get('TITLE'),
              description: record.get('DESCRIPTION'),
            });

            //show the modal window
            mod.show();
          },
        },
        renderer: function (value, metaData, record) {
          if (record.get('COMPLETED') == true) {
            return (
              '<span style="text-decoration: line-through; -webkit-text-stroke-color: black;">' +
              value +
              '</span>'
            );
          } else {
            return value;
          }
        },
      },
      {
        xtype: 'checkcolumn',
        header: 'Completed',
        dataIndex: 'COMPLETED',
        listeners: {
          checkchange: function (checkColumn, rowIndex, checked, record, e) {
            var record = gridPanel.getStore().getAt(rowIndex);
            var todoid = record.get('TODOID');
            var completed = checked ? 1 : 0;
            onCheckChange(todoid, completed, record);
          },
        },
        renderer: function (value, metaData, record) {
          if (record.get('COMPLETED') == true) {
            return '<div class="x-grid-checkcolumn x-grid-checkcolumn-checked"></div>';
          } else {
            return '<div class="x-grid-checkcolumn"></div>';
          }
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
              var form = todoModal.down('form');
              var record = grid.getStore().getAt(rowIndex);
              todoModal.setTitle('Add Todo');
              form.getForm().setValues({
                id: record.get('TODOID'),
                title: record.get('TITLE'),
                description: record.get('DESCRIPTION'),
              });
              formPanel.down('#updateBtn').enable();
              formPanel.down('#addBtn').disable();
              todoModal.show();
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
                    //delete item
                    var record = grid.getStore().getAt(rowIndex);
                    var todoid = record.get('TODOID');
                    deleteTodo(todoid, grid);
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
