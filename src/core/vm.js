// (function ($) {
//     $.fn.vm = function (observableModel) {
//         vm.apply(this, [observableModel]);
//     };

//     var vm = function(observableModel) {
//         var $view = $(this),
//             $elements = $view.find('[vm-prop]');

//         var initialize = function() {
//             $elements.each(function (){
//                 var $el = $(this);
//                 var value = observableModel[$el.attr('vm-prop')];
                
//                 $el.bind(value);
//                 $el.valueChange(function() {
//                     observableModel[$el.attr('vm-prop')] = $(this).val();
//                 });
//             });
//         }

//         observableModel.onPropertyChanged(function(args) {
//             var $el = $view.find("[vm-prop='"+args.property+"']");
//             $el.bind(args.newValue);
//         });

//         initialize();
//     }
// })(jQuery);


function ViewModel(vm) {
    var auditor;
}