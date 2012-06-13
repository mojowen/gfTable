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
	this.__templates = {
		table: '<div class="header"><div class="inner" data-bind="style: { width: (fields.__width()+'+tableOptions.ender+')+\'px\' }, template: { name: \'header\', foreach: fields() }"><div class="ender" style="width: '+tableOptions.ender+'px"></div></div></div>'+
			'<div class="body" data-bind="syncScroll: \'.header\'"><div class="inner" data-bind="template: {name: \'row\', foreach: rows.__trimmed() }, fillTable: true, style: { width: fields.__width()+\'px\' }" ></div></div>',
		header: '<div class="title entry" data-bind="text: $data.'+tableOptions.field.name+', setClass: $data.'+tableOptions.field.type+'"></div>',
		row: '<div class="row" data-bind="template: {name: \'entry\', foreach: $parent.fields() }"></div>',
		entry: '<div class="entry" data-bind="entryTemplate: {field: $data, row: $parent }, setClass: $data.'+tableOptions.field.type+'"></div>',
		text: '<textarea data-bind="value: $parent[$data.'+tableOptions.field.data+']"></textarea>'
	}
	this.__widths = {}
	
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
	ko.bindingHandlers.setClass = { init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) { $(element).addClass( valueAccessor() ) }}
	ko.bindingHandlers.entryTemplate = {  init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) { 
		var options = valueAccessor(),
			row = options.row,
			field = options.field
			other = allBindingsAccessor(),
			ctx = bindingContext,
			template = typeof ctx.$root.__templates[ field[tableOptions.field.type] ] != 'undefined' ? field[tableOptions.field.type] : 'text'
		other.template = {name: template }
	}}

	// Useful functions for increasing 

	// Number
	$(document).on('click','.number_controls span', function(e) { 
		var ctx = ko.contextFor(this), observable = ctx.$parent[ ctx.$data[tableOptions.field.data] ], value = observable(), amount = $(this).hasClass('numberUp') ? 1 : -1
		if( isNaN(parseInt(value)) ) return false;
		observable(value+amount); 
		e.preventDefault(); 
	});
	this.__widths['number'] = 60;
	this.__templates['number'] = '<textarea class="number has_controls data" wrap="off" data-bind="value: $parent[$data.'+tableOptions.field.data+'], valueUpdate: \'afterkeydown\'"></textarea>'+
	'<div class="number_controls field_controller"><span amount="1" class="numberUp">&#x2191;</span><span amount="-1" class="numberDown">&#x2193;</span></div>';

	// Block
	$(document).on({
		focusin: function(e) { $(this).elastic().parent().addClass('open') },
		focusout:function(e) { $(this).parent().removeClass('open') } 
	},'.block textarea')
	this.__widths['block'] = 200;
	this.__templates['block'] = '<textarea data-bind="value: $parent[$data.'+tableOptions.field.data+'], valueUpdate: \'afterkeydown\', elastic: true" class="block"></textarea>';

	
	// Options used for multiselect and select
	function multiselect() { return { 
		header: '<li class="other"><a class="ui-multiselect-all" href="#"><span>+ Check all</span></a></li><li class="other"><a class="ui-multiselect-none" href="#"><span>- Uncheck all</span></a></li>',
		selectedList: 1, 
		position: {my: 'left top', at: 'left bottom', collision: 'none none' },
		minWidth: 'auto',
		height: 'auto',
		autoOpen: true
	}};
	$(document).on({
		click: function(e) {
			var options = new multiselect(),
				$element = $(this).hide().next('select')
			options.multiple = false
			options.appendTo = $element.parents('.body')
			$element.multiselect(options)
		}
	},'.select button.trigger')
	this.__widths['select'] = 120;
	this.__templates['select'] = '<button type="button" class="ui-multiselect trigger" aria-haspopup="true" tabindex="0" data-bind="text: $parent[$data.name] "></button>'+
		'<select style="display: none;"  data-bind="betterSelect: true, value: $parent[$data.name], options: $data.options, optionsCaption: \'--\'" class="data select"></select>';


	return this;
}
	