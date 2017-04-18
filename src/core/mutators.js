export class ArrayProxyMutator {
    
    constructor(traverse) {
        let arrayProto = Array.prototype;
        let arrayPrototype = Object.create(arrayProto);

        ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(
            function (method) {
            // cache original method
            let original = arrayProto[method];
            def(arrayPrototype, method, function mutator () {
                let arguments$1 = arguments;

                let i = arguments.length;
                let args = new Array(i);
                while (i--) {
                    args[i] = arguments$1[i];
                }

                let oldVal = this.length;
                let newVal = original.apply(this, args);
                
                traverse(this, this.__auditor, this.__path); 

                this.__auditor._propertyChanged({
                    property: this.__path,
                    oldValue: oldVal,
                    newValue: newVal,
                });

                return newVal;
            });
        });
    };
    
    interceptingMutatorMethods(target) {
        if(target.__arrayMutationIntercepted) return;

        target.__arrayMutationIntercepted = true;
        if(hasProto) {
            target.__proto__ = arrayPrototype;
        }
        else {
            let key =  Object.getOwnPropertyNames(arrayPrototype);
            for (let i = 0, l = keys.length; i < l; i++) {
                const key = keys[i]
                def(target, key, arrayPrototype[key])
            }
        }
    };
}

export class ObjectProxyMutator {
     constructor(traverse){

     };

     interceptingMutatorMethods (model, key) {
        const property = Object.getOwnPropertyDescriptor(model, key);
        if (property && property.configurable === false) {
            return;
        }
        
        let value = model[key];

        if(value.__objectMutationIntercepted) return;
        value.__objectMutationIntercepted = true;

        const setter = property && property.set;
        const getter = property && property.get;
        const prop = model.__path ? model.__path + '.' + key : key;

        Object.defineProperty(model, key, {
            enumerable: true,
            configurable: true,
            get: function proxyGetter () {
                return getter ? getter.call(model) : value;
            },
            set: function proxySetter (newVal) {
                const oldVal = getter ? getter.call(model) : value
                if (newVal === oldVal) {
                    return;
                }

                if (setter) {
                    setter.call(model, newVal)
                } else {
                    value = newVal
                }

                traverse(newVal, model.__auditor, model.__path);
                
                model.__auditor._propertyChanged({
                    property: prop,
                    oldValue: oldVal,
                    newValue: newVal,
                });
            }
        });
    };
}



