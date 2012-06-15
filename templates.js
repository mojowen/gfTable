
// Number
$(document).on('click','.number_controls span', function(e) { 
	var ctx = ko.contextFor(this), observable = ctx.$parent[ ctx.$data[tableOptions.field.data] ], value = observable(), amount = $(this).hasClass('numberUp') ? 1 : -1
	if( isNaN(parseInt(value)) ) return false;
	observable(value+amount); 
	e.preventDefault(); 
});
tableModel.__addTemplate('number','<textarea class="number has_controls" wrap="off" data-bind="value: $parent[$data.{data_field}], valueUpdate: \'afterkeydown\'"></textarea><div class="number_controller field_controller"><span amount="1" class="numberUp">&#x2191;</span><span amount="-1" class="numberDown">&#x2193;</span></div>',60)


// Block
$(document).on({
	focusin: function(e) { $(this).elastic().parent().addClass('open') },
	focusout:function(e) { $(this).parent().removeClass('open') } 
},'.block textarea')
tableModel.__addTemplate('block','<textarea data-bind="value: $parent[$data.{data_field}], valueUpdate: \'afterkeydown\', elastic: true" class="block"></textarea>',200)

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
$(document).on({ click: function(e) {
	var options = new multiselect(),
		$element = $(this).hide().next('select')
	options.multiple = false
	options.appendTo = $element.parents('.body')
	$element.multiselect(options)
}},'.select button.trigger')
tableModel.__addTemplate('select','<button type="button" class="ui-multiselect trigger" aria-haspopup="true" tabindex="0" data-bind="text: !$parent[$data.{data_field}]  ? \'--\' : $parent[$data.{data_field}]() == null ? \'--\' : $parent[$data.{data_field}]"></button><select style="display: none;"  data-bind="betterSelect: true, value: $parent[$data.{data_field}], options: $data.{option_field}, optionsCaption: \'--\'" class="select"></select>',120);

// Multiselect
$(document).on({ click: function(e) {
	var options = new multiselect(),
		$element = $(this).hide().next('select')
	options.appendTo = $element.parents('.body')
	$element.multiselect(options)
}},'.multiselect button.trigger')
tableModel.__addTemplate('multiselect','<button type="button" class="ui-multiselect trigger" aria-haspopup="true" tabindex="0" data-bind="text: !$parent[$data.{data_field}] ? \'Select Options\' : $parent[$data.{data_field}]().length > 1 ? $parent[$data.{data_field}]().length+\' selected\' : $parent[$data.{data_field}] "></button><select style="display: none;" multiple="true" data-bind="betterSelect: true, selectedOptions: $parent[$data.{data_field}], options: $data.{option_field}" class="multiselect"></select>',120);

// Date
$(document).on({
	click: function(e) { var ctx = ko.contextFor(this); $(this).dateMaker( ctx.$parent[ ctx.$data[ tableModel.__options.field.data] ] ).parent().addClass('open') },
	focus: function(e) { var ctx = ko.contextFor(this); $(this).dateMaker( ctx.$parent[ ctx.$data[ tableModel.__options.field.data] ] ).parent().addClass('open') }
},'.date:not(.open) textarea, .date:not(.open) .date_controller')
tableModel.__addTemplate('date','<textarea data-bind="value: $parent[$data.{data_field}], valueUpdate: \'afterkeydown\', elastic: true" class="date"></textarea><div class="field_controller date_controller"></div>', 140);

// Suggest
$(document).on({
	focusin: function() {
		var ctx = ko.contextFor(this)
		$(this).autocomplete({
			source: ko.utils.arrayGetDistinctValues( ctx.$root.rows().map( function(elem) { return elem[ ctx.$data[ ctx.$root.__options.field.data] ]() } )),
			appendTo: $(this).parents('.inner')
		});
	},
	focusout: function() {
		if( $('.ui-autocomplete').is(':hidden') ) { $(this).autocomplete('destroy'); }
	}
},'.suggest textarea')
tableModel.__addTemplate('suggest','<textarea class="suggest data " data-bind="value: $parent[$data.{data_field}]"></textarea>')


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
tableModel.__addTemplate('array','<div class="array" data-bind="template: { foreach: $parent[$data.{data_field}], name:\'arrayItem\'}"><div style="clear:both;"></div></div>',160)
tableModel.__addTemplate('arrayItem','<a data-bind="text:  $data.text ? $data.text : $data , attr: { href: $data.link  }"></a>')

