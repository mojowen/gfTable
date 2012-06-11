tableModel = function(rows, fields) {
	this.templates = {
		table: '<div class="header"><div class="inner" data-bind="style: { width: fields.__width() }, template: { name: \'header\', foreach: fields() }"></div></div>'+
			'<div class="body" data-bind="syncScroll: \'.header\'"><div class="inner" data-bind="fillTable: rows.__trimmed, style: { width: fields.__width() }" ><div class="loading" data-bind="visible: rows.__base() < rows().length ">Loading...</div></div></div>',
		header: '<div class="title entry" data-bind="text: $data.name"></div>',
		row: '<div class="row" data-bind="fillRow: $data"></div>',
		entry: '<div class="entry" data-bind="fillEntry: $data" ></div>'
	}

	this.rows = ko.observableArray(rows)
	this.rows.__base = ko.observable(30)
	this.rows.__trimmed = ko.computed( function() { 
		return this.rows.slice(0,this.rows.__base());
	},this)
	this.fields = ko.observableArray(fields)
	this.fields.__width = ko.computed(function() { return this.fields().length*100+'px'},this)
	return this;
}



ko.bindingHandlers.table = { init: function(element, valueAccessor, allBindingsAccessor, viewModel) { 
	var all = allBindingsAccessor(); all.template = {name: 'table', with: all.table } 
}};
ko.bindingHandlers.fillTable = { init: function(element, valueAccessor, allBindingsAccessor, viewModel) { 
	var all = allBindingsAccessor(),
		__base = viewModel.rows.__base
	all.template = {name: 'row', foreach: all.fillTable }
	$(element).parent().scroll(function (e) { var $target = $(e.target);  if( e.target.scrollTop + $target.height() > $(element,$target).height() ) { __base(__base() + 10); } });
}};
ko.bindingHandlers.fillRow = { init: function(element, valueAccessor, allBindingsAccessor, viewModel) { 
	var all = allBindingsAccessor(),
		ctx = ko.contextFor(element)
	all.template = {name: 'entry', foreach: ctx.$parent.fields() } 
}};
ko.bindingHandlers.fillEntry = { init: function(element, valueAccessor, allBindingsAccessor, viewModel) { 
	var all = allBindingsAccessor(),
		ctx = ko.contextFor(element)
	all.html = ctx.$parent[ ctx.$data.name ]
}};
ko.bindingHandlers.syncScroll = { init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
	var $element = $(element).scroll(function (e) { $element.parents('.table').find('.header').scrollLeft( e.target.scrollLeft ) });
}};