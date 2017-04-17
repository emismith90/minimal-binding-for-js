function Auditor(model) {
    var auditor;
    
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
            
            traverse(model, auditor);
            
        }
        else {
            auditor = model.__auditor;
        }
    };

    function traverse(model, auditor, path) {
        model.__auditor = auditor;
        model.__path = path;
        if (Array.isArray(model)) {

            
            for (var i = 0, l = model.length; i < l; i++) {
                addArrayProxyMutator(model, interceptingMethods);

                model[i].__auditor = auditor;
                loopThroughKeys(model[i] + '['+ i +']');
            }
        } else {
            loopThroughKeys(model);
        }
    }

    // -----------------ARRAY MUTATOR----------------------------
    var arrayProto = Array.prototype;
    var interceptingMethods = Object.create(arrayProto);

    function addArrayProxyMutator(target, src) {
        if(hasProto) {
            target.__proto__ = src;
        }
        else{
            var key =  Object.getOwnPropertyNames(src);
            for (let i = 0, l = keys.length; i < l; i++) {
                const key = keys[i]
                def(target, key, src[key])
            }
        }
    }

    [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
    ]
    .forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(interceptingMethods, method, function mutator () {
        var arguments$1 = arguments;

        // avoid leaking arguments:
        // http://jsperf.com/closure-with-arguments
        var i = arguments.length;
        var args = new Array(i);
        while (i--) {
            args[i] = arguments$1[i];
        }

        var oldVal = this.length;
        var newVal = original.apply(this, args);
        var inserted;
        switch (method) {
        case 'push':
            inserted = args;
            break
        case 'unshift':
            inserted = args;
            break
        case 'splice':
            inserted = args.slice(2);
            break
        }
        if (inserted) { traverse(inserted, this.__auditor, this.__path); }

        // notify change
        this.__auditor._propertyChanged({
            property: this.__path,
            oldValue: oldVal,
            newValue: newVal,
        });

        return newVal
    });
    });

    // -----------------OBJECT MUTATOR---------------------------
    function loopThroughKeys(model) {
        const keys = Object.keys(model);
        for (let i = 0; i < keys.length; i++) {
            // ignore internal properties
            if(keys[i].startsWith('__')) continue;

            addObjectProxyMutator(model, keys[i], model[keys[i]]);
        }
    };

    function addObjectProxyMutator(model, key, value) {
        const property = Object.getOwnPropertyDescriptor(model, key);
        if (property && property.configurable === false) {
            return;
        }
        
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
               
                model.__auditor._propertyChanged({
                    property: prop,
                    oldValue: oldVal,
                    newValue: newVal,
                });
            }
        });

        traverse(value, model.__auditor, prop);
    };

    initialize();
    return auditor;
};


