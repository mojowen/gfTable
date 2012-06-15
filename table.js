tableModel = function(rows, fields) {
	var tableOptions = {
		field: {
			name: 'name',
			data: 'name',
			options: 'options',
			type: 'type'
		},
		ender: 50
	}
	
	// Templates
	this.__templates = ko.observable({
		table: '<div class="header"><div class="inner" data-bind="style: { width: (fields.__width()+'+tableOptions.ender+')+\'px\' }, template: { name: \'header\', foreach: fields() }"><div class="ender" style="width: '+tableOptions.ender+'px"></div></div></div>'+
			'<div class="body" data-bind="syncScroll: \'.header\'"><div class="inner" data-bind="template: {name: \'row\', foreach: rows.__trimmed() }, fillTable: true, style: { width: fields.__width()+\'px\' }" ></div></div>',
		header: '<div class="title entry" data-bind="text: $data.'+tableOptions.field.name+', setTemplateClass: $data.'+tableOptions.field.type+'"></div>',
		row: '<div class="row" data-bind="template: {name: \'entry\', foreach: $parent.fields() }"></div>',
		entry: '<div class="entry" data-bind="entryTemplate: {field: $data, row: $parent }, setTemplateClass: $data.'+tableOptions.field.type+'"></div>',
		text: '<textarea data-bind="value: $parent[$data.'+tableOptions.field.data+']"></textarea>'
	})
	this.__widths = ko.observable({})
	
	// Rows
	this.rows = ko.observableArray(rows)
	this.rows.__base = ko.observable(20)
	this.rows.__more = ko.computed( function() { return this.rows.__base() <= this.rows().length },this)
	this.rows.__trimmed = ko.computed( function() {
		var __more = this.rows.__more()
		return  __more ? this.rows().slice(0, this.rows.__base() ) : this.rows();
		
	},this)

	// Fields
	this.fields = ko.observableArray(fields)
	this.fields.__width = ko.computed(function() { 
		var width = 0, fields = this.fields(), widths = this.__widths()
		for (var i=0; i < fields.length; i++) {
			if( typeof widths[ fields[i][ tableOptions.field.type] ] == 'undefined' ) width += 100
			else width += widths[ fields[i][ tableOptions.field.type] ]
			width += 4
		};
		return width
	},this)

	this.addTemplate = function(name, template, width) {
		var templates = ko.toJS(this.__templates ), widths = ko.toJS(this.__widths )
		if( typeof template != 'undefined' ) {
			templates[name] = template.replace(/{data_field}/g,tableOptions.field.data)
			this.__templates(templates)
		}
		if( typeof width != 'undefined' ) {
			widths[name] = width
			this.__widths(widths)
		}
	}


	// Bindings for the table
	ko.bindingHandlers.fillTable = {  init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var __base = viewModel.rows.__base,
			__more = viewModel.rows.__more(),
			$element = $(element),
			$parent = $element.parent()
		setTimeout( function() { if( $element.height() < $parent.height() && __more ) __base( __base() + Math.floor( $parent.height() / $('.entry:first',$element).height() ) ) }, 0 ) // Set a timeout so it renders
		$parent.scroll(function (e) { var $target = $(e.target);  if( e.target.scrollTop + $target.height() > $(element,$target).height() && __more ) { __base(__base() + 10); } });
	}};
	ko.bindingHandlers.syncScroll = { init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var $element = $(element).scroll(function (e) { $element.parents('.table').find('.header').scrollLeft( e.target.scrollLeft ) });
	}};
	ko.bindingHandlers.setTemplateClass = {  init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) { if( typeof bindingContext.$root.__templates()[valueAccessor()] != 'undefined' ) $(element).addClass( valueAccessor() ); } }
	ko.bindingHandlers.entryTemplate = {  
		init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) { 
			var options = valueAccessor(),
				row = options.row,
				field = options.field
				other = allBindingsAccessor(),
				ctx = bindingContext,
				template = typeof ctx.$root.__templates()[ field[tableOptions.field.type] ] != 'undefined' ? field[tableOptions.field.type] : 'text'
			other.template = {name: template }
		}
	}

}


ko.templateSources.stringTemplate = function(template, templates) {
	this.templateName = template;
	this.templates = templates;
}

ko.utils.extend(ko.templateSources.stringTemplate.prototype, {
	data: function(key, value) {
		this.templates._data = this.templates._data || {};
		this.templates._data[this.templateName] = this.templates._data[this.templateName] || {};
		if (arguments.length === 1)  return this.templates._data[this.templateName][key]; 
		this.templates._data[this.templateName][key] = value;
	},
	text: function(value) {
		if (arguments.length === 0) return this.templates[this.templateName]; 
		this.templates[this.templateName] = value;   
	},
	foreach: function(value) {
		return '...'
	}
});

//modify an existing templateEngine to work with string templates
function createStringTemplateEngine(templateEngine, templates) {
	templateEngine.makeTemplateSource = function(template) { return new ko.templateSources.stringTemplate(template, templates); }   
	return templateEngine;
}
