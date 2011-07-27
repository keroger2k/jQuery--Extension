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
						bugger.addMessage("Tab Selected");
            toggleDrop();
            break;
          case 13: //Enter
						bugger.addMessage("Enter Selected");
						filter.blur();
            toggleDrop();
            break;
          case 27: //Esc
						bugger.addMessage("Esc Selected");
            toggleDrop();
            break;
          case 38: //Up
						if(highlightedPosition <= 0) {
							return;
						}
						results.trigger('selectitem', results.children().eq(--highlightedPosition));
						break;
          case 40: //Down
						if(highlightedPosition === results.children().length - 1){
							return;
						}
						results.trigger('selectitem', results.children().eq(++highlightedPosition));
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
				$(this).trigger('selectitem', e.target);
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
		beenSelected = false,
		listItems = [];
		
		//_select.hide().after(container);
		_select.after(container);
		$('body').click(function(e) {
			drop.hide();
			container.removeClass('container-active');
			clicker.removeClass('with-drop');
		});
		
		clicker.bind('click', function(e) {
			e.stopPropagation();
			info.html('<span>Count: # </span>')
			toggleDrop();	
			if(beenSelected) { highlightSelected(_select.val()); }	
			filter.focus(); 
			bugger.addMessage("Results height: " + results.height() + " scrollTop: " + results.scrollTop());
			
			if(this.highlightedItem !== undefined) { 
				bugger.addMessage("Highlighted Item: " + highlightedItem.value)
			}
		});
		
		results.click(function(e) {
			toggleDrop();
			options.selected($(e.target));
			beenSelected = true;
			highlightedItem = $(e.target);
			$('span', clicker).text(e.target.innerText);
			_select.val(e.target.value)			
		});
		
		results.bind('selectitem', function(e, item){
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
		
		var highlightSelected = function(item) {
			$('li', results).removeClass('selected');
			$('li[value="' +item +'"]', results).addClass('selected');
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