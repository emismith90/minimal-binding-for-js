/*!
 * jQuery viewmodel plugin v1.0.0
 *
 * MIT License. by Hung.Le.
 */
(function ($) {
    $(document).ready(function() {
        var component = new Component({el: '#my-app'})

        var viewmodel = {
            $model: { 
                name: 'Hung',
                job: {
                    position: "developer"
                },
                certificates: [ { type : 'a' }, { type : 'b' }, { type : 'c' } ]
            },
            $methods: {
                
            }
        };

        var auditor = new Auditor(viewmodel);

        auditor.onPropertyChanged(function(args) {
            console.log('update ' + args.property + ' ['+args.oldValue+'] -> [' + args.newValue + ']');
        });

        viewmodel.$model.name = "new";
        viewmodel.$model.name = "new2";
        viewmodel.$model.name = "new3";

        viewmodel.$model.job.position = 'pm';
        viewmodel.$model.job = { position: "developer" };
        viewmodel.$model.job.position = 'pm 2';

        viewmodel.$model.age = 10;
        viewmodel.$model.age = 12;

        viewmodel.$model.certificates[1].type = 'd';
        viewmodel.$model.certificates.push({type: 'e'});
        viewmodel.$model.certificates[3].type = 'f';
    });
})(jQuery);

