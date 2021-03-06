(function($) {

$.fn.filterByText = function( value ) {
    return this.filter( function() {
        return $( this ).text().toLowerCase().indexOf(value.toString().toLowerCase()) !== -1;
    });
};

})(jQuery);

(function ($) {
	
  var Kyle = function (select, options) { 
		
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
            //console.log(filter.val());
            break;
        }
			};
			
			var keyUp = function(e) {
        switch(e.keyCode) {
          case 9:  //Tab
          case 13: //Enter
          case 27: //Esc
          case 38: //Up
          case 40: //Down
		        break;
          default:
						populateSelect($(listItems).filterByText(filter.val()));
            //console.log(filter.val());
            break;
        }
			};
			
			return {
				keydown: keyDown,
				keyup: keyUp
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
			keyup: function(e){
				handler.keyup(e);
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
		scrollPosition = undefined,
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
			toggleDrop();	
			if(selectedItem) { 
				results.trigger('highlightitem', selectedItem);
				results.scrollTop(scrollPosition);
			}	
			filter.focus(); 
		});
		
		results.click(function(e) {
			results.trigger('selectitem', e.target);	
		});
		
		results.bind('selectitem', function(e, item){
			var target = $(item)
			scrollPosition = results.scrollTop();
			toggleDrop();
			options.selected(target);
			highlightedItem = selectedItem = target;
			$('span', clicker).text(target.text());
			_select.val(target.val())
		});
		
		results.bind('highlightitem', function(e, item){
			var target = $(item),
			 		resultsHeight = results.outerHeight(),
			 		resultsOffsetTop = results.offset().top,
		 			itemOffsetTop = target.offset().top,
			 		itemHeight = target.outerHeight(),
			 		scrollTopPosition = results.scrollTop();
			
			if(target.hasClass('list-item')) {
				if((resultsOffsetTop + resultsHeight) < (itemOffsetTop + itemHeight)){
					results.scrollTop(results.scrollTop() + itemHeight);
				}
				if(resultsOffsetTop > itemOffsetTop) {
					results.scrollTop(results.scrollTop() - itemHeight);
				}
			}
			
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
			listItems.push(item);
		});
		
		
		
		var populateSelect = function(list) {
			var len = list.length, i = 0;
			results.empty();
			for( ; i < len; i++) {
				var item = $('<li/>', { 
					value: list[i].value,
					"class": 'list-item visible',
					"data-index": i
				}).html(list[i].innerHTML);
				results.append(item);
				info.html('<span>Count: ' + results.children().length +' </span>');
			}
			
			results.appendTo(drop);
			
		};
				
		populateSelect(listItems);
		
		var filterList = function( type, value ) {
		    return this.filter( function() {
		        var $this = $( this );

		        return value != null ?
		            $this.data( type ) === value :
		            $this.data( type ) != null;
		    });
		};
		
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