/*global window, app, document */

/******************************************
Main's responsibility is to instantiate 
dependencies (as seen by the variable list)
and then set the application in motion by
executing the view controller.  No
business rules or algorithms should be 
visibile in main.  They should all be 
encapsulated in their appropriate modules.
Main is envoked in the index.html file
when the script tag is parsed.
******************************************/
app.main.run = function () {
	'use strict';
	var todoListViewController,
		view = app.view,
		usecase = app.usecase,
		entity = app.entity,
		xhr = entity.xhr.create(),
		webStorageCreator = entity.webStorage,
		storage = entity.todoListStorageAdapter.create(webStorageCreator),
		todoListView = view.todoListView.create(xhr),
		controllerBase = view.controllerBase.create(),
		todoList = entity.todoList,
		getTodoList = usecase.getTodoList.create(storage, todoList),
		saveTodoList = usecase.saveTodoList.create(storage),
		todoListItemCreator = entity.todoListItem,
		addTodoListItemCreator = usecase.addTodoListItem,
		completeTodoListItemCreator = usecase.completeTodoListItem,
		editTodoListItemCreator = usecase.editTodoListItem,
		filterTodoListCreator = usecase.filterTodoList;
	
	todoListViewController = view.todoListViewController.create(
		todoListView,
		getTodoList,
		saveTodoList,
		todoListItemCreator,
		addTodoListItemCreator,
		completeTodoListItemCreator,
		editTodoListItemCreator,
		filterTodoListCreator,
		controllerBase
	);
	
	todoListViewController.execute();
};