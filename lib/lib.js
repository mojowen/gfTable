function makeString(stringLength) {
	var text = [];
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz                      ";
	for( var i=0; i < stringLength; i++ ) text.push(possible.charAt(Math.floor(Math.random() * possible.length)) );
	return text.join('');
}

jQuery.fn.extend({  
	elastic: function() {
	
		//	We will create a div clone of the textarea
		//	by copying these attributes from the textarea to the div.
		var mimics = [
			'paddingTop',
			'paddingRight',
			'paddingBottom',
			'paddingLeft',
			'fontSize',
			'lineHeight',
			'fontFamily',
			'width',
			'fontWeight',
			'border-top-width',
			'border-right-width',
			'border-bottom-width',
			'border-left-width',
			'borderTopStyle',
			'borderTopColor',
			'borderRightStyle',
			'borderRightColor',
			'borderBottomStyle',
			'borderBottomColor',
			'borderLeftStyle',
			'borderLeftColor'
			];
		
		return this.each( function() {

			// Elastic only works on textareas
			if ( this.type !== 'textarea' ) {
				return false;
			}
				
		var $textarea	= jQuery(this),
			$twin		= jQuery('<div />').css({
				'position'		: 'absolute',
				'display'		: 'none',
				'word-wrap'		: 'break-word',
				'white-space'	:'pre-wrap'
			}),
			lineHeight	= parseInt($textarea.css('line-height'),10) || parseInt($textarea.css('font-size'),'10'),
			minheight	= parseInt($textarea.css('height'),10) || lineHeight*3,
			maxheight	= parseInt($textarea.css('max-height'),10) || Number.MAX_VALUE,
			goalheight	= 0;
			
			// Opera returns max-height of -1 if not set
			if (maxheight < 0) { maxheight = Number.MAX_VALUE; }
				
			// Append the twin to the DOM
			// We are going to meassure the height of this, not the textarea.
			$twin.appendTo($textarea.parent());
			
			// Copy the essential styles (mimics) from the textarea to the twin
			var i = mimics.length;
			while(i--){
				$twin.css(mimics[i].toString(),$textarea.css(mimics[i].toString()));
			}
			
			// Updates the width of the twin. (solution for textareas with widths in percent)
			function setTwinWidth(){
				var curatedWidth = Math.floor(parseInt($textarea.width(),10));
				if($twin.width() !== curatedWidth){
					$twin.css({'width': curatedWidth + 'px'});
					
					// Update height of textarea
					update(true);
				}
			}
			
			// Sets a given height and overflow state on the textarea
			function setHeightAndOverflow(height, overflow){
			
				var curratedHeight = Math.floor(parseInt(height,10));
				if($textarea.height() !== curratedHeight){
					$textarea.css({'height': curratedHeight + 'px','overflow':overflow});
				}
			}
			
			// This function will update the height of the textarea if necessary 
			function update(forced) {
				
				// Get curated content from the textarea.
				var textareaContent = $textarea.val().replace(/&/g,'&amp;').replace(/ {2}/g, '&nbsp;').replace(/<|>/g, '&gt;').replace(/\n/g, '<br />');
				
				// Compare curated content with curated twin.
				var twinContent = $twin.html().replace(/<br>/ig,'<br />');
				
				if(forced || textareaContent+'&nbsp;' !== twinContent){
				
					// Add an extra white space so new rows are added when you are at the end of a row.
					$twin.html(textareaContent+'&nbsp;');
					
					// Change textarea height if twin plus the height of one line differs more than 3 pixel from textarea height
					if(Math.abs($twin.height() + lineHeight - $textarea.height()) > 3){
						
						var goalheight = $twin.height()+lineHeight;
						if(goalheight >= maxheight) {
							setHeightAndOverflow(maxheight,'auto');
						} else if(goalheight <= minheight) {
							setHeightAndOverflow(minheight,'hidden');
						} else {
							setHeightAndOverflow(goalheight,'hidden');
						}
						
					}
					
				}
				
			}
			
			// Hide scrollbars
			$textarea.css({'overflow':'hidden'});
			
			// Update textarea size on keyup, change, cut and paste
			$textarea.bind('keyup change cut paste', function(){
				update(); 
			});
			
			// Update width of twin if browser or textarea is resized (solution for textareas with widths in percent)
			$(window).bind('resize', setTwinWidth);
			$textarea.bind('resize', setTwinWidth);
			$textarea.bind('update', update);
			
			// Compact textarea on blur
			$textarea.bind('blur',function(){
				if($twin.height() < maxheight){
					if($twin.height() > minheight) {
						$textarea.height($twin.height());
					} else {
						$textarea.height(minheight);
					}
				}
			});
			
			// And this line is to catch the browser paste event
			$textarea.bind('input paste',function(e){ setTimeout( update, 250); });				
			
			// Run update once when elastic is initialized
			update();
			
		});
		
    } 
});
/* jshint forin:true, noarg:true, noempty:true, eqeqeq:true, boss:true, undef:true, curly:true, browser:true, jquery:true */
/*
 * jQuery MultiSelect UI Widget 1.12
 * Copyright (c) 2011 Eric Hynds
 *
 * http://www.erichynds.com/jquery/jquery-ui-multiselect-widget/
 *
 * Depends:
 *   - jQuery 1.4.2+
 *   - jQuery UI 1.8 widget factory
 *
 * Optional:
 *   - jQuery UI effects
 *   - jQuery UI position utility
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
*/
(function($, undefined){

var multiselectID = 0;

$.widget("ech.multiselect", {
	
	// default options
	options: {
		header: true,
		height: 175,
		minWidth: 225,
		classes: '',
		checkAllText: 'Check all',
		uncheckAllText: 'Uncheck all',
		noneSelectedText: 'Select options',
		selectedText: '# selected',
		selectedList: 0,
		show: '',
		hide: '',
		autoOpen: false,
		multiple: true,
		position: {},
		appendTo: 'body'
	},

	_create: function(){
		var el = this.element.hide(),
			o = this.options;
		
		this.speed = $.fx.speeds._default; // default speed for effects
		this._isOpen = false; // assume no
	
		var 
			button = (this.button = $('<button type="button"><span class="ui-icon ui-icon-triangle-2-n-s"></span></button>'))
				.addClass('ui-multiselect ui-widget ui-state-default ui-corner-all')
				.addClass( o.classes )
				.attr({ 'title':el.attr('title'), 'aria-haspopup':true, 'tabIndex':el.attr('tabIndex') })
				.insertAfter( el ),
			
			buttonlabel = (this.buttonlabel = $('<span />'))
				.html( o.noneSelectedText )
				.appendTo( button ),
				
			menu = (this.menu = $('<div />'))
				.addClass('ui-multiselect-menu ui-widget ui-widget-content ui-corner-all')
				.addClass( o.classes )
				.appendTo( $(document).find( o.appendTo || "body" )[0] ),
				
			header = (this.header = $('<div />'))
				.addClass('ui-widget-header ui-corner-all ui-multiselect-header ui-helper-clearfix')
				.appendTo( menu ),
				
			headerLinkContainer = (this.headerLinkContainer = $('<ul />'))
				.addClass('ui-helper-reset')
				.html(function(){
					if( o.header === true ){
						return '<li><a class="ui-multiselect-all" href="#"><span class="ui-icon ui-icon-check"></span><span>' + o.checkAllText + '</span></a></li><li><a class="ui-multiselect-none" href="#"><span class="ui-icon ui-icon-closethick"></span><span>' + o.uncheckAllText + '</span></a></li>';
					} else if(typeof o.header === "string"){
						return '<li>' + o.header + '</li>';
					} else {
						return '';
					}
				})
				.append('<li class="ui-multiselect-close"><a href="#" class="ui-multiselect-close"><span class="ui-icon ui-icon-circle-close"></span></a></li>')
				.appendTo( header ),
			
			checkboxContainer = (this.checkboxContainer = $('<ul />'))
				.addClass('ui-multiselect-checkboxes ui-helper-reset')
				.appendTo( menu );
		
		// perform event bindings
		this._bindEvents();
		
		// build menu
		this.refresh( true );
		
		// some addl. logic for single selects
		if( !o.multiple ){
			menu.addClass('ui-multiselect-single');
		}
	},
	
	_init: function(){
		if( this.options.header === false ){
			this.header.hide();
		}
		if( !this.options.multiple ){
			this.headerLinkContainer.find('.ui-multiselect-all, .ui-multiselect-none').hide();
		}
		if( this.options.autoOpen ){
			this.open();
		}
		if( this.element.is(':disabled') ){
			this.disable();
		}
	},
	
	refresh: function( init ){
		var el = this.element,
			o = this.options,
			menu = this.menu,
			checkboxContainer = this.checkboxContainer,
			optgroups = [],
			html = [],
			id = el.attr('id') || multiselectID++; // unique ID for the label & option tags
		
		// build items
		el.find('option').each(function( i ){
			var $this = $(this), 
				parent = this.parentNode,
				title = this.innerHTML,
				description = this.title,
				value = this.value,
				inputID = this.id || 'ui-multiselect-' + id + '-option-' + i,
				isDisabled = this.disabled,
				isSelected = this.selected,
				labelClasses = ['ui-corner-all'],
				optLabel;
			
			// is this an optgroup?
			if( parent.tagName.toLowerCase() === 'optgroup' ){
				optLabel = parent.getAttribute('label');
				
				// has this optgroup been added already?
				if( $.inArray(optLabel, optgroups) === -1 ){
					html.push('<li class="ui-multiselect-optgroup-label"><a href="#">' + optLabel + '</a></li>');
					optgroups.push( optLabel );
				}
			}
		
			if( isDisabled ){
				labelClasses.push('ui-state-disabled');
			}

			// browsers automatically select the first option
			// by default with single selects
			if( isSelected && !o.multiple ){
				labelClasses.push('ui-state-active');
			}
			
			html.push('<li class="' + (isDisabled ? 'ui-multiselect-disabled' : '') + '">');
			
			// create the label
			html.push('<label for="' + inputID + '" title="' + description + '" class="' + labelClasses.join(' ') + '">');
			html.push('<input id="' + inputID + '" name="multiselect_' + id + '" type="' + (o.multiple ? "checkbox" : "radio") + '" value="' + value + '" title="' + title + '"');

			// pre-selected?
			if( isSelected ){
				html.push(' checked="checked"');
				html.push(' aria-selected="true"');
			}

			// disabled?
			if( isDisabled ){
				html.push(' disabled="disabled"');
				html.push(' aria-disabled="true"');
			}

			// add the title and close everything off
			html.push(' /><span>' + title + '</span></label></li>');
		});
		
		// insert into the DOM
		checkboxContainer.html( html.join('') );

		// cache some moar useful elements
		this.labels = menu.find('label');
		
		// set widths
		this._setButtonWidth();
		this._setMenuWidth();
		
		// remember default value
		this.button[0].defaultValue = this.update();
		
		// broadcast refresh event; useful for widgets
		if( !init ){
			this._trigger('refresh');
		}
	},
	
	// updates the button text. call refresh() to rebuild
	update: function(){
		var o = this.options,
			$inputs = this.labels.find('input'),
			$checked = $inputs.filter('[checked]'),
			numChecked = $checked.length,
			value;
		
		if( numChecked === 0 ){
			value = o.noneSelectedText;
		} else {
			if($.isFunction( o.selectedText )){
				value = o.selectedText.call(this, numChecked, $inputs.length, $checked.get());
			} else if( /\d/.test(o.selectedList) && o.selectedList > 0 && numChecked <= o.selectedList){
				value = $checked.map(function(){ return $(this).next().text(); }).get().join(', ');
			} else {
				value = o.selectedText.replace('#', numChecked).replace('#', $inputs.length);
			}
		}
		
		this.buttonlabel.html( value );
		return value;
	},
	
	// binds events
	_bindEvents: function(){
		var self = this, button = this.button;
		
		function clickHandler(){
			self[ self._isOpen ? 'close' : 'open' ]();
			return false;
		}
		
		// webkit doesn't like it when you click on the span :(
		button
			.find('span')
			.bind('click.multiselect', clickHandler);
		
		// button events
		button.bind({
			click: clickHandler,
			keypress: function( e ){
				switch(e.which){
					case 27: // esc
					case 38: // up
					case 37: // left
						self.close();
						break;
					case 39: // right
					case 40: // down
						self.open();
						break;
				}
			},
			mouseenter: function(){
				if( !button.hasClass('ui-state-disabled') ){
					$(this).addClass('ui-state-hover');
				}
			},
			mouseleave: function(){
				$(this).removeClass('ui-state-hover');
			},
			focus: function(){
				if( !button.hasClass('ui-state-disabled') ){
					$(this).addClass('ui-state-focus');
				}
			},
			blur: function(){
				$(this).removeClass('ui-state-focus');
			}
		});

		// header links
		this.header
			.delegate('a', 'click.multiselect', function( e ){
				// close link
				if( $(this).hasClass('ui-multiselect-close') ){
					self.close();
			
				// check all / uncheck all
				} else {
					self[ $(this).hasClass('ui-multiselect-all') ? 'checkAll' : 'uncheckAll' ]();
				}
			
				e.preventDefault();
			});
		
		// optgroup label toggle support
		this.menu
			.delegate('li.ui-multiselect-optgroup-label a', 'click.multiselect', function( e ){
				e.preventDefault();
				
				var $this = $(this),
					$inputs = $this.parent().nextUntil('li.ui-multiselect-optgroup-label').find('input:visible:not(:disabled)'),
				    nodes = $inputs.get(),
				    label = $this.parent().text();
				
				// trigger event and bail if the return is false
				if( self._trigger('beforeoptgrouptoggle', e, { inputs:nodes, label:label }) === false ){
					return;
				}
				
				// toggle inputs
				self._toggleChecked(
					$inputs.filter('[checked]').length !== $inputs.length,
					$inputs
				);

				self._trigger('optgrouptoggle', e, {
				    inputs: nodes,
				    label: label,
				    checked: nodes[0].checked
				});
			})
			.delegate('label', 'mouseenter.multiselect', function(){
				if( !$(this).hasClass('ui-state-disabled') ){
					self.labels.removeClass('ui-state-hover');
					$(this).addClass('ui-state-hover').find('input').focus();
				}
			})
			.delegate('label', 'keydown.multiselect', function( e ){
				e.preventDefault();
				
				switch(e.which){
					case 9: // tab
					case 27: // esc
						self.close();
						break;
					case 38: // up
					case 40: // down
					case 37: // left
					case 39: // right
						self._traverse(e.which, this);
						break;
					case 13: // enter
						$(this).find('input')[0].click();
						break;
				}
			})
			.delegate('input[type="checkbox"], input[type="radio"]', 'click.multiselect', function( e ){
				var $this = $(this),
					val = this.value,
					checked = this.checked,
					tags = self.element.find('option');
				
				// bail if this input is disabled or the event is cancelled
				if( this.disabled || self._trigger('click', e, { value: val, text: this.title, checked: checked }) === false ){
					e.preventDefault();
					return;
				}

				// make sure the input has focus. otherwise, the esc key
				// won't close the menu after clicking an item.
				$this.focus();
				
				// toggle aria state
				$this.attr('aria-selected', checked);
				
				// change state on the original option tags
				tags.each(function(){
					if( this.value === val ){
						this.selected = checked;
					} else if( !self.options.multiple ){
						this.selected = false;
					}
				});
				
				// some additional single select-specific logic
				if( !self.options.multiple ){
					self.labels.removeClass('ui-state-active');
					$this.closest('label').toggleClass('ui-state-active', checked );
					
					// close menu
					self.close();
				}

				// fire change on the select box
				self.element.trigger("change");
				
				// setTimeout is to fix multiselect issue #14 and #47. caused by jQuery issue #3827
				// http://bugs.jquery.com/ticket/3827 
				setTimeout($.proxy(self.update, self), 10);
			});

		// close each widget when clicking on any other element/anywhere else on the page
		$(document).bind('mousedown.multiselect', function( e ){
			if(self._isOpen && !$.contains(self.menu[0], e.target) && !$.contains(self.button[0], e.target) && e.target !== self.button[0] && !$(e.target).is(self.menu[0])){
				self.close();
			}
		});

		// deal with form resets.  the problem here is that buttons aren't
		// restored to their defaultValue prop on form reset, and the reset
		// handler fires before the form is actually reset.  delaying it a bit
		// gives the form inputs time to clear.
		$(this.element[0].form).bind('reset.multiselect', function(){
			setTimeout($.proxy(self.refresh, self), 10);
		});
	},

	// set button width
	_setButtonWidth: function(){
		// var width = this.element.outerWidth(),
		// 	o = this.options;
		// 	
		// if( /\d/.test(o.minWidth) && width < o.minWidth){
		// 	width = o.minWidth;
		// }
		// 
		// // set widths
		// this.button.width( width );
	},
	
	// set menu width
	_setMenuWidth: function(){
		var m = this.menu,
			width = this.button.outerWidth()-
				parseInt(m.css('padding-left'),10)-
				parseInt(m.css('padding-right'),10)-
				parseInt(m.css('border-right-width'),10)-
				parseInt(m.css('border-left-width'),10);
				
		m.width( width || this.button.outerWidth() );
	},
	
	// move up or down within the menu
	_traverse: function( which, start ){
		var $start = $(start),
			moveToLast = which === 38 || which === 37,
			
			// select the first li that isn't an optgroup label / disabled
			$next = $start.parent()[moveToLast ? 'prevAll' : 'nextAll']('li:not(.ui-multiselect-disabled, .ui-multiselect-optgroup-label)')[ moveToLast ? 'last' : 'first']();
		
		// if at the first/last element
		if( !$next.length ){
			var $container = this.menu.find('ul').last();
			
			// move to the first/last
			this.menu.find('label')[ moveToLast ? 'last' : 'first' ]().trigger('mouseover');
			
			// set scroll position
			$container.scrollTop( moveToLast ? $container.height() : 0 );
			
		} else {
			$next.find('label').trigger('mouseover');
		}
	},

	// This is an internal function to toggle the checked property and
	// other related attributes of a checkbox.
	//
	// The context of this function should be a checkbox; do not proxy it.
	_toggleState: function( prop, flag ){
		return function(){
			if( !this.disabled ) {
				this[ prop ] = flag;
			}

			if( flag ){
				this.setAttribute('aria-selected', true);
			} else {
				this.removeAttribute('aria-selected');
			}
		};
	},

	_toggleChecked: function( flag, group ){
		var $inputs = (group && group.length) ?
			group :
			this.labels.find('input'),

			self = this;

		// toggle state on inputs
		$inputs.each(this._toggleState('checked', flag));

		// give the first input focus
		$inputs.eq(0).focus();
		
		// update button text
		this.update();
		
		// gather an array of the values that actually changed
		var values = $inputs.map(function(){
			return this.value;
		}).get();

		// toggle state on original option tags
		this.element
			.find('option')
			.each(function(){
				if( !this.disabled && $.inArray(this.value, values) > -1 ){
					self._toggleState('selected', flag).call( this );
				}
			});

		// trigger the change event on the select
		if( $inputs.length ) {
			this.element.trigger("change");
		}
	},

	_toggleDisabled: function( flag ){
		this.button
			.attr({ 'disabled':flag, 'aria-disabled':flag })[ flag ? 'addClass' : 'removeClass' ]('ui-state-disabled');
		
		this.menu
			.find('input')
			.attr({ 'disabled':flag, 'aria-disabled':flag })
			.parent()[ flag ? 'addClass' : 'removeClass' ]('ui-state-disabled');
		
		this.element
			.attr({ 'disabled':flag, 'aria-disabled':flag });
	},
	
	// open the menu
	open: function( e ){
		var self = this,
			button = this.button,
			menu = this.menu,
			speed = this.speed,
			o = this.options;
		
		// bail if the multiselectopen event returns false, this widget is disabled, or is already open 
		if( this._trigger('beforeopen') === false || button.hasClass('ui-state-disabled') || this._isOpen ){
			return;
		}
		
		var $container = menu.find('ul').last(),
			effect = o.show,
			pos = button.offset();
		
		// figure out opening effects/speeds
		if( $.isArray(o.show) ){
			effect = o.show[0];
			speed = o.show[1] || self.speed;
		}
		
		// set the scroll of the checkbox container
		$container.scrollTop(0).height(o.height);
		
		// position and show menu
		if( $.ui.position && !$.isEmptyObject(o.position) ){
			o.position.of = o.position.of || button;
			
			menu
				.show()
				.position( o.position )
				.hide()
				.show( effect, speed );
		
		// if position utility is not available...
		} else {
			menu.css({ 
				top: pos.top + button.outerHeight(),
				left: pos.left
			}).show( effect, speed );
		}
		
		// select the first option
		// triggering both mouseover and mouseover because 1.4.2+ has a bug where triggering mouseover
		// will actually trigger mouseenter.  the mouseenter trigger is there for when it's eventually fixed
		this.labels.eq(0).trigger('mouseover').trigger('mouseenter').find('input').trigger('focus');
		
		button.addClass('ui-state-active');
		this._isOpen = true;
		this._trigger('open');
	},
	
	// close the menu
	close: function(){
		if(this._trigger('beforeclose') === false){
			return;
		}
	
		var o = this.options, effect = o.hide, speed = this.speed;
		
		// figure out opening effects/speeds
		if( $.isArray(o.hide) ){
			effect = o.hide[0];
			speed = o.hide[1] || this.speed;
		}
	
		this.menu.hide(effect, speed);
		this.button.removeClass('ui-state-active').trigger('blur').trigger('mouseleave');
		this._isOpen = false;
		this._trigger('close');
	},

	enable: function(){
		this._toggleDisabled(false);
	},
	
	disable: function(){
		this._toggleDisabled(true);
	},
	
	checkAll: function( e ){
		this._toggleChecked(true);
		this._trigger('checkAll');
	},
	
	uncheckAll: function(){
		this._toggleChecked(false);
		this._trigger('uncheckAll');
	},
	
	getChecked: function(){
		return this.menu.find('input').filter('[checked]');
	},
	
	destroy: function(){
		// remove classes + data
		$.Widget.prototype.destroy.call( this );
		
		this.button.remove();
		this.menu.remove();
		this.element.show();
		
		return this;
	},
	
	isOpen: function(){
		return this._isOpen;
	},
	
	widget: function(){
		return this.menu;
	},
	
	// react to option changes after initialization
	_setOption: function( key, value ){
		var menu = this.menu;
		
		switch(key){
			case 'header':
				menu.find('div.ui-multiselect-header')[ value ? 'show' : 'hide' ]();
				break;
			case 'checkAllText':
				menu.find('a.ui-multiselect-all span').eq(-1).text(value);
				break;
			case 'uncheckAllText':
				menu.find('a.ui-multiselect-none span').eq(-1).text(value);
				break;
			case 'height':
				menu.find('ul').last().height( parseInt(value,10) );
				break;
			case 'minWidth':
				this.options[ key ] = parseInt(value,10);
				this._setButtonWidth();
				this._setMenuWidth();
				break;
			case 'selectedText':
			case 'selectedList':
			case 'noneSelectedText':
				this.options[key] = value; // these all needs to update immediately for the update() call
				this.update();
				break;
			case 'classes':
				menu.add(this.button).removeClass(this.options.classes).addClass(value);
				break;
		}
		
		$.Widget.prototype._setOption.apply( this, arguments );
	}
});

})(jQuery);

jQuery.fn.extend({  
	dateMaker: function(observable) {
		var $this = this.is('textarea') ? this : this.prev('textarea'),
			$cell = $this.parent(),
			$datepicker = $this.next('.date_controller').datepicker({ 
				dateFormat: 'D M dd yy',
				altField: $this,
				showButtonPanel: true,
				closeText: 'Close',
				onSelect: function(dateText, inst) { observable(dateText); $datepicker.datepicker('destroy') }
			}).datepicker('setDate', new Date( observable() ) ).prepend('<div class="close">X</div>')

		$(document).bind('mousedown.dateMaker', function(e) {
			if( !$.contains( $cell[0], e.target) && e.target !== $this[0] && !$(e.target).is($datepicker) ||  $(e.target).is('.close') ) {
				$datepicker.datepicker('destroy')
				$cell.removeClass('open')
			}
			$(this).unbind('click.dateMaker');
		});
		return $this
	}
})
