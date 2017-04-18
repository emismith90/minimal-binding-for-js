function Auditor(model) {
    var auditor, objectBrowser;
    
    function initialize() {
        if(!model.__auditor) {
            auditor = this;
            auditor._target = model;
            auditor._callbacks = [];
            auditor._propertyChanged = function(args) {
                auditor._callbacks.forEach(function(callback) {
                    callback(args);
                });
            };

            auditor.onPropertyChanged = function(callback) {
                if (typeof callback === 'function') {
                    auditor._callbacks.push(callback);
                }
            };
            
            objectBrowser = new ObjectBrowser();
            objectBrowser.watchDeep(model, auditor);
        }
        else {
            auditor = model.__auditor;
        }
    };

    initialize();
    return auditor;
};
