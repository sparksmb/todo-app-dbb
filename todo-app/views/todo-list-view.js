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
			todoListView = Object.create(app.view.mustacheView.create(xhr, viewData));
		
		function parseId(id) {
			var tokens = id.split('-');
			return parseInt(tokens[tokens.length - 1], 10);
		}
		
		/************** BEHAVIORS ******************************/
		
		todoListView.sendCompleteItemEvent = function (e) {
			todoListView.triggerEvent({
				type: 'completeTodoListItem',
				id: parseId(e.target.id),
				isChecked: e.target.checked
			});
		};
		
		function sendAddItemEvent(text) {
			$('#todo-app').trigger({
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
		
		function sendFilterStatusEvent(filterStatus) {
			$('#todo-app').trigger({
				type: 'filterTodoList',
				filterStatus: filterStatus
			});
		}
		
		/***************** UI STUFF ******************************/
		
		function endEditItemMode(element, oldText) {
			var newText = $('#editItemTextbox').val();
			element.innerHTML = newText;
			sendEditItemEvent(oldText, newText);
			$('#addItemTextbox').focus();
		}
		
		function startEditItemMode(element, text) {
			element.innerHTML = '<input type="text" id="editItemTextbox" value="' + text + '" />';
			
			$('#editItemTextbox').blur(function (e) {
				endEditItemMode(element, text);
			});
		}
		
		function detectEnterKeyPress(e, element) {
			if (e.keyCode === 13) {
				if (e.target.id === 'addItemTextbox') {
					sendAddItemEvent(e.target.value);
				} else {
					endEditItemMode(element);
				}
			}
		}
		
		/************** BINDING ******************************/
		
		function bindAddItemAction() {
			$('#addItemTextbox').bind('keydown', function (e) {
				detectEnterKeyPress(e);
			});
		}
		
		function bindEditItemAction() {
			$('.col2 .todo-text').click(function (e) {
				var todoTextElement = e.target,
					text = todoTextElement.textContent;
				
				startEditItemMode(todoTextElement, text);
			});
		}
		
		function bindFilterActions() {
			$('#filter-active').click(function (e) {
				sendFilterStatusEvent(1);
			});
			
			$('#filter-all').click(function (e) {
				sendFilterStatusEvent(2);
			});
			
			$('#filter-completed').click(function (e) {
				sendFilterStatusEvent(3);
			});
		}
		
		/*************** RENDER STUFF ******************/
		
		function init() {
			bindAddItemAction();
			bindEditItemAction();
			bindFilterActions();
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
