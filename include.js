(function ($) {


  var Kyle = function (select, options) {
   
    $(select).bind('click', function (e) {
      console.log(e);
    });

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