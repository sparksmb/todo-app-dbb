/*global app, document, window, Mustache, $ */
app.view.mustacheDbbView = {
	create: function (xhr, viewModel) {
		'use strict';
		var mustacheView,
			viewRef;
		
		function getTemplate(template) {
			var html;
			if (template.url) {
				html = xhr.get(template.url);
			} else if (template.html) {
				html = template.html;
			} else {
				throw 'Invalid template type, expected string or object. template: ' + JSON.stringify(template);
			}
			return html;
		}
		
		function renderInContainer(containerId, htmlTemplate, data) {
			var html = Mustache.to_html(htmlTemplate, data);
			document.getElementById(containerId).innerHTML = html;
		}
		
		function renderView(view) {
			if (view) {
				renderInContainer(view.container_id,
					getTemplate(view.template),
					view.data);
			} else {
				throw 'Cannot render view before setting mustacheView.viewModel property!';
			}
		}
		
		function augmentViewData(data) {
			var prop;
			
			if (typeof data === 'object') {
				for (prop in data) {
					if (data.hasOwnProperty(prop)) {
						mustacheView.viewModel.data[prop] = data[prop];
					}
				}
			}
		}
		
		function getAllElementsToBind() {
			return $('*[data-bind]');
		}
		
		function parseEvent(dataBinding) {
			return dataBinding.substring(0, dataBinding.indexOf(':'));
		}
		
		function parseHandler(dataBinding) {
			return dataBinding.substring(dataBinding.indexOf(': ') + 2, dataBinding.indexOf('('));
		}
		
		function parseSelector(dataBinding) {
			return dataBinding.substring(dataBinding.indexOf('(') + 1, dataBinding.indexOf(')'));
		}
		
		function parseDataBinding(dataBinding) {
			var meta = {
				event: parseEvent(dataBinding),
				handler: parseHandler(dataBinding),
				selector: parseSelector(dataBinding)
			};
			return meta;
		}
		
		function parseElement(element) {
			var dataBinding = element.attributes['data-bind'].value,
				meta = parseDataBinding(dataBinding);
			return meta;
		}
		
		function bind(element) {
			var meta = parseElement(element);
			$(meta.selector).on(meta.event, viewRef[meta.handler]);
		}
		
		function bindBehaviors() {
			var i, elements = getAllElementsToBind();
			for (i = 0; i < elements.length; i += 1) {
				bind(elements[i]);
			}
		}
				
		mustacheView = {
			viewModel: viewModel,
			render: function (view, data) {
				viewRef = view;
				augmentViewData(data);
				renderView(mustacheView.viewModel);
				bindBehaviors();
			},
			getHtml: function (data) {
				var html;
				augmentViewData(data);
				html = Mustache.to_html(getTemplate(mustacheView.viewModel.template), mustacheView.viewModel.data);
				return html;
			},
			getViewModel: function () {
				return mustacheView.viewModel;
			},
			setViewModel: function (viewModel) {
				mustacheView.viewModel = viewModel;
			},
			triggerEvent: function (eventData) {
				$('html').trigger(eventData);
			}
		};
		
		return mustacheView;
	}
};