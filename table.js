tableModel = function(rows, fields) {
	this.templates = {
		table: '<div class="header"><div class="inner" data-bind="style: { width: fields.width() }, template: { name: \'header\', foreach: fields() }"></div></div>'+
			'<div class="body" data-bind="syncScroll: \'.header\'"><div class="inner" data-bind="template: {name: \'row\', foreach: rows()  }, style: { width: fields.width() }" ></div></div>',
		header: '<div class="title entry" data-bind="text:$data.name"></div>',
		row: '<div class="row" data-bind="template: {name: \'entry\', foreach: $parent.fields}"></div>',
		entry: '<div class="entry" data-bind="text: $parent[$data.name]" ></div>'
	}

	this.rows = ko.observableArray(rows)
	this.fields = ko.observableArray(fields)
	this.fields.width = ko.computed(function() { return this.fields().length*100+'px'},this)
	return this;
}



ko.bindingHandlers.table = { init: function(element, valueAccessor, allBindingsAccessor, viewModel) { 
	var all = allBindingsAccessor(); all.template = {name: 'table', with: all.table } 
}};
ko.bindingHandlers.syncScroll = { init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
	var $element = $(element); $element.scroll(function (e) { $element.parent('.table').find('.header').scrollLeft( e.target.scrollLeft ) });
}};