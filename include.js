$(function() { 
	
	

});


(function ($) {
	
  var Kyle = function (select, options) { 
	
		var bugger = (function(){

			var debug = $('#debug-info');

			var addMessage = function(message){
				debug.prepend('<div>' + message + ' ::<span>  ' + new Date().toString() + '</span></div>');
			};

			return {
				addMessage: addMessage
			};

		})();
		
		var handler = (function(){
			
			var mouseOut = function(e){ 
				var target = $(e.target);
				if(target.hasClass('list-item')){
					bugger.addMessage("mouseout :: " + e.target + " :: index :: " + $(e.target).data('index'));
					target.removeClass('selected');				
				}
			};
			
			var mouseOver = function(e) {
				var target = $(e.target);
				if(target.hasClass('list-item')){
					bugger.addMessage("mouseover :: " + e.target + " :: index :: " + $(e.target).data('index'));
					target.addClass('selected');				
				}
			};
			
			var keyDown = function(e) {
        switch(e.keyCode) {
          case 9:  //Tab
						bugger.addMessage("Tab Selected")
            toggleDrop();
            break;
          case 13: //Enter
						bugger.addMessage("Enter Selected")
						filter.blur();
            toggleDrop();
            break;
          case 27: //Esc
						bugger.addMessage("Esc Selected")
            toggleDrop();
            break;
          case 38: //Up
            bugger.addMessage("Up Arrow")
						highlightItem(-1);
						break;
          case 40: //Down
          	bugger.addMessage("Down Arrow")
						highlightItem(1);
            break;
          default:
            //console.log(e.keyCode);
            break;
        }
			};
			
			return {
				mouseout: mouseOut,
				mouseover: mouseOver,
				keydown: keyDown
			};
			
		})();
	
		var _select = $(select),
		
		title = select.title || "Select Option...",
	  
		results = $('<ul/>', {
			"class": 'results',
			mouseout: function(e) {
				handler.mouseout(e);
			},
			mouseover: function(e) {
				if(listItems[highlightedPosition]){
					listItems[highlightedPosition].removeClass('selected');
				}
				highlightedPosition = $(e.target).data('index');
				handler.mouseover(e);
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
			keydown: handler.keydown,
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
		beenSelected = false,
		listItems = [];
		
		//_select.hide().after(container);
		_select.after(container);
		
		clicker.bind('click', function(e) {
			info.html('<span>Count: # </span>')
			toggleDrop();	
			if(beenSelected) { highlightSelected(_select.val()); }	
			filter.focus();  //not working
		});
		
		results.click(function(e) {
			toggleDrop();
			options.selected($(e.target));
			beenSelected = true;
			$('span', clicker).text(e.target.innerText);
			_select.val(e.target.value)			
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
		
		var highlightItem = function(number) {
			console.log(this);
			var items = $('li', results);
			
			if(highlightedPosition === -1 && number > 0) {
				highlightedPosition += number;
				$(items[highlightedPosition]).addClass('selected');
				return;
			}
			
			if(highlightedPosition === 0 && number < 0) { return; }
			
			if(highlightedPosition >= 0 && highlightedPosition < items.length - 1) {
				$(items[highlightedPosition]).removeClass('selected');
				highlightedPosition += number;
				$(items[highlightedPosition]).addClass('selected');
			}
			
			if(highlightedPosition === items.length - 1 && number < 0) {
				$(items[highlightedPosition]).removeClass('selected');
				highlightedPosition += number;
				$(items[highlightedPosition]).addClass('selected');
			}
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