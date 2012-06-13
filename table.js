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
	'<div class="number_controller field_controller"><span amount="1" class="numberUp">&#x2191;</span><span amount="-1" class="numberDown">&#x2193;</span></div>';

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
	// Select
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
	this.__templates['select'] = '<button type="button" class="ui-multiselect trigger" aria-haspopup="true" tabindex="0" data-bind="text: !$parent[$data.'+tableOptions.field.data+']  ? \'--\' : $parent[$data.'+tableOptions.field.data+']() == null ? \'--\' : $parent[$data.'+tableOptions.field.data+']"></button>'+
		'<select style="display: none;"  data-bind="betterSelect: true, value: $parent[$data.'+tableOptions.field.data+'], options: $data.'+tableOptions.field.options+', optionsCaption: \'--\'" class="select"></select>';

	// Multiselect
	$(document).on({
		click: function(e) {
			var options = new multiselect(),
				$element = $(this).hide().next('select')
			options.appendTo = $element.parents('.body')
			$element.multiselect(options)
		}
	},'.multiselect button.trigger')
	this.__widths['multiselect'] = 120;
	this.__templates['multiselect'] = '<button type="button" class="ui-multiselect trigger" aria-haspopup="true" tabindex="0" data-bind="text: !$parent[$data.'+tableOptions.field.data+'] ? \'Select Options\' : $parent[$data.'+tableOptions.field.data+']().length > 1 ? $parent[$data.'+tableOptions.field.data+']().length+\' selected\' : $parent[$data.'+tableOptions.field.data+'] "></button>'+
		'<select style="display: none;" multiple="true" data-bind="betterSelect: true, selectedOptions: $parent[$data.'+tableOptions.field.data+'], options: $data.'+tableOptions.field.options+'" class="multiselect"></select>';

	// Date
	$(document).on({
		click: function(e) { var ctx = ko.contextFor(this); $(this).dateMaker( ctx.$parent[ ctx.$data[tableOptions.field.data] ] ).parent().addClass('open') },
		focus: function(e) { var ctx = ko.contextFor(this); $(this).dateMaker( ctx.$parent[ ctx.$data[tableOptions.field.data] ] ).parent().addClass('open') }
	},'.date:not(.open) textarea, .date:not(.open) .date_controller')

	this.__widths['date'] = 140;
	this.__templates['date'] = '<textarea data-bind="value: $parent[$data.'+tableOptions.field.data+'], valueUpdate: \'afterkeydown\', elastic: true" class="date"></textarea>'+
		'<div class="field_controller date_controller"></div>';

	// Suggest
	$(document).on({
		focusin: function() {
			var ctx = ko.contextFor(this)
			$(this).autocomplete({
				source: ko.utils.arrayGetDistinctValues( ctx.$root.rows().map( function(elem) { return elem[ ctx.$data[tableOptions.field.data] ]() } )),
				appendTo: $(this).parents('.inner')
			});
		},
		focusout: function() {
			if( $('.ui-autocomplete').is(':hidden') ) { $(this).autocomplete('destroy'); }
		}
	},'.suggest textarea')
	this.__templates['suggest'] = '<textarea class="suggest data " data-bind="value: $parent[$data.'+tableOptions.field.data+']"></textarea>';

	// Array
	$(document).on({
		click: function(e) {
			var $this = $(this).addClass('open')
			$(document).bind('mousedown.array', function(e) {
				if( !$.contains( $this[0], e.target) && e.target !== $this[0] && !$(e.target).is($this) ||  $(e.target).is('.close') ) {
					$this.removeClass('open')
				}
				$(this).unbind('mousedown.array');
			});
			
		} 
	},'.entry.array')
	this.__widths['array'] = 160;
	this.__templates['array'] = '<div class="array" data-bind="template: { foreach: $parent[$data.'+tableOptions.field.data+'], name:\'arrayItem\'}"><div style="clear:both;"></div></div>';
	this.__templates['arrayItem'] = '<a data-bind="text:  $data.text ? $data.text : $data , attr: { href: $data.link  }"></a>';




	this.fields.__width = ko.computed(function() { 
		var width = 0, fields = this.fields()
		for (var i=0; i < fields.length; i++) {
			if( typeof this.__widths[ fields[i][ tableOptions.field.type] ] == 'undefined' ) width += 100
			else width += this.__widths[ fields[i][ tableOptions.field.type] ]
			width += 4
		};
		return width
	},this)

}