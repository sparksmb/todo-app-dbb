/*global app, $ */
app.view.controllerBase = {
	create: function () {
		'use strict';
		var controllerBase = {
			initEventHandlers: function (eventHandlerList) {
				eventHandlerList.forEach(function (handlerBinding) {
					$("html").on(handlerBinding.eventName, handlerBinding.eventHandler);
				});
			},
			initEventHandler: function (eventName, eventHandler) {
				$("html").on(eventName, eventHandler);
			}
		};
		
		return controllerBase;
	}
};