(function ($) {
	
  var Kyle = function (select, options) { 
	
		var bugger = (function(){

			var debug = $('#debug-info');

			var addMessage = function(message){
				debug.prepend('<div>' + message + '<span style="float:right;">  ' + new Date().toString() + '</span></div>');
			};

			return {
				addMessage: addMessage
			};

		})();
		
		var handler = (function(){
			var keyDown = function(e) {
        switch(e.keyCode) {
          case 9:  //Tab
						toggleDrop();
            break;
          case 13: //Enter
						results.trigger('selectitem', highlightedItem);	
						filter.blur();
            break;
          case 27: //Esc
						toggleDrop();
            break;
          case 38: //Up
						if(highlightedPosition <= 0) {
							return;
						}
						results.trigger('highlightitem', results.children().eq(--highlightedPosition));
						break;
          case 40: //Down
						if(highlightedPosition === results.children().length - 1){
							return;
						}
						results.trigger('highlightitem', results.children().eq(++highlightedPosition));
		        break;
          default:
            //console.log(e.keyCode);
            break;
        }
			};
			
			return {
				keydown: keyDown
			};
			
		})();
	
		var _select = $(select),
		
		title = select.title || "Select Option...",
	  
		results = $('<ul/>', {
			"class": 'results',
			mouseover: function(e) {
				$(this).trigger('highlightitem', e.target);
				highlightedPosition = $(e.target).data('index');
			}
		}),
		
		container = $('<div/>', {
			"class": 'container'
		}),
		
		drop = $('<div/>', {
			"class": 'drop'
		}),
		
		info = $('<div/>', {
			"class": 'info-container'
		}).appendTo(drop),

    filter = $('<input/>', {
      type: "text",
      style: "width: 95%;",
			keydown: function(e) {
				handler.keydown(e);
			},
      focus: function(e) {
				$(this.target).focus();
			}
    }),
		
		search = $('<div/>', {
			"class": 'search'
		}).append(filter).appendTo(drop),
		
		clicker = $('<a/>', {
				href: '#',
				"class": "clicker",
		}).html('<span>' + title + '</span><div><b></b></div>').appendTo(container)
		
		highlightedPosition = -1,
		highlightedItem = undefined,
		selectedItem = undefined,
		beenSelected = false,
		listItems = [];
		
		//_select.hide().after(container);
		_select.after(container);
		$('body').click(function(e) {
			//drop.hide();
			//container.removeClass('container-active');
			//clicker.removeClass('with-drop');
		});
		
		clicker.bind('click', function(e) {
			e.stopPropagation();
			info.html('<span>Count: # </span>')
			toggleDrop();	
			if(selectedItem) { 
				results.trigger('highlightitem', selectedItem);
			}	
			filter.focus(); 
		});
		
		results.click(function(e) {
			results.trigger('selectitem', e.target);	
		});
		
		results.bind('selectitem', function(e, item){
			var target = $(item)
			toggleDrop();
			options.selected(target);
			highlightedItem = selectedItem = target;
			$('span', clicker).text(target.text());
			_select.val(target.val())
		});
		
		results.bind('highlightitem', function(e, item){
			var target = $(item);
			
			if(highlightedItem) {
				highlightedItem.removeClass('selected');	
			}
			
			if(target.hasClass('list-item')){
				highlightedItem = target;
				target.addClass('selected');				
			}
		});
		
		drop.hide().appendTo(container);
		
		$('option', _select).each(function(index, item) {
			var item = $('<li/>', { 
				value: this.value,
				"class": 'list-item visible',
				"data-index": index
			}).html(this.innerHTML);
			listItems.push(item);
			results.append(item)
				.appendTo(drop);
		});
		
		var toggleDrop = function() {
			drop.is(":visible") ? drop.hide() : drop.show();
			container.toggleClass('container-active');
			clicker.toggleClass('with-drop');			
		};
  };

  $.fn.extend({
    kyle: function (options) {

      var defaults = {
        opt1: 20,
				selected: function() {}
      }

      var options = $.extend(defaults, options);
      return $(this).each(function () {
        var o = options;
        return new Kyle(this, o);
      });
    }
  });

})(jQuery);