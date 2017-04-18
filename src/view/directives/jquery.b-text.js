// (function ($) {
//     var config = {
//         twowaysEnable: ['input', 'textarea', 'select']
//     };

//     var isSupport2WaysBinding = function (el) {
//         return config.twowaysEnable.indexOf(el.nodeName.toLowerCase()) !== -1;
//     };

//     $.fn.bind = function (value) {
//         var $this = $(this);
//         $this.each(function(index, item) {
//             var $el = $(item);
//             if(isSupport2WaysBinding(item)) {
//                 $el.val(value);
//             }
//             else {
//                 $el.html(value);
//             }
//         });
//     };

//     $.fn.valueChange = function (callback) {
//         if(typeof callback !== 'function') return;
//         var $this = $(this);
//         $this.each(function(index, item) {
//              var $el = $(item);
//             if(isSupport2WaysBinding(item)) {
//                 $el.on('keyup change', function(e) {
//                     callback.apply(this, [e]);
//                 });
//             }
//         });
//     };
// })(jQuery);
