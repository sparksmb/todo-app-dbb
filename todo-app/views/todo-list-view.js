/*global app, $, document, alert, FileReader */
app.view.todoListView = {
	create: function (xhr, iViewData) {
		'use strict';
		var viewData = iViewData || {
				container_id: 'todo-app',
				template: { url: 'views/todo-list-view.html'},
				data: {
					todoList: null
				}
			},
			todoListView = Object.create(app.view.mustacheDbbView.create(xhr, viewData));
		
		function parseId(id) {
			var tokens = id.split('-');
			return parseInt(tokens[tokens.length - 1], 10);
		}
		
		function sendAddItemEvent(text) {
			todoListView.triggerEvent({
				type: 'addTodoListItem',
				text: text
			});
		}
		
		function sendEditItemEvent(oldText, newText) {
			$('#todo-app').trigger({
				type: 'editTodoListItem',
				oldText: oldText,
				newText: newText
			});
		}
		
		function endEditItemMode(element, oldText) {
			var newText = $('#editItemTextbox').val();
			element.innerHTML = newText;
			sendEditItemEvent(oldText, newText);
			$('#addItemTextbox').focus();
		}
		
		function detectEnterKeyPress(e, element) {
			if (e.keyCode === 13) {
				if (e.target.id === 'addItemTextbox') {
					alert('hey');
					sendAddItemEvent(e.target.value);
				} else {
					endEditItemMode(element);
				}
			}
		}
		
		function startEditItemMode(element, text) {
			element.innerHTML = '<input id="editItemTextbox" type="text" value="' + text + '" />';
			
			$('#editItemTextbox').blur(function (e) {
				endEditItemMode(element, text);
			});
			
			$('#editItemTextbox').keydown(function (e) {
				detectEnterKeyPress(e, element);
			});
		}
		
		function bindEditItemAction() {
			$('.col2 .todo-text').click(function (e) {
				var todoTextElement = e.target,
					text = todoTextElement.textContent;
				
				startEditItemMode(todoTextElement, text);
			});
		}
		
		/************** BEHAVIORS ******************************/
		
		todoListView.sendCompleteItemEvent = function (e) {
			todoListView.triggerEvent({
				type: 'completeTodoListItem',
				id: parseId(e.target.id),
				isChecked: e.target.checked
			});
		};
		
		todoListView.editTodoList = function () {
			alert('not implemented yet :(');
		};
		
		todoListView.sendFilterAllEvent = function (filterStatus) {
			todoListView.triggerEvent({
				type: 'filterTodoList',
				filterStatus: 2
			});
		};
		
		todoListView.sendFilterActiveEvent = function (filterStatus) {
			todoListView.triggerEvent({
				type: 'filterTodoList',
				filterStatus: 1
			});
		};
		
		todoListView.sendFilterCompletedEvent = function (filterStatus) {
			todoListView.triggerEvent({
				type: 'filterTodoList',
				filterStatus: 3
			});
		};
		
		todoListView.detectEnterKeyPress = function (e) {
			detectEnterKeyPress(e);
		};
						
		/*************** RENDER STUFF ******************/
		
		function init() {
			bindEditItemAction();
			$('#addItemTextbox').focus();
		}
		
		todoListView.initEventHandlers = function () {
			init();
		};
		
		todoListView.render = function () {
			Object.getPrototypeOf(todoListView).render(todoListView);
		};
						
		return todoListView;
	}
};
