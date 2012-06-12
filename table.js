tableModel = function(rows, fields) {
	this.__templates = {
		table: '<div class="header"><div class="inner" data-bind="style: { width: fields.__width() }, template: { name: \'header\', foreach: fields() }"><div class="ender"></div></div></div>'+
			'<div class="body" data-bind="syncScroll: \'.header\'"><div class="inner" data-bind="template: {name: \'row\', foreach: rows.__trimmed() }, fillTable: true, style: { width: fields.__width() }" ></div></div>',
		header: '<div class="title entry" data-bind="text: $data.name, setClass: $data.type"></div>',
		row: '<div class="row" data-bind="template: {name: \'entry\', foreach: $parent.fields() }"></div>',
		entry: '<div class="entry" data-bind="entryTemplate: {field: $data, row: $parent }, setClass: $data.type"></div>',
		text: '<textarea data-bind="value: $parent[$data.name]"></textarea>',
		number: '<textarea class="number has_controls data" wrap="off" data-bind="value: $parent[$data.name], valueUpdate: \'afterkeydown\'"></textarea>'+
		'<div class="number_controls field_controller"><span amount="1" class="numberUp">&#x2191;</span><span amount="-1" class="numberDown">&#x2193;</span></div>'
	}

	this.rows = ko.observableArray(rows)
	this.rows.__base = ko.observable(20)
	this.rows.__more = ko.computed( function() { return this.rows.__base() <= this.rows().length },this)
	this.rows.__trimmed = ko.computed( function() {
		var __more = this.rows.__more()
		return  __more ? this.rows().slice(0, this.rows.__base() ) : this.rows();
		
	},this)
	this.fields = ko.observableArray(fields)
	this.fields.__width = ko.computed(function() { 
		var width = 0, fields = this.fields()
		for (var i=0; i < fields.length; i++) {
			switch(fields[i].type) {
				case 'number':
					width += 60
					break;
				default:
					width += 100;
			}
			width += 4
		};
		return width+'px'
	},this)


	ko.bindingHandlers.fillTable = {  init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var __base = viewModel.rows.__base,
			__more = viewModel.rows.__more()
		$(element).parent().scroll(function (e) { var $target = $(e.target);  if( e.target.scrollTop + $target.height() > $(element,$target).height() && __more ) { __base(__base() + 10); } });
	}};
	ko.bindingHandlers.syncScroll = { init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var $element = $(element).scroll(function (e) { $element.parents('.table').find('.header').scrollLeft( e.target.scrollLeft ) });
	}};
	ko.bindingHandlers.setClass = { init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) { $(element).addClass( valueAccessor() ) }}
	ko.bindingHandlers.entryTemplate = {  init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) { 
		var options = valueAccessor(),
			row = options.row,
			field = options.field
			other = allBindingsAccessor(),
			ctx = bindingContext,
			template = typeof ctx.$root.__templates[field.type] != 'undefined' ? field.type : 'text'
		other.template = {name: template }
	}}

