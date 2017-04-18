import { ArrayProxyMutator, ObjectProxyMutator } from './mutators'
import { isArray, isObject } from '../util/_'

export function ObjectBrowser() {
    const arrayMutator = new ArrayProxyMutator(traverse);
    const objectMutator = new ObjectProxyMutator(traverse);

    function traverse(model, auditor, path) {
        if(!isObject(model)) return;

        model.__auditor = auditor;
        model.__path = path;
        if (isArray(model)) {
            loopThroughArray(model);
        } else {
            loopThroughKeys(model);
        }
    }

    function loopThroughKeys(model) {
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

    function loopThroughArray(arrs) {
        arrayMutator.interceptingMutatorMethods(arrs);

        for (var i = 0, l = arrs.length; i < l; i++) {
            traverse(arrs[i], arrs.__auditor, arrs.__path + '['+ i +']');
        }
    };

    return {
        traverse: traverse
    };
}

