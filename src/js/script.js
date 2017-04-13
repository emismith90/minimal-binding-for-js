/*!
 * jQuery viewmodel plugin v1.0.0
 *
 * MIT License. by Hung.Le.
 */
(function ($) {
    $(document).ready(function() {

        var model = { 
            name: 'Hung',
            job: {
                position: "developer"
            }
        };
        // var observer = Observable.from(model);
        // var observer = model.toObservable();
        var observer = new Observable(model);

        $('#my-app').vm(observer);

        // setTimeout(function(){
        //     model.name = 'Hung + 2s';
        // }, 2000);
    });
})(jQuery);

