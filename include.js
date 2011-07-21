(function ($) {
	
  var Kyle = function (select, options) { 
		var _select = $(select),
		
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
		
		search = $('<div/>', {
			"class": 'search'
		}).html('<input type="text" style="width:95%;"/>').appendTo(drop),
		
		clicker = $('<a/>', {
				href: '#',
				"class": "clicker",
		}).html('<span>' + title + '</span><div><b></b></div>').appendTo(container);
		
		_select.hide().after(container);
		
		clicker.bind('click', function(e) {
			toggleDrop();		
		});
		
		results.click(function(e) {
			toggleDrop();
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
		
  };

  $.fn.extend({
    kyle: function (options) {

      var defaults = {
        opt1: 20
      }

      var options = $.extend(defaults, options);
      return $(this).each(function () {
        var o = options;
        return new Kyle(this, o);
      });
    }
  });

})(jQuery);