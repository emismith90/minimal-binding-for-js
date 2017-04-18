import { ObjectBrowser } from './objectBrowser'

export class Auditor {
    constructor(model) {
        let auditor;
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
            
            let objectBrowser = new ObjectBrowser();
            objectBrowser.traverse(model, auditor);
        }
        else {
            auditor = model.__auditor;
        }
    };
};
