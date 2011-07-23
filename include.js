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
					bugger.addMessage("mouseout :: " + e.target);
					target.removeClass('selected');				
				}
			};
			
			var mouseOver = function(e) {
				var target = $(e.target);
				if(target.hasClass('list-item')){
					bugger.addMessage("mouseover :: " + e.target);
					target.addClass('selected');				
				}
			};
			
			var mouseEnter = function(e) {
				var target = $(e.target);
				if(target.hasClass('list-item')){
					bugger.addMessage("mouseenter :: " + e.target);
					//target.addClass('selected');				
				}
			};
			
			var mouseLeave = function(e) {
				var target = $(e.target);
				if(target.hasClass('list-item')){
					bugger.addMessage("mouseleave :: " + e.target);
					//target.addClass('selected');				
				}
			};
			
			return {
				mouseout: mouseOut,
				mouseover: mouseOver,
				mouseenter: mouseEnter,
				mouseleave: mouseLeave
			};
			
		})();
	
		var _select = $(select),
		
		title = select.title || "Select Option...",
	  
		results = $('<ul/>', {
			"class": 'results',
			mouseout: handler.mouseout,
			mouseenter: handler.mouseover,
			mouseleave: handler.mouseleave,
			mouseover: handler.mouseover
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
			},
			focus: function(e) {
					
			}
    }),
		
		search = $('<div/>', {
			"class": 'search'
		}).append(filter).appendTo(drop),
		
		clicker = $('<a/>', {
				href: '#',
				"class": "clicker",
		}).html('<span>' + title + '</span><div><b></b></div>').appendTo(container)
		
		currentPosition = -1,
		beenSelected = false;
		
		//_select.hide().after(container);
		_select.after(container);
		
		clicker.bind('click', function(e) {
			info.html('<span>Count: # </span>')
			filter.focus();  //not working
			toggleDrop();	
			if(beenSelected) { highlightSelected(_select.val()); }	
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
			results.append($('<li/>', { 
				value: this.value,
				"class": 'list-item',
			}).html(this.innerHTML))
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
			var items = $('li', results);
			
			if(currentPosition === -1 && number > 0) {
				currentPosition += number;
				$(items[currentPosition]).addClass('selected');
				return;
			}
			
			if(currentPosition === 0 && number < 0) { return; }
			
			if(currentPosition >= 0 && currentPosition < items.length - 1) {
				$(items[currentPosition]).removeClass('selected');
				currentPosition += number;
				$(items[currentPosition]).addClass('selected');
			}
			
			if(currentPosition === items.length - 1 && number < 0) {
				$(items[currentPosition]).removeClass('selected');
				currentPosition += number;
				$(items[currentPosition]).addClass('selected');
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