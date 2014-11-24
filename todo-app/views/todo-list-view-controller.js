/*global app */
app.view.todoListViewController = {
	create: function (view,
					   getTodoList,
					   saveTodoList,
					   todoListItemCreator,
					   addTodoListItemCreator,
					   completeTodoListItemCreator,
					   editTodoListItemCreator,
					   filterTodoListCreator) {
		'use strict';
		var todoListViewController = Object.create(app.view.controllerBase.create()),
			todoList,
			addTodoListItem,
			completeTodoListItem,
			editTodoListItem,
			filterTodoList,
			filterStatus;
		
		function bindModelData(todoList) {
			var filteredList = filterTodoList.execute(filterStatus);
			filteredList.itemsLeft = todoList.itemsLeft;
			view.getViewModel().data.todoList = filteredList;
		}
		
		function render() {
			bindModelData(todoList);
			view.render();
			view.initEventHandlers();
		}
		
		function addTodoListItemEventHandler(e) {
			var item = todoListItemCreator.create({ text: e.text });
			addTodoListItem.execute(item);
			saveTodoList.execute(todoList);
			render();
		}
		
		function editTodoListItemEventHandler(e) {
			editTodoListItem.execute(e.oldText, e.newText);
			saveTodoList.execute(todoList);
			render();
		}
		
		function completeTodoListItemEventHandler(e) {
			completeTodoListItem.execute(e.id, e.isChecked);
			saveTodoList.execute(todoList);
			render();
		}
		
		function filterTodoListEventHandler(e) {
			filterStatus = e.filterStatus;
			render();
		}
		
		function initEventHandlers() {
			todoListViewController.initEventHandlers([
				{ eventName: 'addTodoListItem', eventHandler: addTodoListItemEventHandler },
				{ eventName: 'editTodoListItem', eventHandler: editTodoListItemEventHandler },
				{ eventName: 'completeTodoListItem', eventHandler: completeTodoListItemEventHandler },
				{ eventName: 'filterTodoList', eventHandler: filterTodoListEventHandler }
			]);
		}
		
		function initDependencies(todoList) {
			addTodoListItem = addTodoListItemCreator.create(todoList);
			completeTodoListItem = completeTodoListItemCreator.create(todoList);
			editTodoListItem = editTodoListItemCreator.create(todoList);
			filterTodoList = filterTodoListCreator.create(todoList);
		}
		
		todoListViewController.execute = function () {
			todoList = getTodoList.execute();
			filterStatus = filterStatus || todoList.ALL;
			initDependencies(todoList);
			initEventHandlers();
			render();
		};
		
		return todoListViewController;
	}
};