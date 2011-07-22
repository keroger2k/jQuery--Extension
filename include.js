(function ($) {
	
  var Kyle = function (select, options) { 
		var _select = $(select),
		
		debug = $('#debug-info'),
		
		title = select.title || "Select Option...",
	  
		results = $('<ul/>', {
			"class": 'results'
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
						debug.prepend("<div>Tab Selected</div>")
            toggleDrop();
            break;
          case 13: //Enter
						debug.prepend("<div>Enter Selected</div>")
						filter.blur();
            toggleDrop();
            break;
          case 27: //Esc
						debug.prepend("<div>Esc Selected</div>")
            toggleDrop();
            break;
          case 38: //Up
            debug.prepend("<div>Up Arrow</div>")
						highlightItem(-1);
						break;
          case 40: //Down
          	debug.prepend("<div>Down Arrow</div>")
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
		
		currentPosition = -1;
		
		_select.hide().after(container);
		
		clicker.bind('click', function(e) {
			info.html('<span>Count: # </span>')
			filter.focus();
			toggleDrop();		
		});
		
		results.click(function(e) {
			toggleDrop();
			options.selected($(e.target));
			$('span', clicker).text(e.target.innerText);
			_select.val(e.target.value)			
		});
		
		drop.hide().appendTo(container);
		
		$('option', _select).each(function(index, item) {
			results.append($('<li/>', { 
				value: this.value,
				"class": 'list-item' 
			}).html(this.innerHTML))
			.appendTo(drop);
		});
		
		var toggleDrop = function() {
			drop.is(":visible") ? drop.hide() : drop.show();
			container.toggleClass('container-active');
			clicker.toggleClass('with-drop');			
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