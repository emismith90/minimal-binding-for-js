import { ArrayProxyMutator, ObjectProxyMutator } from './mutators'

export class ObjectBrowser {
    constructor() {
        this.arrayMutator = new ArrayProxyMutator(traverse);
        this.objectMutator = new ObjectProxyMutator(traverse);
    }

    traverse(model, auditor, path) {
        if(!isObject(model)) return;

        model.__auditor = auditor;
        model.__path = path;
        if (Array.isArray(model)) {
            loopThroughArray(model);
        } else {
            loopThroughKeys(model);
        }
    }

    loopThroughKeys(model) {
        const keys = Object.keys(model);
        for (var i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = model[keys[i]];

            // ignore internal properties
            if(key.startsWith('__')) continue;
            
            objectMutator.interceptingMutatorMethods(model, key);

            const propPath = model.__path ? model.__path + '.' + key : key;
            traverse(value, model.__auditor, propPath);
        }
    };

    loopThroughArrayfunction (arrs) {
        arrayMutator.interceptingMutatorMethods(arrs);

        for (var i = 0, l = arrs.length; i < l; i++) {
            traverse(arrs[i], arrs.__auditor, arrs.__path + '['+ i +']');
        }
    };
}

